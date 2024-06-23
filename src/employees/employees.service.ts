import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Employee } from 'src/schemas/Employee.schema';
import { Shop } from 'src/schemas/Shop.schema';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class EmployeesService {
    constructor(@InjectModel(Employee.name) private employeeModel: Model<Employee>) {}

    async createEmployee(createEmployeeDto: CreateEmployeeDto, shop: Shop) {
        const employee = await this.employeeModel.findOne({ dni: createEmployeeDto.dni, shop: shop._id });
        if (employee) throw new HttpException('Employee with this dni already exists', 400);

        createEmployeeDto.password = await bcrypt.hash(createEmployeeDto.password, 10)
        return this.employeeModel.create({ ...createEmployeeDto, shop: shop._id });
    }

    async getAllEmployees(shop: Shop) {
        return this.employeeModel.find({ shop: shop._id });
    }

    async getEmployeeById(id: string, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid employee ID', 400);

        const employee = await this.employeeModel.findOne({ _id: id, shop: shop._id });
        if (!employee) throw new HttpException('Employee not found', 404);
        return employee
    }
}
