const core = require('@actions/core');
import run from '../src/main';

type CapturedParams = {
    url?: string;
    data?: any;
    options?: any;
};

jest.mock('@actions/core', () => ({
    ...jest.requireActual('@actions/core'),
    setFailed: jest.fn().mockImplementation((message) => {
        console.log("core.setFailed called:", message);
    }),
    getIDToken: jest.fn().mockImplementation(() => 'token'),
}));
jest.mock('@actions/http-client', () => ({
    HttpClient: jest.fn().mockImplementation(() => ({
        post: jest.fn().mockImplementation((url, data, options) => {
            capturedParams = { url, data, options };
            const response: any = {
                message: {
                    statusCode: 200,
                    headers: {
                        'content-type': 'application/json',
                    },
                },
                readBody: jest.fn().mockResolvedValue(JSON.stringify({ message: 'success' })),
            };

            return Promise.resolve(response);
        }),
    })),
}));

let capturedParams: CapturedParams = {};

const setInputs = function (data: any) {
    const getInput = jest.fn().mockImplementation((name, params = {}) => {
        return data[name] || '';
    });
    core.getInput = getInput;
}

beforeEach(() => {
    capturedParams = {};
});

test("should send a deployment event", async () => {
    const input = {
        "componentid": 1,
        "message": "test",
        "type": "deployment",
        "canary": "false"
    };
    setInputs(input);

    const expected = {
        "data": {
            "payload": {
                "message": "test"
            },
            "sourceEventID": "65f77048-e68a-49c6-bb68-aadeedb4efe4",
            "type": "deployment",
            "startTime": "2025-02-26T13:50:20.386Z",
            "componentID": 1
        },
        "options": {
            "Authorization": "Bearer token"
        }
    };

    try {
        await run();
    } catch (error) {
        console.error(error);
    }

    const capturedData = JSON.parse(capturedParams.data);

    expect(capturedData).toEqual({
        ...expected.data,
        sourceEventID: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
        startTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
    });
    expect(capturedParams.options).toMatchObject(expected.options);
});

test("invalid event type should throw an error", async () => {
    const input = {
        "input": {
            "componentid": 1,
            "message": "test",
            "type": "invalid",
            "canary": "false"
        },
        "expected": {}
    };
    setInputs(input);

    try {
        await run();
    } catch (error) {
        expect(core.setFailed).toHaveBeenCalled();
    }
});
