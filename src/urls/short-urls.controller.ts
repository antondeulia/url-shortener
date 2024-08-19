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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard'
import { CurrentUser } from '../utils/decorators/current-user.decorator'
import { SHORT_URLS } from './short-urls.constants'
import { ShortUrl } from './schemas/short-url.schema'
import { Types } from 'mongoose'
import { GetShortUrlsQueryDto } from './dtos/get-short-urls-query.dto'

@ApiBearerAuth('jwt')
@ApiTags(SHORT_URLS)
@Controller(SHORT_URLS)
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}

	@UseGuards(JwtAccessGuard)
	@ApiOperation({ summary: 'Get all shorten urls for user' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns an array of shorten urls'
	})
	@HttpCode(HttpStatus.OK)
	@Get()
	async get(
		@CurrentUser('_id') userId: string,
		@Query() queryDto: GetShortUrlsQueryDto
	): Promise<any> {
		return await this.shortUrlsService.get(userId, queryDto)
	}

	@UseGuards(JwtAccessGuard)
	@ApiOperation({ summary: 'Get status of a short url' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Returns status of a short url' })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Shorten url was not found'
	})
	@Get(':code/status')
	async getStatus(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string
	): Promise<any> {
		return await this.shortUrlsService.getStatus(userId, id)
	}

	@ApiOperation({ summary: 'Redirects to full url' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Successfully redirected to a full url'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Shorten url was not found'
	})
	@HttpCode(HttpStatus.OK)
	@Get(':code')
	async openOne(
		@Param('code') code: string,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		await this.shortUrlsService.openOne(code, res)
	}

	@UseGuards(JwtAccessGuard)
	@ApiOperation({ summary: 'Shorten given url' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Succesfully shortened given url'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Given url is not accessible'
	})
	@HttpCode(HttpStatus.OK)
	@Post('shorten')
	async shortenUrl(
		@CurrentUser('_id') userId: string,
		@Body() dto: CreateShortUrlDto
	): Promise<ShortUrl> {
		return await this.shortUrlsService.createOne(userId, dto)
	}

	@UseGuards(JwtAccessGuard)
	@ApiOperation({ summary: 'Update a short url' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Shortened url successfully updated'
	})
	@ApiResponse({ status: HttpStatus.NOT_FOUND })
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async updateOne(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string,
		@Body() dto: any
	): Promise<Types.ObjectId> {
		return await this.shortUrlsService.updateOne(userId, id, dto)
	}

	@UseGuards(JwtAccessGuard)
	@ApiOperation({ summary: 'Delete a short url' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Shorten url was succesfully deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Shortened url was not found'
	})
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async deleteOne(
		@CurrentUser('_id') userId: string,
		@Param('id') id: string
	): Promise<any> {
		return await this.shortUrlsService.deleteOne(userId, id)
	}
}
