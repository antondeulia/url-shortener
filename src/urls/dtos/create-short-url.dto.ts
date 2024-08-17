import { ApiProperty } from '@nestjs/swagger'
import {
	IsDefined,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength
} from 'class-validator'

export class CreateShortUrlDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(18)
	name?: string

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsDefined()
	@IsString()
	@IsUrl()
	fullUrl: string
}
