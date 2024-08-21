import { ApiProperty } from '@nestjs/swagger'
import {
	IsHexColor,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength
} from 'class-validator'

export class UpdateShortUrlDto {
	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsOptional()
	@IsHexColor()
	bgColor?: string

	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@MaxLength(27)
	name?: string

	@ApiProperty({ required: false })
	@IsNotEmpty()
	@IsOptional()
	@IsUrl()
	url?: string
}
