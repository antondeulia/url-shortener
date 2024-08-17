import { ApiProperty } from '@nestjs/swagger'

export class UpdateShortUrlDto {
	@ApiProperty()
	clicks: number
}
