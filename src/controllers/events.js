const { dbClient, handleTransaction } = require('../services/database');

const _public = {};

_public.save = (req, res) => handleTransaction(
  () => dbClient.events.create({ data: req.body }),
  () => res.status(201).send(),
  res
);

_public.bulkSave = (req, res) => handleTransaction(
  () => dbClient.events.createMany({ data: req.body, skipDuplicates: true }),
  result => res.status(201).send({ count: result.count }),
  res
);

_public.bulkUpdate = (req, res) => handleTransaction(
  () => Promise.all(req.body.map(buildEventUpdate)),
  result => res.status(200).send({ count: result.length }),
  res
);

_public.get = (req, res) => handleTransaction(
  () => dbClient.events.findMany(buildFilter(req.query)),
  data => res.status(200).send(data),
  res
);

function buildFilter({ slug, minDate, minCreationDate, hasDescription, hasCategory }){
  return {
    where: {
      slug,
      date: {
        gte: minDate
      },
      created_at: {
        gte: buildIsoDateString(minCreationDate)
      },
      ...buildNullablePresenceFilter('description', hasDescription),
      ...buildNullablePresenceFilter('category', hasCategory)
    },
    orderBy: [
      { date: 'asc' },
      { time: 'asc' }
    ]
  };
}

function buildNullablePresenceFilter(field, flag){
  if(flag === 'true') return { [field]: { not: null } };
  if(flag === 'false') return { [field]: null };
  return {};
}

function buildIsoDateString(dashedDateString){
  if(dashedDateString) {
    const [year, month, day] = dashedDateString.split('-').map(value => parseInt(value));
    return new Date(year, month - 1, day).toISOString();
  }
}

function buildEventUpdate({ id, ...data }){
  return dbClient.events.update({
    where: { id },
    data
  });
}

module.exports = _public;
