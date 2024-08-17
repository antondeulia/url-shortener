import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { white } from 'colorette'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	private logger = new Logger('HTTP')

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest()
		const { method, url } = req

		const now = Date.now()
		return next.handle().pipe(
			tap(() => {
				const res = context.switchToHttp().getResponse()
				const { statusCode } = res
				const duration = Date.now() - now

				this.logger.log(
					`${white(method)} ${white(url)} ${white(statusCode)} - ${white(duration + 'ms')}`
				)
			})
		)
	}
}
