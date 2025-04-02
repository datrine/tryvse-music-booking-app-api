import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { BookingTransactionService } from './booking_transaction.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookingTransactionOKResponseBodyDTO, DeleteBookingTransactionOKResponseBodyDTO, GetBookingTransactionOKResponseBodyDTO, GetMultipleBookingTransactionsOKResponseBodyDTO, UpdateBookingTransactionOKResponseBodyDTO } from './dto/response.dto';
import { CreateBookingTransactionRequestBodyDTO, GetMultipleBookingTransactionsRequestQueryDTO, UpdateBookingTransactionRequestBodyDTO } from './dto/request.dto';
import { CreateBookingTransactionInput, GetMultipleBookingTransactionFiltersInput, UpdateBookingTransactionInput } from './types';
import { BookingTransactionStatus } from '../../entities/booking_transaction.entity';
import { AuthGuard, AuthRequest } from '../../guards/auth.guard';

@Controller('api/v1/booking_transactions')
@ApiTags("Booking Transactions APIs")
export class BookingTransactionController {
    constructor(private bookingTransactionService: BookingTransactionService) { }
    @Post("/")
    @ApiCreatedResponse({ type: CreateBookingTransactionOKResponseBodyDTO })
        @ApiOperation({description:"create booking",summary:"create booking"})
    async create(@Body(new ValidationPipe({ transform: true })) body: CreateBookingTransactionRequestBodyDTO) {
        let input: CreateBookingTransactionInput = {
            ...body, date_and_time: new Date(body.date_and_time)
        }
        let resData = await this.bookingTransactionService.createBookingTxn(input)
        let dto: CreateBookingTransactionOKResponseBodyDTO = {
            statusCode: HttpStatus.CREATED,
            message: "Booking transaction created succesfully",
            data: resData
        }
        return dto
    }

    @Get("/")
    @ApiOperation({description:"get multiple bookings",summary:"get multiple bookings"})
    @ApiCreatedResponse({ type: GetMultipleBookingTransactionsOKResponseBodyDTO })
    async getMultiple(@Query(new ValidationPipe({ transform: true })) query: GetMultipleBookingTransactionsRequestQueryDTO) {
        let input: GetMultipleBookingTransactionFiltersInput = { ...query }
        let resData = await this.bookingTransactionService.getMultipleBookingTxn(input)
        let dto: GetMultipleBookingTransactionsOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Booking transactions fetched succesfully",
            data: resData
        }
        return dto
    }

    @Get("/:id")
    @ApiOperation({description:"get booking by id",summary:"get booking by id"})
    @ApiCreatedResponse({ type: GetBookingTransactionOKResponseBodyDTO })
    async getById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
        let resData = await this.bookingTransactionService.getBookingTxnById(id)
        let dto: GetBookingTransactionOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Booking transaction fetched succesfully",
            data: resData
        }
        return dto
    }

    @Put("/:id")
    @ApiOperation({description:"update booking",summary:"update booking"})
    @ApiCreatedResponse({ type: UpdateBookingTransactionOKResponseBodyDTO })
    async editById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body(new ValidationPipe({ transform: true })) body: UpdateBookingTransactionRequestBodyDTO) {
        let input: UpdateBookingTransactionInput = {
            ...body,
        }
        if (body.date_and_time) {
            input.date_and_time = new Date(body.date_and_time)
        }
        let resData = await this.bookingTransactionService.editBookingTxn(id, input)
        let dto: UpdateBookingTransactionOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Booking transaction updated succesfully",
            data: resData
        }
        return dto
    }

    @Put("/:id/status/actions/confirm")
    @UseGuards(AuthGuard)
    @ApiOperation({description:"confirm booking",summary:"confirm booking"})
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: UpdateBookingTransactionOKResponseBodyDTO })
    async confirmBookingById(@Req() authReq: AuthRequest, @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {

        let resData = await this.bookingTransactionService.confirmBookingTxn(authReq.user.id, id)
        let dto: UpdateBookingTransactionOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Booking transaction confirmed succesfully",
            data: resData
        }
        return dto
    }

    @Put("/:id/status/actions/cancel")
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: UpdateBookingTransactionOKResponseBodyDTO })
    @ApiOperation({description:"cancel booking",summary:"cancel booking"})
    @ApiBearerAuth()
    async cancelBookingById(@Req() authReq: AuthRequest, @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {

        let resData = await this.bookingTransactionService.cancelBookingTxn(authReq.user.id, id)
        let dto: UpdateBookingTransactionOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Booking transaction cancelled succesfully",
            data: resData
        }
        return dto
    }

    @Delete("/:id")
    @ApiOperation({description:"delete booking",summary:"delete booking"})
    @ApiCreatedResponse({ type: DeleteBookingTransactionOKResponseBodyDTO })
    async deleteById(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
        let resData = await this.bookingTransactionService.deleteBookingTxn(id)
        let dto: DeleteBookingTransactionOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "Booking transaction deleted succesfully",
        }
        return dto
    }
}
