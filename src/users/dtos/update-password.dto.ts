import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdatePasswordDto {
	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsDefined()
	@IsString()
	@MinLength(6)
	newPassword: string

	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsDefined()
	@IsString()
	@MinLength(6)
	oldPassword: string
}
