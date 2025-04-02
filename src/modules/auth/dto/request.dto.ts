import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator"

export class UserSigninRequestBodyDTO{
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsStrongPassword({minLength:4,})
    password:string

}
