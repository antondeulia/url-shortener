import { Module } from '@nestjs/common'
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-store'

export const RedisOptions: CacheModuleAsyncOptions = {
	isGlobal: true,
	useFactory: async (configService: ConfigService) => {
		const store = await redisStore({
			password: configService.getOrThrow<string>('REDIS_PASSWORD'),
			socket: {
				host: configService.getOrThrow<string>('REDIS_HOST'),
				port: configService.getOrThrow<number>('REDIS_PORT')
			}
		})
		return {
			store: () => store
		}
	},
	inject: [ConfigService]
}

@Module({
	imports: [CacheModule.registerAsync(RedisOptions)]
})
export class RedisModule {}
