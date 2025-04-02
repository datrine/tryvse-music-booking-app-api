import { Module } from '@nestjs/common';
import { EventListingController } from './event_listing.controller';
import { EventListingService } from './event_listing.service';
import { EntityProviderModule } from '../../entity_provider/entity_provider.module';

@Module({
  controllers: [EventListingController],
  providers: [EventListingService],
  imports: [EntityProviderModule,],exports:[EventListingService]
})
export class EventListingModule { }
