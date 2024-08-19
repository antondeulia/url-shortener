import { ApiProperty } from '@nestjs/swagger'
import {
	IsDefined,
	IsHexColor,
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
	url: string

	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsOptional()
	@IsHexColor()
	bgColor?: string
}
