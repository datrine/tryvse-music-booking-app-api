import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ArtistProfileEntityProvider } from '../../entity_provider/artist_profile_entity.provider';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { GetDatabaseSourceProvider, getDbContainer, teardownMySqlContainer } from '../../utils/test_utils/db_conn';

describe('AuthController', () => {
  let controller: AuthController;
  let container: StartedMySqlContainer


  beforeAll(async () => {
    container = await getDbContainer()
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
        }),],
      controllers: [AuthController], providers: [AuthService, GetDatabaseSourceProvider(container), ArtistProfileEntityProvider]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  }, 500000);

  afterAll(async () => {
    await teardownMySqlContainer(container)
  },10000)
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
