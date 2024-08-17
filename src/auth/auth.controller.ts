import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { RegisterDto } from './dtos/register.dto'
import { Response } from 'express'
import { LocalGuard } from './guards/local.guard'
import { CurrentUser } from 'src/utils/decorators/current-user.decorator'
import { Types } from 'mongoose'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.register(dto, res)
	}

	@UseGuards(LocalGuard)
	@Post('login')
	async login(
		@CurrentUser('_id') id: Types.ObjectId,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.generateTokens(id, res)
	}

	@Post('refresh')
	async refresh() {
		return await this.authService.refresh()
	}
}
