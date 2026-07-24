const { serve, clearDbTable } = require('../services/testing');

describe('Bulk Routes', () => {
  function buildEvent(customAttrs = {}){
    return {
      title: 'My Event',
      slug: 'my-event-joinville-sc-20231229',
      date: '2023-12-29',
      city: 'Joinville',
      state: 'SC',
      country: 'BR',
      url: '/some/service/my-event',
      ...customAttrs
    };
  }

  async function bulkSaveEvents(events){
    return await serve().post('/bulk/events').set({ vatoken: 'vee123' }).send(events);
  }

  async function bulkPatchEvents(events){
    return await serve().patch('/bulk/events').set({ vatoken: 'vee123' }).send(events);
  }

  afterEach(async () => {
    await clearDbTable('events');
  });

  it('should not allow bulk event creation by default', async () => {
    const response = await serve().post('/bulk/events').send([buildEvent()]);
    expect(response.status).toEqual(401);
  });

  it('should not allow bulk event update by default', async () => {
    const response = await serve().patch('/bulk/events').send([{ id: 'some-id', category: 'meetup' }]);
    expect(response.status).toEqual(401);
  });

  it('should bulk save multiple events', async () => {
    const event1 = buildEvent({
      title: 'First Event',
      slug: 'first-event-joinville-sc-20240215',
      date: '2024-02-15'
    });
    const event2 = buildEvent({
      title: 'Second Event',
      slug: 'second-event-joinville-sc-20240217',
      date: '2024-02-17'
    });
    const response1 = await serve().get('/events');
    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual([]);
    const response2 = await bulkSaveEvents([event1, event2]);
    expect(response2.status).toEqual(201);
    expect(response2.body).toEqual({ count: 2 });
    const response3 = await serve().get('/events');
    expect(response3.status).toEqual(200);
    expect(response3.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        time: null,
        category: null,
        description: null,
        image: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event1
      },
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        time: null,
        category: null,
        description: null,
        image: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event2
      }
    ]));
    expect(response3.body).toHaveLength(2);
  });

  it('should skip duplicate events when bulk saving', async () => {
    const existingEvent = buildEvent({
      title: 'Existing Event',
      slug: 'existing-event-joinville-sc-20240215',
      date: '2024-02-15'
    });
    const newEvent = buildEvent({
      title: 'New Event',
      slug: 'new-event-joinville-sc-20240217',
      date: '2024-02-17'
    });
    await bulkSaveEvents([existingEvent]);
    const response = await bulkSaveEvents([existingEvent, newEvent]);
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ count: 1 });
    const listResponse = await serve().get('/events');
    expect(listResponse.status).toEqual(200);
    expect(listResponse.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        time: null,
        category: null,
        description: null,
        image: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...existingEvent
      },
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        time: null,
        category: null,
        description: null,
        image: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...newEvent
      }
    ]));
    expect(listResponse.body).toHaveLength(2);
  });

  it('should bulk patch events partially', async () => {
    const event1 = buildEvent({
      title: 'First Event',
      slug: 'first-event-joinville-sc-20240215',
      date: '2024-02-15'
    });
    const event2 = buildEvent({
      title: 'Second Event',
      slug: 'second-event-joinville-sc-20240217',
      date: '2024-02-17'
    });
    await bulkSaveEvents([event1, event2]);
    const response1 = await serve().get('/events');
    expect(response1.status).toEqual(200);
    const [savedEvent1, savedEvent2] = response1.body;
    const patchResponse = await bulkPatchEvents([{
      id: savedEvent1.id,
      description: 'A great tech meetup in Joinville',
      category: 'meetup'
    }]);
    expect(patchResponse.status).toEqual(200);
    expect(patchResponse.body).toEqual({ count: 1 });
    const response2 = await serve().get('/events');
    expect(response2.status).toEqual(200);
    expect(response2.body).toEqual([
      {
        id: savedEvent1.id,
        created_at: savedEvent1.created_at,
        updated_at: savedEvent1.updated_at,
        time: null,
        image: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event1,
        description: 'A great tech meetup in Joinville',
        category: 'meetup'
      },
      {
        id: savedEvent2.id,
        created_at: savedEvent2.created_at,
        updated_at: savedEvent2.updated_at,
        time: null,
        category: null,
        description: null,
        image: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event2
      }
    ]);
  });
});
