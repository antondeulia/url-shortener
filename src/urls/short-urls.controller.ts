import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res,
	UseGuards
} from '@nestjs/common'
import { ShortUrlsService } from './short-urls.service'
import { CreateShortUrlDto } from './dtos/create-short-url.dto'
import { Response } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard'
import { CurrentUser } from '../utils/decorators/current-user.decorator'
import { SHORT_URLS } from './short-urls.constants'
import { ShortUrl } from './schemas/short-url.schema'
import { Types } from 'mongoose'
import { GetShortUrlsQueryDto } from './dtos/get-short-urls-query.dto'

@ApiTags(SHORT_URLS)
@UseGuards(JwtAccessGuard)
@Controller(SHORT_URLS)
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}

	@ApiOperation({ description: 'Returns all short urls' })
	@HttpCode(HttpStatus.OK)
	@Get()
	async get(
		@CurrentUser('_id') userId: string,
		@Query() queryDto: GetShortUrlsQueryDto
	): Promise<any> {
		return await this.shortUrlsService.get(userId, queryDto)
	}

	@ApiOperation({ description: 'Returns status of the short url' })
	@Get(':code/status')
	async getStatus(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string
	): Promise<any> {
		return await this.shortUrlsService.getStatus(userId, id)
	}

	@ApiOperation({ description: 'Redirects to full url by code' })
	@HttpCode(HttpStatus.OK)
	@Get(':code')
	async openOne(
		@CurrentUser('_id') userId: string,
		@Param('code') code: string,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		await this.shortUrlsService.openOne(userId, code, res)
	}

	@ApiOperation({ description: 'Shorten given url' })
	@HttpCode(HttpStatus.OK)
	@Post('shorten')
	async shortenUrl(
		@CurrentUser('_id') userId: string,
		@Body() dto: CreateShortUrlDto
	): Promise<ShortUrl> {
		return await this.shortUrlsService.createOne(userId, dto)
	}

	@ApiOperation({ description: 'Update a short url' })
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async updateOne(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string,
		@Body() dto: any
	): Promise<Types.ObjectId> {
		return await this.shortUrlsService.updateOne(userId, id, dto)
	}

	@ApiOperation({ description: 'Delete a short url' })
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async deleteOne(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string
	): Promise<any> {
		return await this.shortUrlsService.deleteOne(userId, id)
	}
}
