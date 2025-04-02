import { ApiProperty } from "@nestjs/swagger";

export class ArtistProfileDTO {
    @ApiProperty({ type: "integer" })
    id: number

    @ApiProperty()
    email: string

    @ApiProperty({ type: "string" })
    first_name: string

    @ApiProperty({ type: "string" })
    last_name?: string

    @ApiProperty({ type: "string" })
    stage_name?: string
}
export class CreateArtistProfileOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: ArtistProfileDTO })
    data: ArtistProfileDTO
}

export class GetArtistProfileOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: ArtistProfileDTO })
    data: ArtistProfileDTO
}

export class UpdateArtistProfileOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: ArtistProfileDTO })
    data: ArtistProfileDTO
}


export class DeleteArtistProfileOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;
}

export class GetMultipleArtistProfilesOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: [ArtistProfileDTO] })
    data: Array<ArtistProfileDTO>
}