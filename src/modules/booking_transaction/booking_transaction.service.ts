import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EventListingEntry } from '../../entities/event_listing_entry.entity';
import { ARTIST_PROFILE_REPOSITORY, BOOKING_TRANSACTION_REPOSITORY, DATA_SOURCE, EVENT_LISTING_ENTRY_REPOSITORY } from '../../entity_provider/constant';
import { Between, DataSource, Repository } from 'typeorm';
import { BookingTxnStatusConfirmedPayload, BookingTxnUpdatedPayload, CreateBookingTransactionInput, GetMultipleBookingTransactionFiltersInput, NewBookingTxnCreatedPayload, UpdateBookingTransactionInput } from './types';
import { BookingTransaction, BookingTransactionStatus } from '../../entities/booking_transaction.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BookingTransactionConfirmedEvent, BookingTransactionUpdatedEvent, NewBookingTransactionCreatedEvent } from './events';
import { EventListingService } from '../event_listing/event_listing.service';
import { CreateEventListingEntryInput, UpdateEventListingEntryInput } from '../event_listing/types';

@Injectable()
export class BookingTransactionService {
    constructor(
        @Inject(DATA_SOURCE) private database: DataSource,
        @Inject(ARTIST_PROFILE_REPOSITORY) private artistProfileRepository: Repository<EventListingEntry>,
        @Inject(BOOKING_TRANSACTION_REPOSITORY) private bookingTxnRepository: Repository<BookingTransaction>,
        private eventEmitter: EventEmitter2,
        private eventListingService: EventListingService
    ) { }
    async createBookingTxn(input: CreateBookingTransactionInput): Promise<BookingTransaction> {
        let result = await this.database.transaction(async txn => {
            let artistRecord = await this.artistProfileRepository.findOne({
                where: { id: input.artist_id }
            })
            if (!artistRecord) {
                throw new BadRequestException(`artist ${input.artist_id} does not exist already existing for this day`)

            }
            let date_min = new Date(input.date_and_time.getTime())
            date_min.setHours(0, 0, 0, 0)
            let date_max = new Date(input.date_and_time.getTime())
            date_max.setHours(23, 59)
            let bookingTxn = await this.bookingTxnRepository.findOne({
                where: { id: input.artist_id, date_and_time: Between(date_min, date_max) }
            })
            if (bookingTxn) {
                throw new BadRequestException("booking already existing for this day")
            }
            let savedBooking = await this.bookingTxnRepository.save({
                ...input,
                status: BookingTransactionStatus.PENDING
            })
            return savedBooking
        })
        let event_dto: NewBookingTxnCreatedPayload = {
            id: result.id,
            artist_id: input.artist_id,
            title: result.title,
            city: result.city,
            venue: result.venue,
            description: result.description,
            date_and_time: result.date_and_time,
            requester: result.requester,
            status: BookingTransactionStatus.PENDING
        }
        this.eventEmitter.emit(NewBookingTransactionCreatedEvent, event_dto)
        return result
    }

    async getMultipleBookingTxn(input?: GetMultipleBookingTransactionFiltersInput): Promise<Array<BookingTransaction>> {
        let createdRecord = await this.bookingTxnRepository.find({
            where: input
        })
        return createdRecord
    }

    async getBookingTxnById(id: number): Promise<BookingTransaction> {
        let record = await this.bookingTxnRepository.findOne({
            where:
                { id: id }
        })
        if (!record) {
            throw new NotFoundException(`booking transaction with id ${id} not found`)
        }
        return record
    }

    async editBookingTxn(id: number, input: UpdateBookingTransactionInput): Promise<BookingTransaction> {
        let has_changed = false
        let event_dto: BookingTxnUpdatedPayload = {} as any
        let updatedRecord = await this.bookingTxnRepository.findOne({ where: { id: id } }
        )
        if (!updatedRecord) {
            throw new BadRequestException("record not found")
        }
        if (input.title) {
            updatedRecord.title = input.title
            has_changed = true
        }
        if (input.description) {
            updatedRecord.description = input.description
            has_changed = true
        }
        if (input.city) {
            updatedRecord.city = input.city
            has_changed = true
        }
        if (input.venue) {
            updatedRecord.venue = input.venue
            has_changed = true
        }

        updatedRecord = await this.bookingTxnRepository.save(updatedRecord)
        //event changes
        if (has_changed) {
            event_dto = {
                id: updatedRecord.id,
                artist_id: updatedRecord.artist_id,
                date_and_time: updatedRecord.date_and_time,
                description: updatedRecord.description,
                title: updatedRecord.title,
                status: updatedRecord.status,
                city: updatedRecord.city,
                venue: updatedRecord.venue,
                requester: updatedRecord.venue
            }
            this.eventEmitter.emit(BookingTransactionUpdatedEvent, event_dto)
        }
        return updatedRecord
    }

    async confirmBookingTxn(artist_id:number, id: number): Promise<BookingTransaction> {
        let event_dto: BookingTxnUpdatedPayload = {} as any
        let updatedRecord = await this.bookingTxnRepository.findOne({ where: { id: id } }
        )
        if (!updatedRecord) {
            throw new BadRequestException("record not found")
        }

        if (updatedRecord.artist_id!==artist_id) {
            throw new UnauthorizedException(`not authorized for this artist ${artist_id} not found`)
        }

        if (updatedRecord.status === BookingTransactionStatus.CANCELLED) {
            throw new BadRequestException("booking already cancelled. cannot confirm")
        }
        if (updatedRecord.status === BookingTransactionStatus.CONFIRMED) {
            throw new BadRequestException("booking already confirmed. cannot confirm again")
        }
        updatedRecord.status = BookingTransactionStatus.CONFIRMED
        updatedRecord = await this.bookingTxnRepository.save(updatedRecord)
        //event changes
        event_dto = {
            id: updatedRecord.id,
            artist_id: updatedRecord.artist_id,
            date_and_time: updatedRecord.date_and_time,
            description: updatedRecord.description,
            title: updatedRecord.title,
            status: updatedRecord.status,
            city: updatedRecord.city,
            venue: updatedRecord.venue,
            requester: updatedRecord.venue
        }
        this.eventEmitter.emit(BookingTransactionConfirmedEvent, event_dto)
        return updatedRecord
    }

    async cancelBookingTxn(artist_id:number,id: number): Promise<BookingTransaction> {
        let event_dto: BookingTxnUpdatedPayload = {} as any
        let updatedRecord = await this.bookingTxnRepository.findOne({ where: { id: id } }
        )
        if (!updatedRecord) {
            throw new BadRequestException("record not found")
        }
        
        if (updatedRecord.artist_id!==artist_id) {
            throw new UnauthorizedException(`not authorized for this artist ${artist_id} not found`)
        }

        if (updatedRecord.status === BookingTransactionStatus.CANCELLED) {
            throw new BadRequestException("booking already cancelled. cannot cancel again")
        }
        if (updatedRecord.status === BookingTransactionStatus.CONFIRMED) {
            throw new BadRequestException("booking already confirmed. cannot cancel")
        }
        updatedRecord.status = BookingTransactionStatus.CANCELLED
        updatedRecord = await this.bookingTxnRepository.save(updatedRecord)
        //event changes
        event_dto = {
            id: updatedRecord.id,
            artist_id: updatedRecord.artist_id,
            date_and_time: updatedRecord.date_and_time,
            description: updatedRecord.description,
            title: updatedRecord.title,
            status: updatedRecord.status,
            city: updatedRecord.city,
            venue: updatedRecord.venue,
            requester: updatedRecord.venue
        }
        this.eventEmitter.emit(BookingTransactionConfirmedEvent, event_dto)
        return updatedRecord
    }

    async deleteBookingTxn(id: number) {
        let deletedRecord = await this.bookingTxnRepository.delete(id)
        if (!deletedRecord.affected) {
            throw new NotFoundException(`booking transaction with id ${id} not deleted`)
        }
        return deletedRecord
    }

    @OnEvent(BookingTransactionConfirmedEvent, { async: true })
    async handleBookingTransactionConfirmedEvent(payload: BookingTxnStatusConfirmedPayload) {
        // create event listing if booking 
        let input: CreateEventListingEntryInput = {
            artist_id: payload.artist_id,
            title: payload.title,
            description: payload.description,
            date_and_time: payload.date_and_time,
            venue: payload.venue,
            city: payload.city
        }
        await this.eventListingService.createEventEntry(input)

    }
}
