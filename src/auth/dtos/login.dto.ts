import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({ required: true, example: 'test@gmail.com' })
	email: string

	@ApiProperty({ required: true, example: 'pass' })
	password: string
}
