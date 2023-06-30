import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./tokens.schema";
import { TokenService } from "./tokens.service";

@Global()
@Module({
    imports:[MongooseModule.forFeature([ {name: Token.name, schema: TokenSchema} ])],
    providers: [TokenService],
    exports: [TokenService],
})

export class TokenModule {};
