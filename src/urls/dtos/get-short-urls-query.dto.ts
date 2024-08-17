import { ApiProperty } from '@nestjs/swagger'
import { ShortUrlTypesEnum } from '../enums/shorten-url-types.enum'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class GetShortUrlsQueryDto {
	@ApiProperty({ required: false, enum: ShortUrlTypesEnum })
	@IsNotEmpty()
	@IsOptional()
	@IsEnum(ShortUrlTypesEnum)
	type?: ShortUrlTypesEnum
}
