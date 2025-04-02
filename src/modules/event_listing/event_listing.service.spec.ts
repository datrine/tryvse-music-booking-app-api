import { Test, TestingModule } from '@nestjs/testing';
import { EventListingService } from './event_listing.service';
import { EventListingEntry } from '../../entities/event_listing_entry.entity';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { Repository } from 'typeorm';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';
import { EventListingEntryEntityProvider } from '../../entity_provider/event_listing_entry_entity.provider';
import { ARTIST_PROFILE_REPOSITORY, EVENT_LISTING_ENTRY_REPOSITORY } from '../../entity_provider/constant';
import { CreateEventListingEntryInput, GetMultipleEventListingEntryFiltersInput, UpdateEventListingEntryInput } from './types';
import { faker } from '@faker-js/faker/.';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';

describe('EventListingService', () => {
  let service: EventListingService;
    let container: StartedMySqlContainer
    let module: TestingModule
    beforeAll(async()=>{
        container = await getDbContainer()
        
       module = await Test.createTestingModule({
        providers: [EventListingService, GetDatabaseSourceProvider(container),
          EventListingEntryEntityProvider, ArtistProfileEntityProvider],
      }).compile();
    },500000)

    afterAll(async () => {
      await teardownMySqlContainer(container)
    })

  describe("createEventEntry", () => {
    let artist: ArtistProfile
    let eventListingRepository: Repository<EventListingEntry>

    beforeEach(async () => {
      service = module.get<EventListingService>(EventListingService);
      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
      let artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName(),
      })
    }, 500000);

    
    afterEach(async () => {
      await eventListingRepository.clear()
    })


    it("it should create event entry", async () => {
      let oo: CreateEventListingEntryInput = {
        title: faker.word.words(5),
        artist_id: artist.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        city: faker.location.city(),
        venue: faker.location.street()
      }
      let result = await service.createEventEntry(oo)
      expect(oo.title).toEqual(result.title)
      expect(oo.description).toEqual(result.description)
      expect(oo.date_and_time.getTime()).toEqual(result.date_and_time.getTime())
      //expect(result.id).toBeGreaterThan(0)
    })
  });

  describe("getMultipleEventEntry", () => {
    let eventListing: EventListingEntry[]
    let artistProfile: ArtistProfile
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>
    beforeEach(async () => {

      service = module.get<EventListingService>(EventListingService);
      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
       artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      artistProfile = await artistProfileRepository.save({
        email:faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      eventListing = await eventListingRepository.save([{
        title: faker.word.words(5),
        artist_id: artistProfile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.location.streetAddress(),
        city: faker.location.city()
      }, {
        title: faker.word.words(5),
        artist_id: artistProfile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.location.streetAddress(),
        city: faker.location.city()
      }, {
        title: faker.word.words(5),
        artist_id: artistProfile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.location.streetAddress(),
        city: faker.location.city()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await eventListingRepository.clear()
      await artistProfileRepository.clear()
    })

    it("it should get multiple event entry profiles with same title", async () => {
      let oo: GetMultipleEventListingEntryFiltersInput = {
        title: eventListing[0].title,
      }
      let result = await service.getMultipleEventEntry(oo)
      for (const item of result) {
        expect(item.title).toBe(oo.title)
      }
    })

  });

  describe("getEventEntryById", () => {
    let artistProfile: ArtistProfile
    let eventListing: EventListingEntry[]
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>

    beforeEach(async () => {
      service = module.get<EventListingService>(EventListingService);
      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
       artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      artistProfile = await artistProfileRepository.save({
        email:faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      eventListing = await eventListingRepository.save([{
        title: faker.word.words(5),
        artist_id: artistProfile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.location.streetAddress(),
        city: faker.location.city()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await eventListingRepository.clear()
      artistProfileRepository.clear()
    },10000)

    it("it should get event entry by id", async () => {
      let expected_profile = eventListing[0]
      let profile_id = expected_profile.id
      let result = await service.getEventEntryById(profile_id)
      expect(result).not.toBeFalsy()
      expect(result!.title).toEqual(expected_profile.title)
      expect(result!.date_and_time.toDateString()).toEqual(expected_profile.date_and_time.toDateString())
      expect(result!.venue).toEqual(expected_profile.venue)
      expect(result!.city).toEqual(expected_profile.city)
      expect(result!.description).toEqual(expected_profile.description)
      expect(result!.artist_id).toEqual(expected_profile.artist_id)
      expect(result!.id).toEqual(expected_profile.id)
    })

    it("it should throw if not existing event entry by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.getEventEntryById(profile_id)).rejects.toThrow()
    })

  });

  describe("editEventEntry", () => {
    let artistProfile:ArtistProfile
    let entry: EventListingEntry[]
    let eventEntryRepository: Repository<EventListingEntry>
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {

      service = module.get<EventListingService>(EventListingService);
      eventEntryRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
       artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      artistProfile = await artistProfileRepository.save({
        email:faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      entry = await eventEntryRepository.save([{
        title: faker.word.words(5),
        artist_id:artistProfile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.internet.displayName(),
        city: faker.location.city()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await eventEntryRepository.clear()
      await artistProfileRepository.clear()
    })

    it("it should update existing event entry by id", async () => {
      let expected_entry = entry[0]
      let profile_id = expected_entry.id
      let updates: UpdateEventListingEntryInput = {
        title: faker.person.firstName()
      }
      let result = await service.editEventEntry(profile_id, updates)
      expect(result).not.toBeFalsy()
      expect(result.title).toEqual(updates.title)
    })

    it("it should throw if not existing event entry by id", async () => {
      let updates: UpdateEventListingEntryInput = {
        title: faker.word.words()
      }
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.editEventEntry(profile_id, updates)).rejects.toThrow()
    })

  });

  describe("deleteEventEntry", () => {
    let artistProfile:ArtistProfile
    let entries: EventListingEntry[]
    let eventListingRepository: Repository<EventListingEntry>
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      service = module.get<EventListingService>(EventListingService);
      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
       artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      artistProfile = await artistProfileRepository.save({
        email:faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      entries = await eventListingRepository.save([{
        title: faker.word.words(5),
        artist_id:artistProfile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.internet.displayName(),
        city: faker.location.city()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await eventListingRepository.clear()
      await artistProfileRepository.clear()
    })

    it("it should delete existing event entry by id", async () => {
      let expected_entry = entries[0]
      let profile_id = expected_entry.id
      let result = await service.deleteEventEntry(profile_id)
      expect(result).not.toBeFalsy()
      expect(result!.affected).toEqual(1)
    })

    it("it should throw if not existing event entry by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.deleteEventEntry(profile_id)).rejects.toThrow()
    })

  });
});