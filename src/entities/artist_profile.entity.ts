
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArtistProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length:100, unique:false})
  email: string;

  @Column('text',{nullable:true})
  password_hash: string;

  @Column({ length: 500 })
  stage_name: string;

  @Column('text')
  first_name: string;

  @Column()
  last_name: string;
}
