import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';

@Controller('api/v1/employees')
@ApiTags('Employees')
export class EmployeesController {
    constructor(private employeesService: EmployeesService) {}

    @Post()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('employees.create')
    createEmployee(@Req() req, @Body() createEmployeeDto: CreateEmployeeDto){
        return this.employeesService.createEmployee(createEmployeeDto, req.user)
    }

    @Get()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('employees.read')
    getAllEmployees(@Req() req){
        return this.employeesService.getAllEmployees(req.user)
    }

    @Get(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('employees.read')
    getEmployeeById(@Req() req, @Param('id') id: string) {
        return this.employeesService.getEmployeeById(id, req.user)
    }
}
