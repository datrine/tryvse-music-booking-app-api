import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateEventListingEntryOKResponseBodyDTO, DeleteEventLostingEntryOKResponseBodyDTO, GetEventListingEntryOKResponseBodyDTO, GetMultipleBookingTransactionsOKResponseBodyDTO, UpdateEventListingEntryOKResponseBodyDTO } from './dto/response.dto';
import { CreateEventListingEntryRequestBodyDTO, GetMultipleEventListingEntriesRequestQueryDTO, UpdateEventListingEntryRequestBodyDTO } from './dto/request.dto';
import { EventListingService } from './event_listing.service';
import { CreateEventListingEntryInput, GetMultipleEventListingEntryFiltersInput, UpdateEventListingEntryInput } from './types';

@Controller('api/v1/event_listing')
export class EventListingController {
        constructor(private eventListingService: EventListingService) { }
        @Post("/")
        @ApiCreatedResponse({ type: CreateEventListingEntryOKResponseBodyDTO })
        async create(@Body(new ValidationPipe({ transform: true })) body: CreateEventListingEntryRequestBodyDTO) {
            let input: CreateEventListingEntryInput = {
                ...body, date_and_time: new Date(body.date_and_time)
            }
            let resData = await this.eventListingService.createEventEntry(input)
            let dto: CreateEventListingEntryOKResponseBodyDTO = {
                statusCode: HttpStatus.CREATED,
                message: "Event listing entry created succesfully",
                data: resData
            }
            return dto
        }
    
        @Get("/")
        @ApiCreatedResponse({ type: GetMultipleBookingTransactionsOKResponseBodyDTO })
        async getMultiple(@Query(new ValidationPipe({ transform: true })) query: GetMultipleEventListingEntriesRequestQueryDTO) {
            let input: GetMultipleEventListingEntryFiltersInput = { ...query }
            let resData = await this.eventListingService.getMultipleEventEntry(input)
            let dto: GetMultipleBookingTransactionsOKResponseBodyDTO = {
                statusCode: HttpStatus.OK,
                message: "Event listing entries fetched succesfully",
                data: resData
            }
            return dto
        }
    
        @Get("/:id")
        @ApiCreatedResponse({ type: GetEventListingEntryOKResponseBodyDTO })
        async getById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
            let resData = await this.eventListingService.getEventEntryById(id)
            let dto: GetEventListingEntryOKResponseBodyDTO = {
                statusCode: HttpStatus.OK,
                message: "Event listing profile fetched succesfully",
                data: resData
            }
            return dto
        }
    
        @Put("/:id")
        @ApiCreatedResponse({ type: UpdateEventListingEntryOKResponseBodyDTO })
        async editById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
            @Body(new ValidationPipe({ transform: true })) body: UpdateEventListingEntryRequestBodyDTO) {
            let input: UpdateEventListingEntryInput = {
                ...body,
            }
            if (body.date_and_time) {
                input.date_and_time = new Date(body.date_and_time)
            }
            let resData = await this.eventListingService.editEventEntry(id, input)
            let dto: UpdateEventListingEntryOKResponseBodyDTO = {
                statusCode: HttpStatus.OK,
                message: "Event listing updated succesfully",
                data: resData
            }
            return dto
        }
        @Delete("/:id")
        @ApiCreatedResponse({ type: DeleteEventLostingEntryOKResponseBodyDTO })
        async deleteById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
            let resData = await this.eventListingService.deleteEventEntry(id)
            let dto: DeleteEventLostingEntryOKResponseBodyDTO = {
                statusCode: HttpStatus.OK,
                message: "Event listing deleted succesfully",
            }
            return dto
        }
}
