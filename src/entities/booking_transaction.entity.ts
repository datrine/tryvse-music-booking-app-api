
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum BookingTransactionStatus { PENDING = "PENDING", CONFIRMED = "CONFIRMED", CANCELLED = "CANCELLED" }

@Entity()
export class BookingTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  artist_id: number;

  @Column({ length: 500 })
  requester: string;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 500 })
  venue: string;

  @Column({ length: 500 })
  city: string;

  @Column("timestamp")
  date_and_time: Date;

  @Column("enum",{enum:BookingTransactionStatus})
  status: BookingTransactionStatus
}
