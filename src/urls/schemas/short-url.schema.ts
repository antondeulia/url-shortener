import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { ShortUrlTypesEnum } from '../enums/shorten-url-types.enum'

export type ShortUrlDocument = HydratedDocument<ShortUrl>

@Schema()
export class ShortUrl {
	@Prop({ required: false })
	name?: string

	@Prop({ required: true })
	fullUrl: string

	@Prop({ required: true })
	shortenedUrl: string

	@Prop({ required: true })
	code: string

	@Prop({ required: true, enum: ShortUrlTypesEnum })
	type: ShortUrlTypesEnum

	@Prop({ default: 0 })
	clicks: number

	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	user: Types.ObjectId
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl)
