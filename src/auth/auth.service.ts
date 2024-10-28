import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from 'src/schemas/Shop.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';
import { Employee } from 'src/schemas/Employee.schema';
import { UpdateProfileDto } from "./dto/UpdateProfile.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);

    await this.shopModel.create(signUpDto);

    return { msg: 'Shop created successfully' };
  }

  async signIn(signInDto: SignInDto) {
    const { username, password, rememberCredentials } = signInDto;

    const shop = await this.shopModel.findOne({ ruc: username });
    if (shop) {
      const isPasswordMatched = await bcrypt.compare(password, shop.password);
      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid ruc or password');

      const response = {
        name: shop.name,
        username: shop.ruc,
        phone: shop.phone,
        type: 'shop',
      };

      return {
        ...response,
        token: this.jwtService.sign({
          id: shop._id,
          role: 'shop',
          rememberCredentials,
        }),
      };
    } else {
      const employee = await this.employeeModel.findOne({
        dni: signInDto.username,
      });
      if (!employee)
        throw new UnauthorizedException('Invalid username or password');

      const isPasswordMatched = await bcrypt.compare(
        password,
        employee.password,
      );
      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid user or password');

      const response = {
        name: employee.name,
        username: employee.dni,
        phone: employee.phone,
        type: 'employee',
      };

      return {
        ...response,
        token: this.jwtService.sign({
          id: employee._id,
          role: 'employee',
          rememberCredentials,
        }),
      };
    }
  }

  async rememberCredentials(shop) {
    console.log(shop);
    if (!shop.rememberCredentials)
      throw new UnauthorizedException('Invalid token');

    if (shop.role === 'shop') {
      const shopDoc = await this.shopModel.findById(shop._id);
      if (!shopDoc) throw new UnauthorizedException('Invalid token');

      return {
        name: shopDoc.name,
        username: shopDoc.ruc,
        phone: shopDoc.phone,
        type: 'shop',
      };
    } else if (shop.role === 'employee') {
      const employee = await this.employeeModel.findById(shop._id);
      if (!employee) throw new UnauthorizedException('Invalid token');

      return {
        name: employee.name,
        username: employee.dni,
        phone: employee.phone,
        type: 'employee',
      };
    }
  }

  async validate(payload) {
    if (payload.role === 'shop') {
      const shop = await this.shopModel.findById(payload.id);
      if (!shop) throw new UnauthorizedException('Invalid token');

      return {
        ...shop.toObject(),
        role: 'shop',
        rememberCredentials: payload.rememberCredentials,
      };
    } else if (payload.role === 'employee') {
      const employee = await this.employeeModel.findById(payload.id);
      if (!employee) throw new UnauthorizedException('Invalid token');

      const shop = await this.shopModel.findById(employee.shop);
      if (!shop) throw new UnauthorizedException('Invalid token');

      return {
        ...shop.toObject(),
        role: 'employee',
        permissions: employee.permissions,
        rememberCredentials: payload.rememberCredentials,
      };
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async changePassword(shop, oldPassword: string, newPassword: string) {
    if (shop.role === 'employee') {
      const employee = await this.employeeModel.findById(shop._id);
      if (!employee) throw new UnauthorizedException('Invalid token');
      const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        employee.password,
      );
      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid password');
      employee.password = await bcrypt.hash(newPassword, 10);
      await employee.save();
      return { msg: 'Password changed successfully' };
    } else {
      const shopDoc = await this.shopModel.findById(shop._id);
      if (!shopDoc) throw new UnauthorizedException('Invalid token');
      const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        shopDoc.password,
      );
      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid password');
      shopDoc.password = await bcrypt.hash(newPassword, 10);
      await shopDoc.save();
      return { msg: 'Password changed successfully' };
    }
  }

  async updateProfile(shop: Shop, updateProfileDto: UpdateProfileDto) {
    return this.shopModel.findByIdAndUpdate(shop._id, updateProfileDto, { new: true });
  }
}
