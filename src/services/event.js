const { removeAccents } = require('./text');

const _public = {};

_public.buildSlug = event => {
  const { title, date, time } = event;
  return formatEventSlug(`${title}-${date.replace(/-/g,'')}-${time.replace(':','')}`);
};

function formatEventSlug(text){
  return removeAccents(text.toLowerCase().replace(/ /g, '-'));
}

module.exports = _public;
