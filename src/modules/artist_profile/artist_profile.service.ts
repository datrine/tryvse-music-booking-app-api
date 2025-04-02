import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { Repository } from 'typeorm';
import { CreateArtistProfileInput, GetMultipleArtistProfileFiltersInput, UpdateArtistProfileInput } from './types';
import { ARTIST_PROFILE_REPOSITORY } from '../../entity_provider/constant';
import { createPasswordHash } from '../../utils/fn';

@Injectable()
export class ArtistProfileService {
    constructor(@Inject(ARTIST_PROFILE_REPOSITORY) private artistProfileRepository: Repository<ArtistProfile>,) { }
    async createArtistProfile(input: CreateArtistProfileInput): Promise<Omit<ArtistProfile, "password_hash">> {
        let { password, ...rest } = input
        let password_hash = await createPasswordHash(password)
        let createdRecord = await this.artistProfileRepository.save({
            ...rest, password_hash
        })
        // await this.artistProfileRepository.save(createdRecord)
        let { password_hash: un_needed, ...sanitized } = createdRecord
        return sanitized
    }

    async getMultipleArtistProfile(input?: GetMultipleArtistProfileFiltersInput): Promise<Array<Omit<ArtistProfile, "password_hash">>> {
        let records = await this.artistProfileRepository.find({
            where: input
        })
        let sanitized_recs: Array<Omit<ArtistProfile, "password_hash">> = []
        for (const element of records) {
            let { password_hash: un_needed, ...sanitized } = element
            sanitized_recs.push(sanitized)
        }
        return sanitized_recs
    }

    async getArtistProfileById(profile_id: number): Promise<Omit<ArtistProfile, "password_hash">> {
        let record = await this.artistProfileRepository.findOne({
            where:
                { id: profile_id }
        })
        if (!record) {
            throw new NotFoundException(`artist profile with id ${profile_id} not found`)
        }
        let { password_hash: un_needed, ...sanitized } = record
        return sanitized
    }

    async editArtistProfile(profile_id: number, input: UpdateArtistProfileInput): Promise<Omit<ArtistProfile, "password_hash">> {
        let updatedRecord = await this.artistProfileRepository.findOne({ where: { id: profile_id } }
        )
        if (!updatedRecord) {
            throw new BadRequestException("no artist profile record found")
        }

        if (input.email) {
            updatedRecord.email = input.email
        }

        if (input.password) {
            let password_hash = await createPasswordHash(input.password)
            updatedRecord.password_hash = password_hash
        }

        if (input.first_name) {
            updatedRecord.first_name = input.first_name
        }
        if (input.last_name) {
            updatedRecord.last_name = input.last_name
        }
        if (input.stage_name) {
            updatedRecord.stage_name = input.stage_name
        }
        let { password_hash: un_needed, ...sanitized } = updatedRecord
        return sanitized
    }

    async deleteById(profile_id: number) {
        let deletedRecord = await this.artistProfileRepository.delete(profile_id)
        if (!deletedRecord.affected) {
            throw new NotFoundException(`artist profile with id ${profile_id} not deleted`)
        }
        return deletedRecord
    }
}

