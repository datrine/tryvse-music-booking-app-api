import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { BookingTransactionStatus } from "../../../entities/booking_transaction.entity";
import { Transform } from "class-transformer";

export class CreateBookingTransactionRequestBodyDTO {
    @ApiProperty({ type: "number" })
    @IsNumber()
    artist_id: number;

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    requester: string;

    @ApiProperty()
    @IsNotEmpty()
    city: string

    @ApiProperty()
    @IsNotEmpty()
    venue: string

    @ApiProperty({ type: "string", format: "date-time" })
    @IsISO8601()
    @IsNotEmpty()
    date_and_time: Date;
}

export class UpdateBookingTransactionRequestBodyDTO {

    @ApiPropertyOptional()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    requester?: string;

    @ApiPropertyOptional()
    @IsOptional()
    city?: string

    @ApiPropertyOptional()
    @IsOptional()
    venue?: string

    @ApiPropertyOptional({ type: "string", format: "date-time" })
    @IsISO8601()
    @IsOptional()
    date_and_time?: Date;
}


export class GetMultipleBookingTransactionsRequestQueryDTO {

    @ApiPropertyOptional()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    requester?: string;

    @ApiPropertyOptional()
    @IsOptional()
    city?: string

    @ApiPropertyOptional()
    @IsOptional()
    venue?: string

    @ApiPropertyOptional({ type: "string", format: "date-time" })
    @IsISO8601()
    @IsOptional()
    date_and_time?: Date;
    
    @ApiProperty({ enum: BookingTransactionStatus })
    @IsEnum(BookingTransactionStatus)
    @IsOptional()
    status?: BookingTransactionStatus
}