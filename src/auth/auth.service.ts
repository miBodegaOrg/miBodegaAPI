import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from 'src/schemas/Shop.schema';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';
import { Employee } from 'src/schemas/Employee.schema';
import e from 'express';
import { permission } from 'process';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Shop.name) private shopModel: Model<Shop>,
        @InjectModel(Employee.name) private employeeModel: Model<Employee>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto) {
        signUpDto.password = await bcrypt.hash(signUpDto.password, 10)

        await this.shopModel.create(signUpDto)

        return { "msg": "Shop created successfully" }
    }

    async signIn(signInDto: SignInDto) {
        const { username, password } = signInDto

        const shop = await this.shopModel.findOne({ ruc: username })
        if (shop) {
            const isPasswordMatched = await bcrypt.compare(password, shop.password)
            if (!isPasswordMatched) throw new UnauthorizedException('Invalid ruc or password')
            
            const response = {
                name: shop.name,
                username: shop.ruc,
                phone: shop.phone,
                type: "shop"
            }

            return { ...response, token: this.jwtService.sign({ id: shop._id, role: 'shop'})}
        } else {
            const employee = await this.employeeModel.findOne({ dni: signInDto.username })
            if (!employee) throw new UnauthorizedException('Invalid username or password')

            const isPasswordMatched = await bcrypt.compare(password, employee.password)
            if (!isPasswordMatched) throw new UnauthorizedException('Invalid user or password')
            
            const response = {
                name: employee.name,
                username: employee.dni,
                phone: employee.phone,                   
                type: "employee"
            }

            return { ...response, token: this.jwtService.sign({ id: employee._id, role: 'employee'})}        
        }
    }

    async validate(payload) {
        if (payload.role === 'shop') {
            const shop = await this.shopModel.findById(payload.id)
            if (!shop) throw new UnauthorizedException('Invalid token')

            return { ...shop.toObject(), role: "shop"}
        } else if (payload.role === 'employee') {
            const employee = await this.employeeModel.findById(payload.id)
            if (!employee) throw new UnauthorizedException('Invalid token')

            const shop = await this.shopModel.findById(employee.shop)
            if (!shop) throw new UnauthorizedException('Invalid token')

            return { ...shop.toObject(), role: "employee", permissions: employee.permissions}
        } else {
            throw new UnauthorizedException('Invalid token')
        }
    }
}
