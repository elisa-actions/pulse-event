import * as core from '@actions/core'
import {
  HttpClient,
  HttpClientError,
  HttpClientResponse
} from '@actions/http-client'
import {v4 as uuidv4} from 'uuid'

type EventPayload = {
  message: string
}

type Event = {
  payload: EventPayload
  sourceEventID: string
  type: string
  startTime: string
  componentID: number
}

type ErrorResponse = {
  code: number
  message: string
}

const sendEvent = async (
  baseUrl: string,
  canary: boolean,
  token: string,
  event: Event
): Promise<HttpClientResponse> => {
  const maxRetries = 3
  let retryCount = 0

  const http = new HttpClient('pulse-event-action')
  const eventUrl = `${baseUrl}/v1/components/${event.componentID}/events`
  core.debug(`Sending event to ${eventUrl}`)

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`
  }

  if (canary) {
    headers['X-Canary'] = 'always'
  }

  while (retryCount < maxRetries) {
    try {
      return await http.post(eventUrl, JSON.stringify(event), headers)
    } catch (error) {
      retryCount++
      let errorMessage = 'Unknown error'
      if (error instanceof HttpClientError) {
        errorMessage = `${error.message} (Status: ${error.statusCode})`
      } else if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      core.info(
        `Sending event failed: ${errorMessage}, retrying (${retryCount}/${maxRetries})`
      )
      const delay = Math.pow(2, retryCount) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error('Request failed after maximum retries.')
}

async function run(): Promise<void> {
  try {
    const baseUrl =
      core.getInput('pulseBaseUrl') || 'https://pulse.csf.elisa.fi'
    const idToken = await core.getIDToken(baseUrl)

    const componentId = core.getInput('componentid', {required: true})
    const message = core.getInput('message', {required: true})
    const eventType = core.getInput('type', {required: true})
    const canary = core.getInput('canary', {required: false}) === 'true'
    const eventId = uuidv4()

    const eventTypes = ['deployment']
    if (!eventTypes.includes(eventType)) {
      core.setFailed(
        `Invalid event type: ${eventType}. Must be one of: deployment`
      )
      return
    }

    const event: Event = {
      payload: {
        message
      },
      sourceEventID: eventId,
      type: eventType,
      startTime: new Date().toISOString(),
      componentID: parseInt(componentId)
    }

    const res = await sendEvent(baseUrl, canary, idToken, event)
    const responseBody = await res.readBody()

    core.debug(`Response status code: ${res.message.statusCode}`)
    core.debug(`Response body: ${responseBody}`)
    core.debug(`Response headers: ${JSON.stringify(res.message.headers)}`)

    if (res.message.statusCode && res.message.statusCode > 299) {
      const errorResponse: ErrorResponse = JSON.parse(responseBody)
      core.setFailed(`Failed to send event: ${errorResponse.message}`)
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

if (!process.env.JEST_WORKER_ID) {
  run()
}

export default run
