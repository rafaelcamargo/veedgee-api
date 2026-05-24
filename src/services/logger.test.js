const Bugsnag = require('@bugsnag/js');
const projectPkg = require('../../package');
const loggerService = require('./logger');

describe('Logger Service', () => {
  function createEventMock(){
    return {
      context: undefined,
      addMetadata: jest.fn()
    };
  }

  beforeEach(() => {
    console.error = jest.fn();
    Bugsnag.start = jest.fn();
    Bugsnag.notify = jest.fn();
  });

  it('should track error on Bugsnag if Bugsnag token env var has been found', async () => {
    const err = new Error('some error');
    const event = createEventMock();
    Bugsnag.notify = jest.fn((error, cb) => cb(event));
    loggerService.init();
    expect(Bugsnag.start).toHaveBeenCalledWith({
      apiKey: expect.any(String),
      appVersion: projectPkg.version,
      releaseStage: expect.any(String),
      metadata: {
        app: {
          name: projectPkg.name,
          version: projectPkg.version
        },
        api: {
          service: 'veedgee-api'
        }
      }
    });
    loggerService.track('Database Transaction Error', err);
    expect(console.error).toHaveBeenCalledWith('Database Transaction Error', err);
    expect(Bugsnag.notify).toHaveBeenCalledWith(err, expect.any(Function));
    expect(event.context).toBe('Database Transaction Error');
    expect(event.addMetadata).not.toHaveBeenCalled();
  });

  it('should optionally attach metadata on Bugsnag notifications', async () => {
    const event = createEventMock();
    Bugsnag.notify = jest.fn((err, cb) => cb(event));
    const err = new Error('some error');
    loggerService.init();
    loggerService.track('Database Transaction Error', err, { operation: 'create' });
    expect(console.error).toHaveBeenCalledWith('Database Transaction Error', err);
    expect(Bugsnag.notify).toHaveBeenCalledWith(err, expect.any(Function));
    expect(event.context).toBe('Database Transaction Error');
    expect(event.addMetadata).toHaveBeenCalledWith('custom details', { operation: 'create' });
  });

  it('should not set metadata when event metadata section is absent', async () => {
    const event = createEventMock();
    Bugsnag.notify = jest.fn((err, cb) => cb(event));
    const err = new Error('some error');
    const eventName = 'Database Transaction Error';
    loggerService.init();
    loggerService.track(eventName, err);
    expect(console.error).toHaveBeenCalledWith(eventName, err);
    expect(Bugsnag.notify).toHaveBeenCalledWith(err, expect.any(Function));
    expect(event.context).toEqual(eventName);
    expect(event.addMetadata).not.toHaveBeenCalled();
  });

  it('should not notify Bugsnag when err is absent', async () => {
    loggerService.init();
    loggerService.track('Database Transaction Error', null);
    expect(console.error).not.toHaveBeenCalled();
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });
});
