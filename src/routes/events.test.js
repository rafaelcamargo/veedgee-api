const { serve } = require('../services/testing');

describe('Events Routes', () => {
  it('should create an event', async () => {
    const event = {
      title: 'My Event',
      date: '2023-12-29',
      time: '19:00',
      city: 'Joinville',
      state: 'SC',
      country: 'BR',
      url: '/some/service/my-event'
    };
    const response1 = await serve().get('/events?slug=my-event-20231229-1900');
    console.log({ response1 });
    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual([]);
    const response2 = await serve().post('/events').send(event);
    expect(response2.status).toEqual(201);
    const response3 = await serve().get('/events?slug=my-event-20231229-1900');
    expect(response3.status).toEqual(200);
    expect(response3.body).toEqual([{
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      time: '19:00',
      title: event.title,
      slug: 'my-event-20231229-1900',
      date: event.date,
      city: event.city,
      state: event.state,
      country: event.country,
      url: event.url
    }]);
  });
});
