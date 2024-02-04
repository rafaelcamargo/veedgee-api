const _public = {};

_public.handleTransaction = (request, onSuccess, res) => {
  request()
    .then(data => onSuccess(data))
    .catch(err => res.status(500).send(err));
};

module.exports = _public;
