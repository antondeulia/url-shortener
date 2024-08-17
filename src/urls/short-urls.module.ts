import { Module } from '@nestjs/common'
import { ShortUrlsService } from './short-urls.service'
import { ShortUrlsController } from './short-urls.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ShortUrl, ShortUrlSchema } from './schemas/short-url.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: ShortUrl.name, schema: ShortUrlSchema }])
	],
	controllers: [ShortUrlsController],
	providers: [ShortUrlsService]
})
export class ShortUrlsModule {}
