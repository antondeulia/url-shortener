import { Module } from '@nestjs/common'
import { UrlsModule } from './urls/urls.module'
import { RedisModule } from './utils/modules/redis.module'
import { ConfigModule } from '@nestjs/config'
import { MongoDbModule } from './utils/modules/mongo-db.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		RedisModule,
		MongoDbModule,
		UrlsModule
	]
})
export class AppModule {}
