const Rollbar = require('rollbar');
const projectPkg = require('../../package');
const environmentService = require('../services/environment');
const { RollbarMock, rollbarInstanceMock } = require('../mocks/rollbar');
const errorService = require('./error');

jest.mock('rollbar');
Rollbar.mockImplementation(RollbarMock);

describe('Error Service', () => {
  it('should not track errors by default', async () => {
    errorService.init();
    errorService.track(new Error('some error'));
    expect(RollbarMock).not.toHaveBeenCalled();
    expect(rollbarInstanceMock.error).not.toHaveBeenCalled();
  });

  it('should track error on Rollbar if Rollbar token env var has been found', async () => {
    console.error = jest.fn();
    environmentService.get = jest.fn(() => ({ ROLLBAR_TOKEN: '123' }));
    const err = new Error('some error');
    errorService.init();
    expect(RollbarMock).toHaveBeenCalledWith({
      accessToken: expect.any(String),
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        code_version: projectPkg.version,
      }
    });
    errorService.track(err);
    expect(console.error).toHaveBeenCalledWith(err);
    expect(rollbarInstanceMock.error).toHaveBeenCalledWith(err);
  });
});
