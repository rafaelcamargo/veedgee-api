const { dbClient, handleTransaction } = require('../services/database');
const tracerService = require('../services/tracer');

const _public = {};

_public.save = (req, res) => handleTransaction(
  () => tracerService.run('events.save.db', () => dbClient.events.create({ data: req.body })),
  () => res.status(201).send(),
  res
);

_public.bulkSave = (req, res) => handleTransaction(
  () => tracerService.run('bulk.events.save.db', () => dbClient.events.createMany({ data: req.body, skipDuplicates: true })),
  result => res.status(201).send({ count: result.count }),
  res
);

_public.get = (req, res) => handleTransaction(
  () => tracerService.run('events.get.db', () => dbClient.events.findMany(buildFilter(req.query))),
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
