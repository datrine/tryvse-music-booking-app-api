import { Body, Controller, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSigninRequestBodyDTO } from './dto/request.dto';
import { UserSigninOKResponseBodyDTO } from './dto/response.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post("/signin")
                    @ApiOperation({description:"sign in",summary:"sign in"})
    async signin(@Body(new ValidationPipe({ transform: true })) body: UserSigninRequestBodyDTO) {
        let resData = await this.authService.signin(body)
        let { id, ...rest } = resData
        let dto: UserSigninOKResponseBodyDTO = {
            statusCode: HttpStatus.OK,
            message: "log in successful",
            data: { ...rest, user_id: id }
        }
        return dto
    }
}
