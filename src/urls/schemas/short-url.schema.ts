import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { ShortUrlTypesEnum } from '../enums/shorten-url-types.enum'

export type ShortUrlDocument = HydratedDocument<ShortUrl>

@Schema({ timestamps: true, collection: 'short_urls' })
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
	userId: Types.ObjectId

	@Prop({ default: '#fff' })
	bgColor?: string
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl)
