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

  async function saveEvent(event){
    return await serve().post('/events').set({ vatoken: 'vee123' }).send(event);
  }

  afterEach(async () => {
    await clearDbTable('events');
  });

  it('should not allow event creation by default', async () => {
    const response = await serve().post('/events').send(buildEvent());
    expect(response.status).toEqual(401);
  });

  it('should create an event', async () => {
    const event = buildEvent();
    const response1 = await serve().get(`/events?slug=${event.slug}`);
    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual([]);
    const response2 = await saveEvent(event);
    expect(response2.status).toEqual(201);
    const response3 = await serve().get(`/events?slug=${event.slug}`);
    expect(response3.status).toEqual(200);
    expect(response3.body).toEqual([{
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      time: null,
      category: null,
      description: null,
      image: null,
      venue: null,
      address: null,
      latitude: null,
      longitude: null,
      enhanced_title: null,
      enhanced_description: null,
      ...event
    }]);
  });

  it('should create an event with optional attributes', async () => {
    const event = buildEvent({
      title: 'My Full Event',
      slug: 'my-full-event-joinville-sc-20231229',
      url: '/some/service/my-full-event',
      time: '19:00',
      category: 'meetup',
      description: 'A great tech meetup in Joinville',
      image: 'https://example.com/event-cover.jpg',
      venue: 'Expoville',
      address: 'Rua XV de Novembro, 1000 - Centro, Joinville - SC',
      latitude: '-26.3044',
      longitude: '-48.8464',
      enhanced_title: 'Enhanced: My Full Event — Tech Meetup in Joinville',
      enhanced_description: 'An enhanced overview of a great tech meetup in Joinville, covering talks, networking, and community highlights for local developers.'
    });
    const response1 = await serve().get(`/events?slug=${event.slug}`);
    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual([]);
    const response2 = await saveEvent(event);
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

  it('should get all events ordered by ascending date by default', async () => {
    const event1 = buildEvent({
      title: 'First Event',
      slug: 'first-event-joinville-sc-20240215',
      date: '2024-02-17',
      time: '20:00'
    });
    const event2 = buildEvent({
      title: 'Second Event',
      slug: 'second-event-joinville-sc-20240217',
      date: '2024-02-15',
      time: '21:00'
    });
    const event3 = buildEvent({
      title: 'Third Event',
      slug: 'third-event-joinville-sc-20240217',
      date: '2024-02-17',
      time: '17:00'
    });
    await saveEvent(event1);
    await saveEvent(event2);
    await saveEvent(event3);
    const response = await serve().get('/events');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        category: null,
        description: null,
        image: null,
        venue: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event2
      },
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        category: null,
        description: null,
        image: null,
        venue: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event3
      },
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        category: null,
        description: null,
        image: null,
        venue: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event1
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
    await saveEvent(event1);
    await saveEvent(event2);
    await saveEvent(event3);
    const response = await serve().get('/events?minDate=2024-02-20');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        category: null,
        description: null,
        image: null,
        venue: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event3
      }
    ]);
  });

  it('should filter events by mininum creation date', async () => {
    const event1 = buildEvent({
      title: 'First Event',
      slug: 'first-event-joinville-sc-20240215',
      date: '2024-02-15',
      created_at: new Date(2024, 1, 10).toISOString(),
      updated_at: new Date(2024, 1, 10).toISOString()
    });
    const event2 = buildEvent({
      title: 'Second Event',
      slug: 'second-event-joinville-sc-20240217',
      date: '2024-02-17',
      created_at: new Date(2024, 1, 10).toISOString(),
      updated_at: new Date(2024, 1, 10).toISOString()
    });
    const event3 = buildEvent({
      title: 'Third Event',
      slug: 'third-event-joinville-sc-20240225',
      date: '2024-02-25',
      time: '20:00',
      created_at: new Date(2024, 1, 12).toISOString(),
      updated_at: new Date(2024, 1, 12).toISOString()
    });
    await saveEvent(event1);
    await saveEvent(event2);
    await saveEvent(event3);
    const response = await serve().get('/events?minCreationDate=2024-02-12');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        category: null,
        description: null,
        image: null,
        venue: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        ...event3
      }
    ]);
  });

  it('should filter events by minimum creation date, presence of description and absence of category', async () => {
    const matchingEvent = buildEvent({
      title: 'Matching Event',
      slug: 'matching-event-joinville-sc-20240225',
      date: '2024-02-25',
      description: 'An event with description and no category',
      created_at: new Date(2024, 1, 12).toISOString(),
      updated_at: new Date(2024, 1, 12).toISOString()
    });
    const olderEvent = buildEvent({
      title: 'Older Event',
      slug: 'older-event-joinville-sc-20240215',
      date: '2024-02-15',
      description: 'An older event with description and no category',
      created_at: new Date(2024, 1, 10).toISOString(),
      updated_at: new Date(2024, 1, 10).toISOString()
    });
    const categorizedEvent = buildEvent({
      title: 'Categorized Event',
      slug: 'categorized-event-joinville-sc-20240217',
      date: '2024-02-17',
      description: 'An event with description and category',
      category: 'meetup',
      created_at: new Date(2024, 1, 12).toISOString(),
      updated_at: new Date(2024, 1, 12).toISOString()
    });
    const undescribedEvent = buildEvent({
      title: 'Undescribed Event',
      slug: 'undescribed-event-joinville-sc-20240220',
      date: '2024-02-20',
      created_at: new Date(2024, 1, 12).toISOString(),
      updated_at: new Date(2024, 1, 12).toISOString()
    });
    await saveEvent(matchingEvent);
    await saveEvent(olderEvent);
    await saveEvent(categorizedEvent);
    await saveEvent(undescribedEvent);
    const response = await serve().get('/events?minCreationDate=2024-02-12&hasDescription=true&hasCategory=false');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        category: null,
        image: null,
        venue: null,
        address: null,
        latitude: null,
        longitude: null,
        enhanced_title: null,
        enhanced_description: null,
        time: null,
        ...matchingEvent
      }
    ]);
  });
});
