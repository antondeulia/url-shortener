import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { LoggerInterceptor } from './utils/interceptors/logger.interceptor'
import { setupSwagger } from './utils/swagger/swagger.config'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create(AppModule)

	setupSwagger(app)

	app.useGlobalInterceptors(new LoggerInterceptor())

	const configService = app.get<ConfigService>(ConfigService)
	const PORT = configService.getOrThrow<number>('PORT')

	await app.listen(PORT)
}
bootstrap()
