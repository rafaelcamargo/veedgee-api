const { serve, clearDbTable } = require('../services/testing');

describe('Events Routes', () => {
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

  afterEach(async () => {
    await clearDbTable('events');
  });

  it('should create an event', async () => {
    const event = buildEvent();
    const response1 = await serve().get(`/events?slug=${event.slug}`);
    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual([]);
    const response2 = await serve().post('/events').send(event);
    expect(response2.status).toEqual(201);
    const response3 = await serve().get(`/events?slug=${event.slug}`);
    expect(response3.status).toEqual(200);
    expect(response3.body).toEqual([{
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      time: null,
      ...event
    }]);
  });

  it('should create an event optionally passing event time', async () => {
    const event = buildEvent({
      title: 'My Other Event',
      slug: 'my-other-event-joinville-sc-20231229',
      url: '/some/other/service/my-other-event',
      time: '19:00'
    });
    const response1 = await serve().get(`/events?slug=${event.slug}`);
    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual([]);
    const response2 = await serve().post('/events').send(event);
    expect(response2.status).toEqual(201);
    const response3 = await serve().get(`/events?slug=${event.slug}`);
    expect(response3.status).toEqual(200);
    expect(response3.body).toEqual([{
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      ...event
    }]);
  });

  it('should get all events', async () => {
    const event1 = buildEvent({
      title: 'First Event',
      slug: 'first-event-joinville-sc-20240215',
      date: '2024-02-15',
      time: '20:00'
    });
    const event2 = buildEvent({
      title: 'Second Event',
      slug: 'second-event-joinville-sc-20240217',
      date: '2024-02-17',
      time: '21:00'
    });
    await serve().post('/events').send(event1);
    await serve().post('/events').send(event2);
    const response = await serve().get('/events');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...event1
      },
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...event2
      }
    ]);
  });

  it('should filter events by mininum date', async () => {
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
    const event3 = buildEvent({
      title: 'Second Event',
      slug: 'second-event-joinville-sc-20240225',
      date: '2024-02-25',
      time: '20:00'
    });
    await serve().post('/events').send(event1);
    await serve().post('/events').send(event2);
    await serve().post('/events').send(event3);
    const response = await serve().get('/events?minDate=2024-02-20');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...event3
      }
    ]);
  });
});
