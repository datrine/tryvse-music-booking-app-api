import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';

describe('AuthService', () => {
  let service: AuthService;
  let container: StartedMySqlContainer

  beforeAll(async () => {
    container = await getDbContainer()
  }, 500000)

  afterAll(async () => {
    await teardownMySqlContainer(container)
  },10000)
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          global: true,
          useFactory: async () => {
            let res: JwtModuleOptions = {
              secret: "secret_key",
            }
            return res
          },
        }),], providers: [AuthService, GetDatabaseSourceProvider(container), ArtistProfileEntityProvider]
    }).compile();

    service = module.get<AuthService>(AuthService);
  }, 500000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
