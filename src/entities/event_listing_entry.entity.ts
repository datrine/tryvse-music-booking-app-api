
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventListingEntry {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({nullable:false})
  artist_id: number;

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
}
