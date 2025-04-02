import { Test, TestingModule } from '@nestjs/testing';
import { EventListingController } from './event_listing.controller';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { Repository } from 'typeorm';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { BookingTransactionService } from '../booking_transaction/booking_transaction.service';
import { ArtistProfileService } from '../artist_profile/artist_profile.service';
import { EventListingEntryEntityProvider } from '../../entity_provider/event_listing_entry_entity.provider';
import { EventListingService } from './event_listing.service';
import { BookingTransactionEntityProvider } from '../../entity_provider/booking_transaction_entity.provider';
import { faker } from '@faker-js/faker/.';
import { ARTIST_PROFILE_REPOSITORY, BOOKING_TRANSACTION_REPOSITORY, EVENT_LISTING_ENTRY_REPOSITORY } from '../../entity_provider/constant';
import { HttpStatus } from '@nestjs/common';
import { CreateEventListingEntryRequestBodyDTO, GetMultipleEventListingEntriesRequestQueryDTO, UpdateEventListingEntryRequestBodyDTO } from './dto/request.dto';
import { BookingTransaction, BookingTransactionStatus } from '../../entities/booking_transaction.entity';
import { EventListingEntry } from '../../entities/event_listing_entry.entity';

describe('EventListingController', () => {
  let controller: EventListingController;
  let module: TestingModule
  let container: StartedMySqlContainer
  beforeAll(async()=>{
      container = await getDbContainer()
      module = await Test.createTestingModule({
        imports: [EventEmitterModule.forRoot({ delimiter: "." })],
        controllers: [EventListingController],
        providers: [
          ArtistProfileService, BookingTransactionService, EventListingService,
          GetDatabaseSourceProvider(container),
          EventListingEntryEntityProvider,
          ArtistProfileEntityProvider,
          BookingTransactionEntityProvider,]

      }).compile();
  },500000)

  afterAll(async () => {
    await teardownMySqlContainer(container)
  })


  describe("create", () => {
    let profile: ArtistProfile
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>
    let entries: Array<EventListingEntry>
    beforeEach(async () => {
      controller = module.get<EventListingController>(EventListingController);


      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      eventListingRepository = module.get<Repository<BookingTransaction>>(EVENT_LISTING_ENTRY_REPOSITORY);
      profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      entries = await eventListingRepository.save([{
        title: faker.word.words(5),
        artist_id: profile.id,
        description: faker.word.words(10),
        date_and_time: faker.date.soon({ days: 200, }),
        venue: faker.internet.displayName(),
        city: faker.location.city()
      }])
    }, 500000);

    afterEach(async () => {
      await eventListingRepository.clear()
      await artistProfileRepository.clear()
    })

    it('should create entry', async () => {
      let dto: CreateEventListingEntryRequestBodyDTO = {
        artist_id: profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      }
      let result = await controller.create(dto)
      expect(result.statusCode).toEqual(HttpStatus.CREATED)
      expect(result.data.title).toEqual(dto.title)
      expect(result.data.description).toEqual(dto.description)
      expect(result.data.date_and_time).toEqual(dto.date_and_time)
    });
  });

  describe("getMultiple", () => {
    let artist: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>
    let entries: Array<EventListingEntry>
    beforeEach(async () => {
      controller = module.get<EventListingController>(EventListingController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      eventListingRepository = module.get<Repository<BookingTransaction>>(EVENT_LISTING_ENTRY_REPOSITORY);
      artist = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })

      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: artist.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
      
      entries = await eventListingRepository.save([{
        artist_id: artist.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      }])
    }, 500000);


    afterEach(async () => {
      await eventListingRepository.clear()
      await artistProfileRepository.clear()
    })

    it('should get multiple entries with same title name', async () => {
      let dto: GetMultipleEventListingEntriesRequestQueryDTO = {
        title: entries[0].title,
      }
      let result = await controller.getMultiple(dto)
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.data.length > 0).toBeTruthy()
    });
  });

  describe("getById", () => {
    let existing_profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>
    let entries: Array<EventListingEntry>
    beforeEach(async () => {
      controller = module.get<EventListingController>(EventListingController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      entries = await eventListingRepository.save([{
        artist_id: existing_profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      }])
    }, 500000);

    afterEach(async () => {
      await eventListingRepository.clear()
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it('should fetch existing entry by id', async () => {
      let entry = entries[0]
      let id = entry.id
      let result = await controller.getById(id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });

  describe("editById", () => {
    let artist: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>
    let entries: Array<EventListingEntry>
    beforeEach(async () => {

      controller = module.get<EventListingController>(EventListingController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      artist = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: artist.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
      entries = await eventListingRepository.save([{
        title: faker.word.words(5),
        artist_id: artist.id,
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
      await bookingTransactionRepository.clear()
    })

    it('should edit existing entry by id', async () => {
      let dto: UpdateEventListingEntryRequestBodyDTO = {
        title: bookingTransaction.title
      }
      let entry=entries[0]
      let entry_id = entry.id
      let result = await controller.editById(entry_id, dto)
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.data.title).toEqual(dto.title)
    });
  });

  describe("deleteById", () => {
    let artist: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    let eventListingRepository: Repository<EventListingEntry>
    let entries: Array<EventListingEntry>
    beforeEach(async () => {

      controller = module.get<EventListingController>(EventListingController);

      eventListingRepository = module.get<Repository<EventListingEntry>>(EVENT_LISTING_ENTRY_REPOSITORY);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      artist = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: artist.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
      entries = await eventListingRepository.save([{
        title: faker.word.words(5),
        artist_id: artist.id,
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

    it('should delete existing entry by id', async () => {
      let profile_id = artist.id
      let result = await controller.deleteById(profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });
});
