import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const swaggerSetup = (app: NestExpressApplication) => {
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

	SwaggerModule.setup('docs', app, document, {
		customCssUrl:
			'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
		customJs: [
			'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
			'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
		]
	})
}
