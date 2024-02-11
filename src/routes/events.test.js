const { serve } = require('../services/testing');

describe('Events Routes', () => {
  it('should create an event', async () => {
    const event = {
      title: 'My Event',
      slug: 'my-event-joinville-sc-20231229',
      date: '2023-12-29',
      time: '19:00',
      city: 'Joinville',
      state: 'SC',
      country: 'BR',
      url: '/some/service/my-event'
    };
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
});
