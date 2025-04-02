import { Module, Provider } from '@nestjs/common';
import { ArtistProfile } from '../entities/artist_profile.entity';
import { DataSource } from 'typeorm';
import { ARTIST_PROFILE_REPOSITORY, DATA_SOURCE } from './constant';
import { DatabaseModule } from '../database/database.module';

export const ArtistProfileEntityProvider: Provider = {
    provide: ARTIST_PROFILE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ArtistProfile),
    inject: [DATA_SOURCE],
}
