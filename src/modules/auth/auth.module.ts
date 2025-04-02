import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EntityProviderModule } from '../../entity_provider/entity_provider.module';

@Module({
  imports:[EntityProviderModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
