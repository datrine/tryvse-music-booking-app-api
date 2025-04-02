import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EventListingEntryDTO {
    @ApiProperty({ type: "integer" })
    id: number

    @ApiProperty({ type: "integer" })
    artist_id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    city: string

    @ApiProperty()
    venue: string

    @ApiPropertyOptional({ type: "string", format: "date-time" })
    date_and_time: Date;
}
export class CreateEventListingEntryOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: EventListingEntryDTO })
    data: EventListingEntryDTO
}

export class GetEventListingEntryOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: EventListingEntryDTO })
    data: EventListingEntryDTO
}

export class UpdateEventListingEntryOKResponseBodyDTO {
    @ApiProperty({ type: "string" })
    statusCode: number;

    @ApiProperty({ type: "string" })
    message: string;

    @ApiProperty({ type: EventListingEntryDTO })
    data: EventListingEntryDTO
}


export class DeleteEventLostingEntryOKResponseBodyDTO {
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

    @ApiProperty({ type: [EventListingEntryDTO] })
    data: Array<EventListingEntryDTO>
}