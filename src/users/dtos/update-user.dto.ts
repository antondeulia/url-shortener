import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsOptional()
	@IsEmail()
	email?: string
}
