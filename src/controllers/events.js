const { dbClient, handleTransaction } = require('../services/database');

const _public = {};

_public.save = (req, res) => handleTransaction(
  () => dbClient.events.create({ data: req.body }),
  () => res.status(201).send(),
  res
);

_public.get = (req, res) => handleTransaction(
  () => dbClient.events.findMany(buildFilter(req.query)),
  data => res.status(200).send(data),
  res
);

function buildFilter({ slug, minDate, minCreationDate }){
  return {
    where: {
      slug,
      date: {
        gte: minDate
      },
      created_at: {
        gte: buildIsoDateString(minCreationDate)
      }
    },
    orderBy: [
      { date: 'asc' },
      { time: 'asc' }
    ]
  };
}

function buildIsoDateString(dashedDateString){
  if(dashedDateString) {
    const [year, month, day] = dashedDateString.split('-').map(value => parseInt(value));
    return new Date(year, month - 1, day).toISOString();
  }
}

module.exports = _public;
