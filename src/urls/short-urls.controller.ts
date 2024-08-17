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
	Res,
	UseGuards
} from '@nestjs/common'
import { ShortUrlsService } from './short-urls.service'
import { CreateShortUrlDto } from './dtos/create-short-url.dto'
import { Response } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard'
import { CurrentUser } from 'src/utils/decorators/current-user.decorator'
import { SHORT_URLS } from './short-urls.constants'

@ApiTags(SHORT_URLS)
@UseGuards(JwtAccessGuard)
@Controller(SHORT_URLS)
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}

	@ApiOperation({ description: 'Returns all short urls' })
	@HttpCode(HttpStatus.OK)
	@Get()
	async get(@CurrentUser('_id') userId: string): Promise<any> {
		return await this.shortUrlsService.get(userId)
	}

	@ApiOperation({ description: 'Redirects to full url by code' })
	@HttpCode(HttpStatus.OK)
	@Get(':code')
	async redirect(
		@CurrentUser('_id') userId: string,
		@Param('code') code: string,
		@Res({ passthrough: true }) res: Response
	): Promise<any> {
		await this.shortUrlsService.openOne(userId, code, res)
	}

	@ApiOperation({ description: 'Shorten given url' })
	@HttpCode(HttpStatus.OK)
	@Post('shorten')
	async shortenUrl(
		@CurrentUser('_id') userId: string,
		@Body() dto: CreateShortUrlDto
	): Promise<any> {
		return await this.shortUrlsService.createOne(userId, dto)
	}

	@ApiOperation({ description: 'Update a short url' })
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async updateOne(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string,
		@Body() dto: any
	) {
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
