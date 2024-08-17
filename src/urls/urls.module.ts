import { Module } from '@nestjs/common'
import { UrlsService } from './urls.service'
import { UrlsController } from './urls.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ShortUrl, ShortUrlSchema } from './schemas/shorten-url.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: ShortUrl.name, schema: ShortUrlSchema }])
	],
	controllers: [UrlsController],
	providers: [UrlsService]
})
export class UrlsModule {}
