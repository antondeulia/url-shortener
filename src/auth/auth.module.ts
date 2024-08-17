import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { STRATEGIES } from './strategies'
import { GUARDS } from './guards'

@Module({
	imports: [UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, ...STRATEGIES, ...GUARDS]
})
export class AuthModule {}
