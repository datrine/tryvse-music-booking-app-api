import { Test, TestingModule } from '@nestjs/testing';
import { BookingTransactionService } from './booking_transaction.service';
import { EventListingEntry } from '../../entities/event_listing_entry.entity';
import { Repository } from 'typeorm';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';
import { EventListingEntryEntityProvider } from '../../entity_provider/event_listing_entry_entity.provider';
import { ARTIST_PROFILE_REPOSITORY, BOOKING_TRANSACTION_REPOSITORY, EVENT_LISTING_ENTRY_REPOSITORY } from '../../entity_provider/constant';
import { BookingTxnStatusConfirmedPayload, CreateBookingTransactionInput, GetMultipleBookingTransactionFiltersInput, UpdateBookingTransactionInput } from './types';
import { faker } from '@faker-js/faker/.';
import { BookingTransaction, BookingTransactionStatus } from '../../entities/booking_transaction.entity';
import { BookingTransactionEntityProvider } from '../../entity_provider/booking_transaction_entity.provider';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { ArtistProfileService } from '../artist_profile/artist_profile.service';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { EventListingService } from '../event_listing/event_listing.service';

describe('BookingTransactionService', () => {
  let service: BookingTransactionService;
  let module: TestingModule
  let container: StartedMySqlContainer
  beforeAll(async () => {
    container = await getDbContainer()
     module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot({ delimiter: "." })],
      providers: [BookingTransactionService, EventListingService,
        GetDatabaseSourceProvider(container),
        ArtistProfileEntityProvider,
        BookingTransactionEntityProvider, EventListingEntryEntityProvider],
    }).compile();
    let app = module.createNestApplication()
    await app.init()
  }, 500000)

  afterAll(async () => {
    await teardownMySqlContainer(container)
  })

  describe("createArtistProfile", () => {
    let bookingTransactionRepository: Repository<BookingTransaction>
    let artistProfileRepository: Repository<ArtistProfile>
    let artist: ArtistProfile
    let eventEmitter: EventEmitter2

    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
      eventEmitter = module.get<EventEmitter2>(EventEmitter2)
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
       artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        stage_name: faker.internet.displayName(),
        first_name: faker.person.firstName(),
        last_name: faker.person.firstName(),
      })
    }, 500000);

    afterEach(async () => {
      await bookingTransactionRepository.clear()
      await artistProfileRepository.clear()
    })

    it("it should create artist booking transaction", async () => {
      let status:BookingTransactionStatus=BookingTransactionStatus.PENDING
      let oo: CreateBookingTransactionInput = {
        title: faker.word.words(5),
        date_and_time: faker.date.soon({ days: 200, }),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
      }
      let eventEmitSpy = jest.spyOn(eventEmitter, "emit")
      let result = await service.createBookingTxn(oo)
      expect(eventEmitSpy).toHaveBeenCalled()
      expect(oo.title).toEqual(result.title)
      expect(oo.description).toEqual(result.description)
      expect(oo.date_and_time.getTime()).toEqual(result.date_and_time.getTime())
      //expect(result.id).toBeGreaterThan(0)
    })
  });

  describe("getMultipleBookingTxn", () => {
    let profiles: BookingTransaction[]
    let bookingTxnRepository: Repository<BookingTransaction>
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTxnRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      let artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        stage_name: faker.internet.displayName(),
        first_name: faker.person.firstName(),
        last_name: faker.person.firstName(),
      })
      profiles = await bookingTxnRepository.save([{
        title: faker.word.words(5),
        date_and_time: faker.date.soon({ days: 200, }),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }, {
        title: faker.word.words(5),
        date_and_time: faker.date.soon({ days: 200, }),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }, {
        title: faker.word.words(5),
        date_and_time: faker.date.soon({ days: 200, }),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }
      ])
    }, 500000);

    afterEach(async () => {
      await bookingTxnRepository.clear()
      await artistProfileRepository.clear()
    })

    it("it should get multiple artist booking transaction with same first_name", async () => {
      let oo: GetMultipleBookingTransactionFiltersInput = {
        title: profiles[0].title,
      }
      let result = await service.getMultipleBookingTxn(oo)
      for (const item of result) {
        expect(item.title).toBe(oo.title)
      }
    })

  });

  describe("getBookingTxnById", () => {
    let booking_txns: BookingTransaction[]
    let artistProfileRepository: Repository<ArtistProfile>
    let bookingTxnRepository: Repository<BookingTransaction>

    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
       artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTxnRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);

      let artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        stage_name: faker.internet.displayName(),
        first_name: faker.person.firstName(),
        last_name: faker.person.firstName(),
      })

      booking_txns = await bookingTxnRepository.save([{
        title: faker.word.words(5),
        date_and_time: faker.date.soon({ days: 200 }),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        status:BookingTransactionStatus.PENDING
      }
      ])
    }, 500000);

    afterEach(async () => {
      await bookingTxnRepository.clear()
      await artistProfileRepository.clear()
    })

    it("it should get existing artist booking txn by id", async () => {
      let expected_profile = booking_txns[0]
      let profile_id = expected_profile.id
      let result = await service.getBookingTxnById(profile_id)
      expect(result).not.toBeFalsy()
      expect(result!.title).toEqual(expected_profile.title)
      expect(result!.date_and_time.toDateString()).toEqual(expected_profile.date_and_time.toDateString())
      expect(result!.description).toEqual(expected_profile.description)
      expect(result!.id).toEqual(expected_profile.id)
    })

    it("it should throw if not existing artist booking txn by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.getBookingTxnById(profile_id)).rejects.toThrow()
    })

  });

  describe("editBookingTxn", () => {
    let bookingTxns: BookingTransaction[]
    let artistProfileRepository: Repository<ArtistProfile>
    let bookingTransactionRepository: Repository<BookingTransaction>

    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);

      let artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })

      bookingTxns = await bookingTransactionRepository.save([{
        title: faker.word.words(),
        date_and_time: faker.date.soon(),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }
      ])
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it("it should update existing artist booking transaction by id", async () => {
      let expected_profile = bookingTxns[0]
      let profile_id = expected_profile.id
      let updates: UpdateBookingTransactionInput = {
        title: faker.word.words()
      }
      let result = await service.editBookingTxn(profile_id, updates)
      expect(result).not.toBeFalsy()
      expect(result.title).toEqual(updates.title)
    })

    it("it should throw if not existing booking transaction by id", async () => {
      let updates: UpdateBookingTransactionInput = {
        title: faker.word.words()
      }
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.editBookingTxn(profile_id, updates)).rejects.toThrow()
    })

  });

  describe("confirmBookingTxn", () => {
    let bookingTxns: BookingTransaction[]
    let artistProfileRepository: Repository<ArtistProfile>
    let bookingTransactionRepository: Repository<BookingTransaction>
    let artist:ArtistProfile
    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);

       artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })

      bookingTxns = await bookingTransactionRepository.save([{
        title: faker.word.words(),
        date_and_time: faker.date.soon(),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }
      ])
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it("it should set status to 'CONFIRMED' of existing artist booking transaction by id", async () => {
      let bookingTxn = bookingTxns[0]
      let profile_id = bookingTxn.id
      let result = await service.confirmBookingTxn(artist.id, profile_id)
      expect(result).not.toBeFalsy()
      expect(result.status===BookingTransactionStatus.CONFIRMED).toBeTruthy()
    })

    it("it should throw if not existing booking transaction by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.confirmBookingTxn(artist.id, profile_id)).rejects.toThrow()
    })

  });

  describe("cancelBookingTxn", () => {
    let bookingTxns: BookingTransaction[]
    let artistProfileRepository: Repository<ArtistProfile>
    let bookingTransactionRepository: Repository<BookingTransaction>
    let artist:ArtistProfile
    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);

       artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })

      bookingTxns = await bookingTransactionRepository.save([{
        title: faker.word.words(),
        date_and_time: faker.date.soon(),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }
      ])
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it("it should set status to 'CANCELLED' of existing artist booking transaction by id", async () => {
      let bookinTxn = bookingTxns[0]
      let profile_id = bookinTxn.id
      let result = await service.cancelBookingTxn(artist.id, profile_id)
      expect(result).not.toBeFalsy()
      expect(result.status===BookingTransactionStatus.CANCELLED).toBeTruthy()
    })

    it("it should throw if not existing booking transaction by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.cancelBookingTxn(artist.id, profile_id)).rejects.toThrow()
    })

  });
  
  describe("handleBookingTransactionConfirmedEvent", () => {
    let bookingTxns: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    let bookingTransactionRepository: Repository<BookingTransaction>
    let artist :ArtistProfile
    let eventListingService: EventListingService
    beforeEach(async () => {
      service = module.get<BookingTransactionService>(BookingTransactionService);
       eventListingService = module.get<EventListingService>(EventListingService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);

       artist = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })

      bookingTxns = await bookingTransactionRepository.save({
        title: faker.word.words(),
        date_and_time: faker.date.soon(),
        artist_id: artist.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      }
      )
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it("it should call 'createEventEntry'", async () => {
      let payload: BookingTxnStatusConfirmedPayload={
        id:faker.number.int(),
        artist_id:artist.id,
        title:bookingTxns.title,
        city:bookingTxns.city,
        description:bookingTxns.description,
        date_and_time:bookingTxns.date_and_time,
        venue:bookingTxns.venue,
        requester:bookingTxns.requester,
        status:BookingTransactionStatus.CONFIRMED
      }
      let spy=jest.spyOn(eventListingService,"createEventEntry")
      let result = await service.handleBookingTransactionConfirmedEvent(payload)
      expect(spy).toHaveBeenCalled()
    })

  });

  describe("deleteArtistProfile", () => {
    let artistProfile: ArtistProfile
    let artistProfileRepository: Repository<ArtistProfile>
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTxn: BookingTransaction

    beforeEach(async () => {

      service = module.get<BookingTransactionService>(BookingTransactionService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);

      artistProfile = await artistProfileRepository.save({
        email:faker.internet.email(),
        password:faker.internet.password(),
        title: faker.person.firstName(),
        last_name: faker.person.lastName(),
        first_name: faker.person.firstName(),
        stage_name: faker.internet.displayName()
      });

      bookingTxn = await bookingTransactionRepository.save({
        title: faker.word.words(),
        date_and_time: faker.date.soon(),
        artist_id: artistProfile.id,
        requester: faker.person.fullName(),
        description: faker.word.words(10),
        venue: faker.location.streetAddress(),
        city: faker.location.city(),
        status:BookingTransactionStatus.PENDING
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it("it should delete existing artist profile by id", async () => {
      let expected_booking = bookingTxn
      let profile_id = expected_booking.id
      let result = await service.deleteBookingTxn(profile_id)
      expect(result).not.toBeFalsy()
      expect(result!.affected).toEqual(1)
    })

    it("it should throw if not existing artist profile by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.deleteBookingTxn(profile_id)).rejects.toThrow()
    })

  });
});
