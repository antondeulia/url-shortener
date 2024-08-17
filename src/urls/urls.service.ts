import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { ShortenUrlDto } from './dtos/shorten-url.dto'
import { InjectModel } from '@nestjs/mongoose'
import { ShortUrl } from './schemas/shorten-url.schema'
import { Model } from 'mongoose'
import { Response } from 'express'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { SHORT_URL_NOT_FOUND } from './urls.constants'

@Injectable()
export class UrlsService {
	constructor(
		@InjectModel(ShortUrl.name) private readonly shortUrlModel: Model<ShortUrl>,
		@Inject(CACHE_MANAGER) private readonly cache: Cache
	) {}

	async get(): Promise<ShortUrl[]> {
		return await this.shortUrlModel.find()
	}

	async getOne(id: string) {
		return await this.shortUrlModel.findOne({ _id: id })
	}

	async getOneOrThrow(id: string) {
		const shortUrl = await this.getOne(id)

		if (!shortUrl) {
			throw new NotFoundException(SHORT_URL_NOT_FOUND)
		}

		return shortUrl
	}

	async redirect(code: string, res: Response): Promise<any> {
		const fullUrl: string = await this.cache.get(code)

		if (fullUrl) {
			res.redirect(fullUrl)
		} else {
			const shortUrl: ShortUrl = await this.shortUrlModel.findOne({ code })

			if (!shortUrl) {
				throw new NotFoundException(SHORT_URL_NOT_FOUND)
			}

			res.redirect(shortUrl.type + shortUrl.url)
		}
	}

	async shortenUrl({ url, type, name }: ShortenUrlDto): Promise<any> {
		const fullUrl = type + url

		await this.isUrlAccessible(fullUrl)

		const code = this.generateUniqueString(6)

		const shortUrl = 'http://localhost:4200/api/urls/' + code

		const createdShortUrl = new this.shortUrlModel({
			fullUrl,
			url: shortUrl,
			code,
			type,
			name
		})

		try {
			const savedShortUrl = await createdShortUrl.save()

			await this.cache.set(savedShortUrl.code, fullUrl)

			return savedShortUrl._id
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async updateOne(id: string, dto: any): Promise<any> {
		const shortUrl = await this.getOneOrThrow(id)

		try {
			await this.shortUrlModel.updateOne({ _id: id }, { $set: dto })

			return shortUrl._id
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async deleteOne(id: string): Promise<any> {
		const shortUrl = await this.getOneOrThrow(id)

		try {
			await this.shortUrlModel.deleteOne(shortUrl._id)

			return shortUrl._id
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
}
