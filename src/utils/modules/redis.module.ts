import { Module } from '@nestjs/common'
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-store'

export const RedisOptions: CacheModuleAsyncOptions = {
	isGlobal: true,
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const store = await redisStore({
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
