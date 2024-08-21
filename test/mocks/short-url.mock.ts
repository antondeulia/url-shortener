import { Types } from 'mongoose'
import { ShortUrlTypesEnum } from '../../src/urls/enums/shorten-url-types.enum'
import { ShortUrl } from '../../src/urls/schemas/short-url.schema'

export const shortUrlIdMock: string = 'string'

export const shortUrlMock: ShortUrl = {
	name: 'string',
	url: 'string',
	bgColor: 'string',
	clicks: 0,
	code: 'string',
	shortenedUrl: 'string',
	type: ShortUrlTypesEnum.email,
	userId: 'string' as unknown as Types.ObjectId
}
