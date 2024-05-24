import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from 'src/schemas/Shop.schema';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Shop.name) private shopModel: Model<Shop>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto) {
        signUpDto.password = await bcrypt.hash(signUpDto.password, 10)

        await this.shopModel.create(signUpDto)

        return { "msg": "Shop created successfully" }
    }

    async signIn(signInDto: SignInDto) {
        const { ruc, password } = signInDto

        const shop = await this.shopModel.findOne({ ruc })

        if (!shop) throw new UnauthorizedException('Invalid user or password')
        
        const isPasswordMatched = await bcrypt.compare(password, shop.password)
        
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid user or password')

        return { ...shop.toObject(), token: this.jwtService.sign({ id: shop._id })}
    }

    async validateShop(id: string) {
        const shop = await this.shopModel.findById(id)

        if (!shop) throw new UnauthorizedException('Invalid token')

        return shop
    }
}
