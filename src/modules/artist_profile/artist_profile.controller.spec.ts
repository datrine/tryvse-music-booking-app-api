import { Test, TestingModule } from '@nestjs/testing';
import { ArtistProfileController } from './artist_profile.controller';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { ArtistProfileService } from './artist_profile.service';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { CreateArtistProfileRequestBodyDTO, GetMultipleArtistProfilesRequestQueryDTO, UpdateArtistProfileRequestBodyDTO } from './dto/request.dto';
import { faker } from '@faker-js/faker/.';
import { HttpStatus } from '@nestjs/common';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { Repository } from 'typeorm';
import { ARTIST_PROFILE_REPOSITORY } from '../../entity_provider/constant';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

describe('ArtistController', () => {
  let controller: ArtistProfileController;
  let container: StartedMySqlContainer
  let module: TestingModule
  beforeEach(async () => {
    container = await getDbContainer()
    module = await Test.createTestingModule({
      imports:[
              JwtModule.registerAsync({
                global: true,
                useFactory: async () => {
                  let res: JwtModuleOptions = {
                    secret: "secret_key",
                  }
                  return res
                },
              }),],
      controllers: [ArtistProfileController],
       providers: [ArtistProfileService, GetDatabaseSourceProvider(container), ArtistProfileEntityProvider,]

    }).compile();
  }, 500000);

  afterEach(async () => {
    await teardownMySqlContainer(container)
  })

  describe("createArtistProfile", () => {
    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      controller = module.get<ArtistProfileController>(ArtistProfileController);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it('should create artist profile', async () => {
      let dto: CreateArtistProfileRequestBodyDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      let result = await controller.createArtistProfile(dto)
      expect(result.statusCode).toEqual(HttpStatus.CREATED)
      expect(result.data.first_name).toEqual(dto.first_name)
      expect(result.data.last_name).toEqual(dto.last_name)
      expect(result.data.stage_name).toEqual(dto.stage_name)
    });
  });

  describe("multipleArtistProfiles", () => {
    let profiles: ArtistProfile[]

    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      controller = module.get<ArtistProfileController>(ArtistProfileController);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      profiles = await artistProfileRepository.save([{
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }, {
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }, {
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it('should get multiple artist profiles with same first name', async () => {
      let dto: GetMultipleArtistProfilesRequestQueryDTO = {
        first_name: profiles[0].first_name,
      }
      let result = await controller.multipleArtistProfiles(dto)
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.data.length > 0).toBeTruthy()
    });
  });

  describe("getArtistProfileById", () => {
    let existing_profile: ArtistProfile

    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {

      controller = module.get<ArtistProfileController>(ArtistProfileController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      },
      )
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it('should fetch existing artist profile by id', async () => {
      let profile_id = existing_profile.id
      let result = await controller.getArtistProfileById(profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });

  describe("editArtistProfileById", () => {
    let existing_profile: ArtistProfile

    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      controller = module.get<ArtistProfileController>(ArtistProfileController);

      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      },
      )
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it('should edit existing artist profile by id', async () => {
      let dto: UpdateArtistProfileRequestBodyDTO = {
        first_name: faker.person.firstName()
      }
      let profile_id = existing_profile.id
      let req = { user: { id: profile_id } }
      let result = await controller.editArtistProfileById(req as any, profile_id, dto)
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.data.first_name).toEqual(dto.first_name)
    });
  });

  describe("deleteArtistProfileById", () => {
    let existing_profile: ArtistProfile

    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      controller = module.get<ArtistProfileController>(ArtistProfileController);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      existing_profile = await artistProfileRepository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      },
      )
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it('should delete existing artist profile by id', async () => {
      let profile_id = existing_profile.id
      let req = { user: { id: profile_id } }
      let result = await controller.deleteById(req as any, profile_id)
      expect(result.statusCode).toEqual(HttpStatus.OK)
    });
  });
});
