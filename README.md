# Pulse-event for Github Actions

Send events to your resources in Pulse. Events will be visualized in metric graphs.

## Usage

Set up your resource in Pulse. On your resource page hit the ```Configure events``` button and add your repository URLs (e.g. https://github.com/elisa-actions/pulse-event) to allow the repository to send events to the resource.

Pulse uses Github identity tokens for access control. You need to have the following permissions set in your workflow/job

```yaml
    permissions:
      id-token: write
      contents: read
```

The action takes a resource id, type of deployment or incident, and a message related to the event as input. Resource id is filled automatically if you select `Copy actions step` from Pulse.

```yaml
    - name: Send event info to Pulse
      uses: elisa-actions/pulse-event@v1
      with:
        componentid: <id number of your resource>
        type: deployment
        message: <any text>
```
