import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { ArtistProfileService } from './artist_profile.service';
import { CreateArtistProfileInput, GetMultipleArtistProfileFiltersInput, UpdateArtistProfileInput } from './types';
import { CreateArtistProfileRequestBodyDTO, GetMultipleArtistProfilesRequestQueryDTO, UpdateArtistProfileRequestBodyDTO } from './dto/request.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateArtistProfileOKResponseBodyDTO, DeleteArtistProfileOKResponseBodyDTO, GetArtistProfileOKResponseBodyDTO, GetMultipleArtistProfilesOKResponseBodyDTO, UpdateArtistProfileOKResponseBodyDTO } from './dto/response.dto';
import { AuthGuard, AuthRequest } from '../../guards/auth.guard';

@Controller('api/v1/artist_profiles')
export class ArtistProfileController {
    constructor(private artistProfileService: ArtistProfileService) { }
    @Post("/")
    @ApiCreatedResponse({ type: CreateArtistProfileOKResponseBodyDTO })
    async createArtistProfile(@Body(new ValidationPipe({ transform: true })) body: CreateArtistProfileRequestBodyDTO) {
        let input: CreateArtistProfileInput = {
            ...body
        }
        let resData = await this.artistProfileService.createArtistProfile(input)
        let dto: CreateArtistProfileOKResponseBodyDTO = {
            statusCode: HttpStatus.CREATED,
            message: "Artist profile created succesfully",
            data: resData
        }
        return dto
    }

    @Get("/")
    @ApiCreatedResponse({ type: GetMultipleArtistProfilesOKResponseBodyDTO })
    async multipleArtistProfiles(@Query(new ValidationPipe({ transform: true })) query: GetMultipleArtistProfilesRequestQueryDTO) {
        let input: GetMultipleArtistProfileFiltersInput = { first_name: query.first_name, last_name: query.last_name, stage_name: query.stage_name }
        let resData = await this.artistProfileService.getMultipleArtistProfile(input)
        let dto: GetMultipleArtistProfilesOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Artist profiles fetched succesfully",
            data: resData
        }
        return dto
    }

    @Get("/:id")
    @ApiCreatedResponse({ type: GetArtistProfileOKResponseBodyDTO })
    async getArtistProfileById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
        let resData = await this.artistProfileService.getArtistProfileById(id)
        let dto: GetArtistProfileOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Artist profile fetched succesfully",
            data: resData
        }
        return dto
    }

    @Put("/:id")
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: UpdateArtistProfileOKResponseBodyDTO })
    async editArtistProfileById(@Req() authReq: AuthRequest, 
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body(new ValidationPipe({ transform: true })) body: UpdateArtistProfileRequestBodyDTO) {
        if (authReq.user.id !== id) {
            throw new UnauthorizedException("cannot delete for another artiste.")
        }
        let input: UpdateArtistProfileInput = {
            first_name: body.first_name,
            last_name: body.last_name,
            stage_name: body.stage_name
        }
        let resData = await this.artistProfileService.editArtistProfile(id, input)
        let dto: UpdateArtistProfileOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Artist profile updated succesfully",
            data: resData
        }
        return dto
    }


    @Delete("/:id")
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: DeleteArtistProfileOKResponseBodyDTO })
    async deleteById(@Req() authReq: AuthRequest, @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
        if (authReq.user.id !== id) {
            throw new UnauthorizedException("cannot delete for another artiste.")
        }
        let resData = await this.artistProfileService.deleteById(id)
        let dto: DeleteArtistProfileOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Artist profile deleted succesfully",
        }
        return dto
    }
}
