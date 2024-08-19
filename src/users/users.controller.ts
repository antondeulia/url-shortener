import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiTags } from '@nestjs/swagger'
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard'
import { UpdateUserDto } from './dtos/update-user.dto'

@ApiTags('users')
@UseGuards(JwtAccessGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Patch(':id')
	async updateOne(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return await this.usersService.updateOne(id, dto)
	}
}
