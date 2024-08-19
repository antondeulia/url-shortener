import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const setupSwagger = (app: NestExpressApplication) => {
	const config = new DocumentBuilder()
		.setTitle('ShorterURL API')
		.setDescription('Sinova test-task')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'jwt'
			},
			'jwt'
		)
		.build()

	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('docs', app, document)
}
