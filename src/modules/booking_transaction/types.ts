import { BookingTransactionStatus } from "../../entities/booking_transaction.entity";

export interface CreateBookingTransactionInput {
  artist_id: number;
  title: string;
  description: string;
  requester: string
  city: string
  venue: string
  date_and_time: Date;
}


export interface GetMultipleBookingTransactionFiltersInput {
  artist_id?: number;
  title?: string;
  description?: string;
  requester?: string
  city?: string
  venue?: string
  date_and_time?: Date;
  status?:BookingTransactionStatus
}

export interface UpdateBookingTransactionInput {
  title?: string;
  description?: string;
  requester?: string
  city?: string
  venue?: string
  date_and_time?: Date;
}

export interface NewBookingTxnCreatedPayload {
  id: number
  artist_id:number;
  title: string;
  description: string;
  requester: string
  city: string
  venue: string
  date_and_time: Date;
  status:BookingTransactionStatus
}


export interface BookingTxnUpdatedPayload {
  id: number
  artist_id:number;
  title: string;
  description: string;
  requester: string
  city: string
  venue: string
  date_and_time: Date;
  status:BookingTransactionStatus
}



export interface BookingTxnStatusConfirmedPayload {
  id: number
  artist_id:number;
  title: string;
  description: string;
  requester: string
  city: string
  venue: string
  date_and_time: Date;
  status:BookingTransactionStatus.CONFIRMED
}