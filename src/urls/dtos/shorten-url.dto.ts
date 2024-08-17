import { ApiProperty } from '@nestjs/swagger'
import {
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength
} from 'class-validator'
import { ShortUrlTypesEnum } from '../enums/shorten-url-types.enum'

export class ShortenUrlDto {
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

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(ShortUrlTypesEnum)
	type: ShortUrlTypesEnum
}
