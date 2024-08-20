import './utils/sentry/sentry-setup'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { LoggerInterceptor } from './utils/interceptors/logger.interceptor'
import { swaggerSetup } from './utils/swagger/swagger-setup'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Modes } from './utils/enums/modes.enum'
import { Logger } from '@nestjs/common'
import { sentrySetup } from './utils/sentry/sentry-setup'

const logger = new Logger('app')

async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create(AppModule)

	app.useGlobalInterceptors(new LoggerInterceptor())

	const configService = app.get<ConfigService>(ConfigService)
	const PORT = configService.getOrThrow<number>('PORT')
	const MODE: Modes = configService.getOrThrow<Modes>('MODE')

	switch (MODE) {
		case Modes.dev && Modes.stage:
			swaggerSetup(app)
			break
		case Modes.prod:
			sentrySetup(configService.getOrThrow<string>('SENTRY_DSN'))
			break
	}

	await app
		.listen(PORT)
		.then(() => logger.log(`Application is running on PORT:${PORT}`))
}
bootstrap()
