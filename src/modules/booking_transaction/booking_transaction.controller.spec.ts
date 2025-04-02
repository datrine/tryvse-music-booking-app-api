import { Test, TestingModule } from '@nestjs/testing';
import { BookingTransactionController } from './booking_transaction.controller';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { ArtistProfileService } from '../artist_profile/artist_profile.service';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { BookingTransactionEntityProvider } from '../../entity_provider/booking_transaction_entity.provider';
import { CreateBookingTransactionRequestBodyDTO, GetMultipleBookingTransactionsRequestQueryDTO, UpdateBookingTransactionRequestBodyDTO } from './dto/request.dto';
import { faker } from '@faker-js/faker/.';
import { HttpStatus } from '@nestjs/common';
import { ArtistProfile } from 'src/entities/artist_profile.entity';
import { Repository } from 'typeorm';
import { ARTIST_PROFILE_REPOSITORY, BOOKING_TRANSACTION_REPOSITORY } from '../../entity_provider/constant';
import { BookingTransaction, BookingTransactionStatus } from '../../entities/booking_transaction.entity';
import { EventListingEntryEntityProvider } from '../../entity_provider/event_listing_entry_entity.provider';
import { BookingTransactionService } from './booking_transaction.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventListingService } from '../event_listing/event_listing.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

describe('BookingTransactionController', () => {
  let controller: BookingTransactionController;
  let module: TestingModule
  let container: StartedMySqlContainer
  beforeAll(async () => {
    container = await getDbContainer()
    module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot({ delimiter: "." }),
      JwtModule.registerAsync({
        global: true,
        useFactory: async () => {
          let res: JwtModuleOptions = {
            secret: "secret_key",
          }
          return res
        },
      }),],
      controllers: [BookingTransactionController],
      providers: [ArtistProfileService, BookingTransactionService,
        EventListingService, GetDatabaseSourceProvider(container),
        BookingTransactionEntityProvider, ArtistProfileEntityProvider, EventListingEntryEntityProvider]

    }).compile();
  }, 500000)

  afterAll(async () => {
    await teardownMySqlContainer(container)
  })

  describe("create", () => {
    let profile: ArtistProfile
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {

      controller = module.get<BookingTransactionController>(BookingTransactionController);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it('should create booking transaction', async () => {
      let dto: CreateBookingTransactionRequestBodyDTO = {
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
    let profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      controller = module.get<BookingTransactionController>(BookingTransactionController);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it('should get multiple booking with same title name', async () => {
      let dto: GetMultipleBookingTransactionsRequestQueryDTO = {
        title: bookingTransaction.title,
      }
      let result = await controller.getMultiple(dto)
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.data.length > 0).toBeTruthy()
    });
  });

  describe("getById", () => {
    let profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      controller = module.get<BookingTransactionController>(BookingTransactionController);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it('should fetch existing booking transaction by id', async () => {
      let profile_id = profile.id
      let result = await controller.getById(profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });

  describe("editById", () => {
    let profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {

      controller = module.get<BookingTransactionController>(BookingTransactionController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it('should edit existing artist profile by id', async () => {
      let dto: UpdateBookingTransactionRequestBodyDTO = {
        title: faker.person.firstName()
      }
      let profile_id = profile.id
      let result = await controller.editById(profile_id, dto)
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.data.title).toEqual(dto.title)
    });
  });

  describe("confirmBookingById", () => {
    let existing_profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {

      controller = module.get<BookingTransactionController>(BookingTransactionController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: existing_profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 }),
        status: BookingTransactionStatus.PENDING
      })
    }, 500000);

    afterEach(async () => {
      await bookingTransactionRepository.clear()
      await artistProfileRepository.clear()
    })

    it('should confirm existing booking transaction by id', async () => {
      let profile_id = existing_profile.id
      let req = { user: { id: profile_id } }
      let result = await controller.confirmBookingById(req as any, profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });

  describe("cancelBookingById", () => {
    let existing_profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {

      controller = module.get<BookingTransactionController>(BookingTransactionController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: existing_profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 }),
        status: BookingTransactionStatus.PENDING
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it('should cancel existing booking transaction by id', async () => {
      let profile_id = existing_profile.id
      let req = { user: { id: profile_id } }
      let result = await controller.cancelBookingById(req as any, profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });

  describe("deleteById", () => {
    let existing_profile: ArtistProfile
    let bookingTransactionRepository: Repository<BookingTransaction>
    let bookingTransaction: BookingTransaction
    let artistProfileRepository: Repository<ArtistProfile>

    beforeEach(async () => {

      controller = module.get<BookingTransactionController>(BookingTransactionController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      bookingTransactionRepository = module.get<Repository<BookingTransaction>>(BOOKING_TRANSACTION_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      })
      bookingTransaction = await bookingTransactionRepository.save({
        artist_id: existing_profile.id,
        title: faker.word.words(),
        description: faker.word.words(),
        city: faker.location.city(),
        venue: faker.location.streetAddress(),
        requester: faker.person.fullName(),
        date_and_time: faker.date.soon({ days: 100 })
      })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
      await bookingTransactionRepository.clear()
    })

    it('should delete existing booking transaction by id', async () => {
      let profile_id = existing_profile.id
      let result = await controller.deleteById(profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });
});
