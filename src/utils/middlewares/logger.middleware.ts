import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { gray, white } from 'colorette'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP')

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl } = req
		const start = Date.now()

		res.on('finish', () => {
			const { statusCode } = res
			const duration = Date.now() - start

			this.logger.log(
				`${white(method)} ${white(originalUrl)} ${white(statusCode)} - ${white(duration + 'ms')}`
			)
		})

		next()
	}
}
