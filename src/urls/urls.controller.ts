import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common'
import { UrlsService } from './urls.service'
import { ShortenUrlDto } from './dtos/shorten-url.dto'
import { Response } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
	constructor(private readonly urlsService: UrlsService) {}

	@ApiOperation({ description: 'Returns all short urls' })
	@Get()
	async get(): Promise<any> {
		return await this.urlsService.get()
	}

	@ApiOperation({ description: 'Redirects to full url by code' })
	@Get(':code')
	async redirect(
		@Param('code') code: string,
		@Res({ passthrough: true }) res: Response
	): Promise<any> {
		await this.urlsService.redirect(code, res)
	}

	@ApiOperation({ description: 'Shorten given url' })
	@Post('shorten')
	async shortenUrl(@Body() dto: ShortenUrlDto): Promise<any> {
		return await this.urlsService.shortenUrl(dto)
	}

	@ApiOperation({ description: 'Update a short url' })
	@Patch(':id')
	async updateOne(@Param('id') id: string, @Body() dto: any) {
		return await this.urlsService.updateOne(id, dto)
	}

	@ApiOperation({ description: 'Delete a short url' })
	@Delete(':id')
	async deleteOne(@Param('id') id: string): Promise<any> {
		return await this.urlsService.deleteOne(id)
	}
}
