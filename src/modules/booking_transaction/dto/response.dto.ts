import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { BookingTransactionStatus } from "../../../entities/booking_transaction.entity";

export class BookingTransactionDTO {
    @ApiProperty({ type: "integer" })
    id: number

    @ApiProperty({ type: "integer" })
    artist_id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    requester: string;

    @ApiProperty()
    city: string

    @ApiProperty()
    venue: string

    @ApiProperty({ type: "string", format: "date-time" })
    date_and_time: Date;

    @ApiProperty({ enum: BookingTransactionStatus })
    @IsEnum(BookingTransactionStatus)
    status: BookingTransactionStatus
}
export class CreateBookingTransactionOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: BookingTransactionDTO })
    data: BookingTransactionDTO
}

export class GetBookingTransactionOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: BookingTransactionDTO })
    data: BookingTransactionDTO
}

export class UpdateBookingTransactionOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: BookingTransactionDTO })
    data: BookingTransactionDTO
}


export class DeleteBookingTransactionOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;
}

export class GetMultipleBookingTransactionsOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: [BookingTransactionDTO] })
    data: Array<BookingTransactionDTO>
}