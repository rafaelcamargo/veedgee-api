const ResponseMock = require('../mocks/response');
const { pause } = require('./testing');
const { handleTransaction } = require('./database');
const errorService = require('./error');

describe('Database Service', () => {
  it('should execute success callback on transaction success', async () => {
    const data = { some: 'data' };
    const request = () => Promise.resolve(data);
    const onSuccess = jest.fn();
    handleTransaction(request, onSuccess);
    await pause(100);
    expect(onSuccess).toHaveBeenCalledWith(data);
  });

  it('should respond with error on transaction error', async () => {
    errorService.track = jest.fn();
    const err = { some: 'err' };
    const request = () => Promise.reject(err);
    const res = new ResponseMock();
    handleTransaction(request, jest.fn(), res);
    await pause(100);
    expect(errorService.track).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(err);
  });
});
