import { Module } from '@nestjs/common';
import { ArtistProfileController } from './artist_profile.controller';
import { ArtistProfileService } from './artist_profile.service';
import { EntityProviderModule } from '../../entity_provider/entity_provider.module';

@Module({
  imports:[EntityProviderModule],
  controllers: [ArtistProfileController],
  providers: [ArtistProfileService]
})
export class ArtistProfileModule {}
