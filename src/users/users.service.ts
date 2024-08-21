import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './users.schema'
import { Model, Types } from 'mongoose'
import { GetUserDto } from './dtos/get-user.dto'
import { USER_NOT_FOUND } from './users.constants'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { hash, verify } from 'argon2'
import { UpdatePasswordDto } from './dtos/update-password.dto'

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

	async getOne({ id, email, options }: GetUserDto) {
		if (id) {
			const user = await this.userModel.findById(id)

			if (user && !options?.returnPassword) {
				delete user.hashedPassword
			}

			return user
		}

		if (email) {
			const user = await this.userModel.findOne({ email })

			if (user && !options?.returnPassword) {
				delete user.hashedPassword
			}

			return user
		}
	}

	async getOneOrThrow(dto: GetUserDto) {
		const user = await this.getOne(dto)

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND)
		}

		return user
	}

	async createOne({ email, hashedPassword }: CreateUserDto) {
		const user = await this.getOne({ email })

		if (user) {
			throw new ConflictException('User with this email already exists')
		}

		const createdUser = await this.userModel.create({
			email,
			hashedPassword
		})

		const savedUser = await createdUser.save()

		return savedUser._id
	}

	async updateOne(id: string, dto: UpdateUserDto) {
		const user = await this.getOneOrThrow({ id })

		try {
			if (dto.email) {
				const userByEmail = await this.userModel.findOne({ email: dto.email })

				if (userByEmail) {
					throw new ConflictException(
						'User with this email is already existing'
					)
				}
			}

			await this.userModel.updateOne({ _id: id }, { $set: dto })

			return user._id
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async updatePassword(id: string, dto: UpdatePasswordDto): Promise<Types.ObjectId> {
		const user = await this.getOneOrThrow({ id })

		const isPasswordValid = await verify(user.hashedPassword, dto.oldPassword)

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid password')
		}

		const hashedPassword = await hash(dto.newPassword)

		await this.userModel.updateOne({ _id: id }, { $set: { hashedPassword } })

		return user._id
	}

	async deleteOne(id: string) {
		const user = await this.getOneOrThrow({ id })

		try {
			await this.userModel.deleteOne({ _id: id })

			return user._id
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}
}
