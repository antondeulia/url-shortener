import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { ShortUrlTypesEnum } from '../enums/shorten-url-types.enum'

export type ShortenUrlDocument = HydratedDocument<ShortUrl>

@Schema()
export class ShortUrl {
	@Prop({ required: false })
	name?: string

	@Prop({ required: true })
	fullUrl: string

	@Prop({ required: true })
	url: string

	@Prop({ required: true })
	code: string

	@Prop({ required: true, enum: ShortUrlTypesEnum })
	type: ShortUrlTypesEnum

	@Prop({ default: 0 })
	clicks: number
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl)
