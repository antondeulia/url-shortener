import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	imports: [
		MongooseModule.forRoot(
			`mongodb+srv://antondeulia06:rsoMSWiSJe0oiPCP@cluster01.tgx2z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`
		)
	]
})
export class MongoDbModule {}
