import { Test, TestingModule } from '@nestjs/testing'
import { ShortUrlsService } from './short-urls.service'
import { getModelToken } from '@nestjs/mongoose'
import { ShortUrl } from './schemas/short-url.schema'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { Document, Model } from 'mongoose'
import { shortUrlIdMock, shortUrlMock } from '../../test/mocks/short-url.mock'
import { userIdMock } from '../../test/mocks/constants.mock'
import { Cache } from 'cache-manager'
import { Response } from 'express'
import { NotFoundException } from '@nestjs/common'
import { SHORT_URL_NOT_FOUND } from './short-urls.constants'
import { ShortUrlTypesEnum } from './enums/shorten-url-types.enum'

const PRIVATE_METHODS = {
	getOne: 'getOne',
	getOneOrThrow: 'getOneOrThrow',
	isUrlAccessible: 'isUrlAccessible',
	generateCode: 'generateCode',
	extractUrlType: 'extractUrlType'
}

describe('ShortUrlsService', () => {
	let shortUrlsService: ShortUrlsService
	let shortUrlModel: Model<ShortUrl>
	let cacheManager: Cache
	let configService: ConfigService

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				ShortUrlsService,
				{
					provide: getModelToken(ShortUrl.name),
					useValue: {
						find: jest.fn(),
						findOne: jest.fn(),
						updateOne: jest.fn(),
						create: jest.fn(),
						save: jest.fn(),
						deleteOne: jest.fn()
					}
				},
				{
					provide: CACHE_MANAGER,
					useValue: {
						get: jest.fn(),
						set: jest.fn(),
						del: jest.fn()
					}
				},
				{
					provide: ConfigService,
					useValue: {
						getOrThrow: jest.fn()
					}
				}
			]
		}).compile()

		shortUrlsService = moduleRef.get<ShortUrlsService>(ShortUrlsService)
		shortUrlModel = moduleRef.get<Model<ShortUrl>>(getModelToken(ShortUrl.name))
		cacheManager = moduleRef.get<Cache>(CACHE_MANAGER)
		configService = moduleRef.get<ConfigService>(ConfigService)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	describe('get', () => {
		it('return an array of shortened urls', async () => {
			jest.spyOn(shortUrlModel, 'find').mockResolvedValueOnce([shortUrlMock])

			const shortUrls = await shortUrlsService.get(userIdMock)

			expect(shortUrlModel.find).toHaveBeenCalledTimes(1)
			expect(shortUrlModel.find).toHaveBeenCalledWith({ userId: userIdMock })

			expect(shortUrls).toEqual([shortUrlMock])
		})
	})

	describe('getStatus', () => {
		it('return status of a shortened url', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockResolvedValueOnce(shortUrlMock)

			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.isUrlAccessible
			).mockResolvedValueOnce(true)

			await shortUrlsService.getStatus(userIdMock, shortUrlIdMock)

			expect(shortUrlsService[PRIVATE_METHODS.getOneOrThrow]).toHaveBeenCalledTimes(
				1
			)
			expect(shortUrlsService[PRIVATE_METHODS.getOneOrThrow]).toHaveBeenCalledWith({
				id: shortUrlIdMock,
				userId: userIdMock
			})

			expect(
				shortUrlsService[PRIVATE_METHODS.isUrlAccessible]
			).toHaveBeenCalledTimes(1)
			expect(
				shortUrlsService[PRIVATE_METHODS.isUrlAccessible]
			).toHaveBeenCalledWith(shortUrlMock.url)
		})

		it('shortened url was not found', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockRejectedValueOnce(new NotFoundException(SHORT_URL_NOT_FOUND))

			await expect(
				shortUrlsService.getStatus(userIdMock, shortUrlIdMock)
			).rejects.toThrow(new NotFoundException(SHORT_URL_NOT_FOUND))
		})
	})

	describe('openOne', () => {
		it('redirect to full url by cache', async () => {
			jest.spyOn(cacheManager, 'get').mockResolvedValueOnce('fullUrl')

			jest.spyOn(shortUrlModel, 'updateOne').mockResolvedValueOnce(null)

			await shortUrlsService.openOne(shortUrlMock.code, {
				redirect: () => {}
			} as unknown as Response)
		})

		it('redirect to full url by database', async () => {
			jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null)

			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockResolvedValueOnce(shortUrlModel)

			jest.spyOn(shortUrlModel, 'updateOne').mockResolvedValueOnce(null)

			await shortUrlsService.openOne(shortUrlMock.code, {
				redirect: () => {}
			} as unknown as Response)
		})

		it('throws 404 error if short url was not found', async () => {
			jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null)

			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockRejectedValueOnce(new NotFoundException(SHORT_URL_NOT_FOUND))

			await expect(
				shortUrlsService.openOne(shortUrlMock.code, {
					redirect: () => {}
				} as unknown as Response)
			).rejects.toThrow(new NotFoundException(SHORT_URL_NOT_FOUND))
		})
	})

	describe('updateOne', () => {
		it('updates a shortened url metadata', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockResolvedValueOnce(shortUrlMock)

			jest.spyOn(shortUrlModel, 'updateOne').mockResolvedValueOnce(null)

			await shortUrlsService.updateOne(userIdMock, shortUrlIdMock, {
				name: 'name'
			})

			expect(shortUrlsService[PRIVATE_METHODS.getOneOrThrow]).toHaveBeenCalledTimes(
				1
			)

			expect(shortUrlModel.updateOne).toHaveBeenCalledTimes(1)
		})

		it('updates shortened url link', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockResolvedValueOnce(shortUrlMock)

			jest.spyOn(shortUrlModel, 'updateOne').mockResolvedValueOnce(null)

			jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(null)

			await shortUrlsService.updateOne(userIdMock, shortUrlIdMock, {
				url: 'new url'
			})

			expect(shortUrlsService[PRIVATE_METHODS.getOneOrThrow]).toHaveBeenCalledTimes(
				1
			)

			expect(shortUrlModel.updateOne).toHaveBeenCalledTimes(1)

			expect(cacheManager.set).toHaveBeenCalledTimes(1)
		})

		it('throws 404 if short url was not found', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockRejectedValueOnce(new NotFoundException(SHORT_URL_NOT_FOUND))

			await expect(
				shortUrlsService.updateOne(userIdMock, shortUrlIdMock, {})
			).rejects.toThrow(new NotFoundException(SHORT_URL_NOT_FOUND))
		})
	})

	describe('deleteOne', () => {
		it('deletes a shortened url', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockResolvedValueOnce(shortUrlMock)

			jest.spyOn(shortUrlModel, 'deleteOne').mockResolvedValueOnce(null)

			await shortUrlsService.deleteOne(userIdMock, shortUrlIdMock)

			expect(shortUrlsService[PRIVATE_METHODS.getOneOrThrow]).toHaveBeenCalledTimes(
				1
			)

			expect(shortUrlModel.deleteOne).toHaveBeenCalledTimes(1)
		})

		it('throws 404 if shortened url was not found', async () => {
			jest.spyOn(
				shortUrlsService as any,
				PRIVATE_METHODS.getOneOrThrow
			).mockRejectedValueOnce(new NotFoundException(SHORT_URL_NOT_FOUND))

			await expect(
				shortUrlsService.deleteOne(userIdMock, shortUrlIdMock)
			).rejects.toThrow(new NotFoundException(SHORT_URL_NOT_FOUND))
		})
	})
})
