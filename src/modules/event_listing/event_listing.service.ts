import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EVENT_LISTING_ENTRY_REPOSITORY } from '../../entity_provider/constant';
import { CreateEventListingEntryInput, GetMultipleEventListingEntryFiltersInput, UpdateEventListingEntryInput } from './types';
import { EventListingEntry } from '../../entities/event_listing_entry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventListingService {
        constructor(@Inject(EVENT_LISTING_ENTRY_REPOSITORY) private eventListingEntryRepository: Repository<EventListingEntry>,) { }
    async createEventEntry(input: CreateEventListingEntryInput): Promise<EventListingEntry> {
        let createdRecord = await this.eventListingEntryRepository.save({
            ...input
        })
        // await this.artistProfileRepository.save(createdRecord)
        return createdRecord
    }

    async getMultipleEventEntry(input?: GetMultipleEventListingEntryFiltersInput): Promise<Array<EventListingEntry>> {
        let createdRecord = await this.eventListingEntryRepository.find({
            where: input
        })
        return createdRecord
    }

    async getEventEntryById(profile_id: number): Promise<EventListingEntry> {
        let record = await this.eventListingEntryRepository.findOne({
            where:
                { id: profile_id }
        })
        if (!record) {
            throw new NotFoundException(`event listing entry with id ${profile_id} not found`)
        }
        return record
    }

    async editEventEntry(profile_id: number, input: UpdateEventListingEntryInput): Promise<EventListingEntry> {
        let updatedRecord = await this.eventListingEntryRepository.findOne({ where: { id: profile_id } }
        )
        if (!updatedRecord) {
            throw new BadRequestException("record not found")
        }
        if (input.title) {
            updatedRecord.title = input.title
        }
        if (input.description) {
            updatedRecord.description = input.description
        }
        if (input.date_and_time) {
            updatedRecord.date_and_time = input.date_and_time
        }
        if (input.venue) {
            updatedRecord.venue = input.venue
        }
        if (input.city) {
            updatedRecord.city = input.city
        }
        await this.eventListingEntryRepository.save(updatedRecord)
        return updatedRecord
    }

    async deleteEventEntry(profile_id: number) {
        let deletedRecord = await this.eventListingEntryRepository.delete(profile_id)
        if (!deletedRecord.affected) {
            throw new NotFoundException(`event listing entry with id ${profile_id} not deleted`)
        }
        return deletedRecord
    }
}
