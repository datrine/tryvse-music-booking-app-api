import { ApiProperty } from "@nestjs/swagger";

export class SignedInUserDTO {
    @ApiProperty()
    access_token: string

    @ApiProperty({ type: "integer" })
    user_id: number

    @ApiProperty()
    email: string

    @ApiProperty({ type: "string" })
    first_name: string

    @ApiProperty({ type: "string" })
    last_name?: string

    @ApiProperty({ type: "string" })
    stage_name?: string
}

export class UserSigninOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: SignedInUserDTO })
    data: SignedInUserDTO
}