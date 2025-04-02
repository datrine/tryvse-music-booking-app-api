import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {DATA_SOURCE, EVENT_LISTING_ENTRY_REPOSITORY } from './constant';
import { EventListingEntry } from '../entities/event_listing_entry.entity';

export const EventListingEntryEntityProvider: Provider = {
    provide: EVENT_LISTING_ENTRY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EventListingEntry),
    inject: [DATA_SOURCE],
}
