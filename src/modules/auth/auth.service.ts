import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ARTIST_PROFILE_REPOSITORY } from '../../entity_provider/constant';
import { Repository } from 'typeorm';
import { ArtistProfile } from '../../entities/artist_profile.entity';
import { comparePasswordWithHash } from '../../utils/fn';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './types';

@Injectable()
export class AuthService {
    constructor(
        @Inject(ARTIST_PROFILE_REPOSITORY) private artistProfileRepository: Repository<ArtistProfile>,
        private jwtService: JwtService
    ) { }

    async signin({ email, password }: { email: string; password: string }) {
        let record = await this.artistProfileRepository.findOneBy({ email })
        if (!record) {
            throw new UnauthorizedException("email/password mismatch")
        }
        let matched = await comparePasswordWithHash(password, record.password_hash)
        if (!matched) {
            throw new UnauthorizedException("email/password mismatch")
        }
        let payload: JWTPayload = {
            id: record.id,
            email: record.email
        }
        let token = this.jwtService.sign(payload)
        let { password_hash, ...rest } = record
        return { access_token: token, ...rest }
    }
}
