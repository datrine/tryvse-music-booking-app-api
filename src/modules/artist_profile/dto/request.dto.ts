import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator"

export class CreateArtistProfileRequestBodyDTO{
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsStrongPassword({minLength:4,})
    password:string

    @ApiProperty()
    @IsNotEmpty()
    first_name:string

    @ApiProperty()
    @IsNotEmpty()
    last_name:string

    @ApiProperty()
    @IsNotEmpty()
    stage_name:string
}

export class UpdateArtistProfileRequestBodyDTO{
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?:string

    @ApiProperty()
    @IsStrongPassword({minLength:4,})
    @IsOptional()
    password?:string

    @ApiPropertyOptional()
    @IsOptional()
    first_name?:string

    @ApiPropertyOptional()
    @IsOptional()
    last_name?:string

    @ApiPropertyOptional()
    @IsOptional()
    stage_name?:string
}


export class GetMultipleArtistProfilesRequestQueryDTO{
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?:string
    
    @ApiPropertyOptional()
    @IsOptional()
    first_name?:string

    @ApiPropertyOptional()
    @IsOptional()
    last_name?:string

    @ApiPropertyOptional()
    @IsOptional()
    stage_name?:string

    @ApiPropertyOptional()
    @IsOptional()
    limit?:number;

    @ApiPropertyOptional()
    @IsOptional()
    skip?:number
}