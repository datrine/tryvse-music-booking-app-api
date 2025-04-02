import { Module } from '@nestjs/common';
import { ARTIST_PROFILE_REPOSITORY, BOOKING_TRANSACTION_REPOSITORY, DATA_SOURCE, EVENT_LISTING_ENTRY_REPOSITORY } from './constant';
import { DatabaseModule } from '../database/database.module';
import { ArtistProfileEntityProvider } from './artist_profile_entity.provider';
import { EventListingEntryEntityProvider } from './event_listing_entry_entity.provider';
import { BookingTransactionEntityProvider } from './booking_transaction_entity.provider';

@Module({
    imports: [DatabaseModule],
    providers: [ArtistProfileEntityProvider, EventListingEntryEntityProvider,BookingTransactionEntityProvider
    ], exports: [ARTIST_PROFILE_REPOSITORY, EVENT_LISTING_ENTRY_REPOSITORY,BOOKING_TRANSACTION_REPOSITORY,DatabaseModule]
})
export class EntityProviderModule { }
