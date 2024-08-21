import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	UseGuards
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard'
import { UpdateUserDto } from './dtos/update-user.dto'
import { CurrentUser } from 'src/utils/decorators/current-user.decorator'
import { SkipThrottle } from '@nestjs/throttler'
import { UpdatePasswordDto } from './dtos/update-password.dto'
import { Types } from 'mongoose'

@SkipThrottle()
@ApiBearerAuth('jwt')
@ApiTags('users')
@UseGuards(JwtAccessGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Get a user' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Returns a user by jwt' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User was not found' })
	@Get()
	async getOne(@CurrentUser('_id') id: string) {
		return await this.usersService.getOneOrThrow({
			id
		})
	}

	@ApiOperation({ summary: "Updates user's profile" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User's profile sucessfully updated"
	})
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User was not found' })
	@Patch()
	async updateOne(@CurrentUser('_id') id: string, @Body() dto: UpdateUserDto) {
		return await this.usersService.updateOne(id, dto)
	}

	@ApiOperation({ summary: "Updates user's password" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Password was successfully changed'
	})
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid old password' })
	@Patch('update-password')
	async updatePassword(
		@CurrentUser('_id') id: string,
		@Body() dto: UpdatePasswordDto
	): Promise<Types.ObjectId> {
		return await this.usersService.updatePassword(id, dto)
	}
}
