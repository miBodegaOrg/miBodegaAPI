import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { Employee } from 'src/schemas/Employee.schema';
import { Shop } from 'src/schemas/Shop.schema';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import * as bcrypt from 'bcryptjs'
import { UpdateEmployeeDto } from './dto/UpdateEmployee.dto';
import { validateObjectId } from 'src/utils/validateObjectId';

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

    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto, shop: Shop) {
        validateObjectId(id, 'employee');
        if (updateEmployeeDto.dni) {
            const employee = await this.employeeModel.findOne({ dni: updateEmployeeDto.dni, shop: shop._id });
            if (employee) throw new HttpException('Employee with this dni already exists', 400);
        }

        if (updateEmployeeDto.password) {
            updateEmployeeDto.password = await bcrypt.hash(updateEmployeeDto.password, 10)
        }

        const employee = await this.employeeModel.findOneAndUpdate({ _id: id, shop: shop._id }, updateEmployeeDto, { new: true });
        if (!employee) throw new HttpException('Employee not found', 404);

        return employee;
    }

    async deleteEmployee(id: string, shop: Shop) {
        validateObjectId(id, 'employee');
        const employee = await this.employeeModel.findOneAndDelete({ _id: id, shop: shop._id });
        if (!employee) throw new HttpException('Employee not found', 404);
        return employee;
    }

    getPermissions() {
        return { 
            permissions: [
                "chats.create",
                "chats.read",
                "dashboards.read",
                "discounts.create",
                "discounts.read",
                "discounts.update",
                "discounts.delete",
                "employees.create",
                "employees.read",
                "employees.update",
                "employees.delete",
                "products.create",
                "products.update",
                "products.delete",
                "promotions.create",
                "promotions.read",
                "promotions.update",
                "promotions.delete",
                "purchases.create",
                "purchases.read",
                "sales.create",
                "sales.read",
                "suppliers.create",
                "suppliers.update",
                "suppliers.delete",
            ]
        }
    }
}
