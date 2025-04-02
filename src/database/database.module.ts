import { Module } from '@nestjs/common';
import { ArtistProfile } from '../entities/artist_profile.entity';
import { EventListingEntry } from '../entities/event_listing_entry.entity';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../entity_provider/constant';
import { BookingTransaction } from '../entities/booking_transaction.entity';

@Module({
    providers: [{
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const port = parseInt(String(process.env.DB_PORT))
            const dataSource = new DataSource({
                type: process.env.DB_DIALECT as any,
                host: process.env.DB_HOST,
                port,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [ArtistProfile, EventListingEntry,BookingTransaction
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },],exports:[DATA_SOURCE]
})
export class DatabaseModule { }
