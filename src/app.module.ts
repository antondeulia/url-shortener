import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ShortUrlsModule } from './urls/short-urls.module'
import { RedisModule } from './utils/modules/redis.module'
import { ConfigModule } from '@nestjs/config'
import { MongoDbModule } from './utils/modules/mongo-db.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { LoggerMiddleware } from './utils/middlewares/logger.middleware'
import { SentryModule } from '@sentry/nestjs/setup'

@Module({
	imports: [
		SentryModule.forRoot(),
		ConfigModule.forRoot({ isGlobal: true }),
		RedisModule,
		MongoDbModule,
		ShortUrlsModule,
		UsersModule,
		AuthModule
	]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
