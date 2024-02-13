const _public = {};

_public.rollbarInstanceMock = {
  error: jest.fn()
};

_public.RollbarMock = jest.fn(() => _public.rollbarInstanceMock);

module.exports = _public;
