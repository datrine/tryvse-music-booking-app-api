import { Module } from '@nestjs/common';
import { BookingTransactionController } from './booking_transaction.controller';
import { BookingTransactionService } from './booking_transaction.service';
import { EntityProviderModule } from '../../entity_provider/entity_provider.module';
import { EventListingModule } from '../event_listing/event_listing.module';

@Module({
  controllers: [BookingTransactionController],
  providers: [BookingTransactionService],
  imports: [EntityProviderModule,EventListingModule],
})
export class BookingTransactionModule { }
