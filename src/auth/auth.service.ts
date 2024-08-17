import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { hash, verify } from 'argon2'
import { RegisterDto } from './dtos/register.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { JwtTokensEnum } from 'src/utils/enums/jwt-tokens.enum'
import { Types } from 'mongoose'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async register({ email, password }: RegisterDto, res: Response): Promise<string> {
		const hashedPassword = await hash(password)

		const user = await this.usersService.createOne({ email, hashedPassword })

		return await this.generateTokens(user._id, res)
	}

	async refresh() {}

	async generateTokens(userId: Types.ObjectId, res: Response): Promise<string> {
		const accessToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
				expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES')
			}
		)

		const refreshToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES')
			}
		)

		res.cookie(JwtTokensEnum.refreshToken, refreshToken, {
			httpOnly: true,
			secure: true
		})

		return accessToken
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.usersService.getOne({ email })

		if (!user) {
			return false
		}

		const isPasswordValid = verify(user.hashedPassword, password)

		if (!isPasswordValid) {
			return false
		}

		return user
	}
}
