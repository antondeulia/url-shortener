import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsDefined()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsNotEmpty()
	@IsDefined()
	@IsString()
	@MinLength(6)
	password: string
}
