import { Test, TestingModule } from '@nestjs/testing';
import { ArtistProfileService } from './artist_profile.service';
import { teardownMySqlContainer, GetDatabaseSourceProvider, getDbContainer } from '../../utils/test_utils/db_conn';
import { EntityProviderModule } from '../../entity_provider/entity_provider.module';
import { DatabaseModule } from '../../database/database.module';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { ARTIST_PROFILE_REPOSITORY, DATA_SOURCE } from '../../entity_provider/constant';
import { DataSource, Repository } from 'typeorm';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { CreateArtistProfileInput, GetMultipleArtistProfileFiltersInput, UpdateArtistProfileInput } from './types';
import { faker } from "@faker-js/faker"
import { StartedMySqlContainer } from '@testcontainers/mysql';

describe('ArtistProfileService', () => {
  let service: ArtistProfileService;
  let container: StartedMySqlContainer
  let module: TestingModule
  beforeEach(async () => {
    container = await getDbContainer()
     module = await Test.createTestingModule({
      providers: [ArtistProfileService, GetDatabaseSourceProvider(container), ArtistProfileEntityProvider,],
    }).compile();

    service = module.get<ArtistProfileService>(ArtistProfileService);
  }, 500000);

  afterEach(async () => {
    await teardownMySqlContainer(container)
  })

  describe("createArtistProfile", () => {
    let artistProfileRepository: Repository<ArtistProfile>

    beforeEach(async () => {
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);

    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it("it should create artist profile", async () => {
      let oo: CreateArtistProfileInput = {
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      let result = await service.createArtistProfile(oo)
      expect(oo.first_name).toEqual(result.first_name)
      expect(oo.last_name).toEqual(result.last_name)
      expect(oo.stage_name).toEqual(result.stage_name)
      //expect(result.id).toBeGreaterThan(0)
    })
  });

  describe("getMultipleArtistProfile", () => {
    let profiles: ArtistProfile[]

    let artistProfileRepository: Repository<ArtistProfile>
    beforeEach(async () => {
      service = module.get<ArtistProfileService>(ArtistProfileService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);
      profiles = await artistProfileRepository.save([{
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }, {
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }, {
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it("it should get multiple artist profiles with same first_name", async () => {
      let oo: GetMultipleArtistProfileFiltersInput = {
        first_name: profiles[0].first_name,
      }
      let result = await service.getMultipleArtistProfile(oo)
      for (const item of result) {
        expect(item.first_name).toBe(oo.first_name)
      }
    })

  });

  describe("getArtistProfileById", () => {
    let profiles: ArtistProfile[]
    let artistProfileRepository: Repository<ArtistProfile>

    beforeEach(async () => {
      service = module.get<ArtistProfileService>(ArtistProfileService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);

      profiles = await artistProfileRepository.save([{
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      ])
    }, 500000);


    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it("it should get existing artist profile by id", async () => {
      let expected_profile = profiles[0]
      let profile_id = expected_profile.id
      console.log({ expected_profile })
      let result = await service.getArtistProfileById(profile_id)
      expect(result).not.toBeFalsy()
      expect(result.email).toEqual(expected_profile.email)
      expect(result!.first_name).toEqual(expected_profile.first_name)
      expect(result!.last_name).toEqual(expected_profile.last_name)
      expect(result!.stage_name).toEqual(expected_profile.stage_name)
      expect(result!.id).toEqual(expected_profile.id)
    })

    it("it should throw if not existing artist profile by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.getArtistProfileById(profile_id)).rejects.toThrow()
    })

  });

  describe("editArtistProfile", () => {
    let profiles: ArtistProfile[]
    let artistProfileRepository: Repository<ArtistProfile>

    beforeEach(async () => {
      service = module.get<ArtistProfileService>(ArtistProfileService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);

      profiles = await artistProfileRepository.save([{
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      ])
      console.log({ profiles })
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it("it should update existing artist profile first_name by id", async () => {
      let expected_profile = profiles[0]
      let profile_id = expected_profile.id
      let updates: UpdateArtistProfileInput = {
        first_name: faker.person.firstName()
      }
      let result = await service.editArtistProfile(profile_id, updates)
      expect(result).not.toBeFalsy()
      expect(result.first_name).toEqual(updates.first_name)
    })

    it("it should throw if not existing artist profile by id", async () => {
      let updates: UpdateArtistProfileInput = {
        first_name: faker.person.firstName()
      }
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.editArtistProfile(profile_id, updates)).rejects.toThrow()
    })

  });

  describe("deleteArtistProfile", () => {
    let profiles: ArtistProfile[]
    let artistProfileRepository: Repository<ArtistProfile>

    beforeEach(async () => {
      service = module.get<ArtistProfileService>(ArtistProfileService);
      artistProfileRepository = module.get<Repository<ArtistProfile>>(ARTIST_PROFILE_REPOSITORY);

      profiles = await artistProfileRepository.save([{
        email:faker.internet.email(),
        password:faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        stage_name: faker.internet.displayName()
      }
      ])
    }, 500000);

    afterEach(async () => {
      await artistProfileRepository.clear()
    })

    it("it should delete existing artist profile by id", async () => {
      let expected_profile = profiles[0]
      let profile_id = expected_profile.id
      let result = await service.deleteById(profile_id)
      expect(result).not.toBeFalsy()
      expect(result!.affected).toEqual(1)
    })

    it("it should throw if not existing artist profile by id", async () => {
      let profile_id = Number.MAX_SAFE_INTEGER
      expect(service.deleteById(profile_id)).rejects.toThrow()
    })

  });
});
