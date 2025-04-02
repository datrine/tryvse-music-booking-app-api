import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {BOOKING_TRANSACTION_REPOSITORY, DATA_SOURCE, } from './constant';
import { BookingTransaction } from '../entities/booking_transaction.entity';

export const BookingTransactionEntityProvider: Provider = {
    provide: BOOKING_TRANSACTION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(BookingTransaction),
    inject: [DATA_SOURCE],
}
