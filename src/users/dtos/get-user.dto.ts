import { ApiProperty } from '@nestjs/swagger'

class GetUserDtoOptions {
	@ApiProperty()
	returnPassword?: boolean
}

export class GetUserDto {
	@ApiProperty()
	id?: string

	@ApiProperty()
	email?: string

	@ApiProperty()
	options?: GetUserDtoOptions
}
