import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { CreateShortUrlDto } from './dtos/create-short-url.dto'
import { InjectModel } from '@nestjs/mongoose'
import { ShortUrl } from './schemas/short-url.schema'
import { Model, Types } from 'mongoose'
import { Response } from 'express'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { SHORT_URL_NOT_FOUND, SHORT_URLS } from './short-urls.constants'
import { UpdateShortUrlDto } from './dtos/update-short-url.dto'
import { GetShortUrlDto } from './dtos/get-short-url.dto'
import { ConfigService } from '@nestjs/config'
import { ShortUrlTypesEnum } from './enums/shorten-url-types.enum'

@Injectable()
export class ShortUrlsService {
	private readonly HOST = this.configService.getOrThrow<string>('HOST')

	constructor(
		@InjectModel(ShortUrl.name) private readonly shortUrlModel: Model<ShortUrl>,
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly configService: ConfigService
	) {}

	async get(userId: string): Promise<ShortUrl[]> {
		return await this.shortUrlModel.find({ user: userId })
	}

	async getOne({ id, code }: GetShortUrlDto) {
		if (id) {
			return await this.shortUrlModel.findById(id)
		}

		if (code) {
			return await this.shortUrlModel.findOne({ code })
		}
	}

	async getOneOrThrow(dto: GetShortUrlDto) {
		const shortUrl = await this.getOne(dto)

		if (!shortUrl) {
			throw new NotFoundException(SHORT_URL_NOT_FOUND)
		}

		return shortUrl
	}

	async openOne(userId: string, code: string, res: Response): Promise<void> {
		const fullUrl: string = await this.cache.get(code)

		if (fullUrl) {
			const shortUrl = await this.getOneOrThrow({ code })

			await this.shortUrlModel.updateOne(
				{ _id: shortUrl._id },
				{ $set: { clicks: shortUrl.clicks + 1 } }
			)

			res.redirect(fullUrl)
		} else {
			const shortUrl = await this.shortUrlModel.findOne({
				code,
				user: userId
			})

			if (!shortUrl) {
				throw new NotFoundException(SHORT_URL_NOT_FOUND)
			}

			await this.shortUrlModel.updateOne(
				{ _id: shortUrl._id },
				{ clicks: shortUrl.clicks + 1 }
			)

			res.redirect(shortUrl.type + shortUrl.shortenedUrl)
		}
	}

	async createOne(
		userId: string,
		{ fullUrl, name }: CreateShortUrlDto
	): Promise<ShortUrl> {
		const existingShortUrl = await this.shortUrlModel.findOne({
			fullUrl,
			user: userId
		})

		if (existingShortUrl) {
			throw new ConflictException('Short url for ' + fullUrl + ' already exists')
		}

		await this.isUrlAccessible(fullUrl)

		const code = this.generateUniqueString(6)
		const shortenedUrl = this.HOST + `/${SHORT_URLS}/` + code
		const type = this.extractUrlType(fullUrl)

		const createdShortUrl = new this.shortUrlModel({
			fullUrl,
			shortenedUrl,
			code,
			type,
			name,
			user: userId
		})

		try {
			const savedShortUrl = await createdShortUrl.save()

			await this.cache.set(savedShortUrl.code, fullUrl)

			return savedShortUrl
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async updateOne(
		userId: string,
		id: string,
		dto: UpdateShortUrlDto
	): Promise<Types.ObjectId> {
		const shortUrl = await this.getOneOrThrow({ id })

		try {
			await this.shortUrlModel.updateOne({ _id: id, user: userId }, { $set: dto })

			return shortUrl._id
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async deleteOne(userId: string, id: string): Promise<ShortUrl> {
		const shortUrl = await this.getOneOrThrow({ id })

		try {
			await this.shortUrlModel.deleteOne({ _id: id, user: userId })

			return shortUrl
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	// Private methods
	private async isUrlAccessible(url: string): Promise<boolean> {
		try {
			const response = await fetch(url, { method: 'HEAD' })
			return response.ok
		} catch (error) {
			throw new BadRequestException('The url is not accessible')
		}
	}

	private generateUniqueString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

		let result = ''

		const charactersLength = characters.length

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charactersLength)
			result += characters.charAt(randomIndex)
		}

		return result
	}

	extractUrlType(fullUrl: string): string {
		try {
			const parsedUrl = new URL(fullUrl)

			const protocol = parsedUrl.protocol.replace(':', '')
			const host = parsedUrl.host

			if (host.includes('t.me')) {
				return ShortUrlTypesEnum.telegram
			} else if (host.includes('instagram.com')) {
				return ShortUrlTypesEnum.instagram
			} else if (protocol === 'mailto') {
				return ShortUrlTypesEnum.email
			} else if (host.includes('youtube.com') || host.includes('youtu.be')) {
				return ShortUrlTypesEnum.youtube
			}

			return protocol
		} catch (error) {
			throw new Error('Invalid URL')
		}
	}
}
