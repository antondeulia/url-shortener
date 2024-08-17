import { ApiProperty } from '@nestjs/swagger'

export class GetShortUrlDto {
	@ApiProperty()
	id?: string

	@ApiProperty()
	code?: string
}
