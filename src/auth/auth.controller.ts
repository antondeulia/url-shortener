import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterDto } from './dtos/register.dto'
import { Response } from 'express'
import { LocalGuard } from './guards/local.guard'
import { CurrentUser } from '../utils/decorators/current-user.decorator'
import { Types } from 'mongoose'
import { LoginDto } from './dtos/login.dto'
import { SkipThrottle } from '@nestjs/throttler'

@SkipThrottle()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Register a user' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Succesfully registered' })
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Credentials are already in use'
	})
	@Post('register')
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.register(dto, res)
	}

	@ApiOperation({ summary: 'Login a user' })
	@ApiBody({ type: LoginDto })
	@ApiResponse({ status: HttpStatus.OK, description: 'Succesfully loged in' })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
	@UseGuards(LocalGuard)
	@Post('login')
	async login(
		@CurrentUser('_id') id: Types.ObjectId,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.generateTokens(id, res)
	}
}
