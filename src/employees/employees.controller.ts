import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import {
  PermissionsGuard,
  Permissions,
} from 'src/auth/guards/permission.guard';
import { UpdateEmployeeDto } from './dto/UpdateEmployee.dto';

@Controller('api/v1/employees')
@ApiTags('Employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('empleados.crear')
  createEmployee(@Req() req, @Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(createEmployeeDto, req.user);
  }

  @Get('permissions')
  getPermissions() {
    return this.employeesService.getPermissions();
  }

  @Get()
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('empleados.leer')
  getAllEmployees(@Req() req) {
    return this.employeesService.getAllEmployees(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('empleados.leer')
  getEmployeeById(@Req() req, @Param('id') id: string) {
    return this.employeesService.getEmployeeById(id, req.user);
  }

  @Put(':id')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('empleados.actualizar')
  updateEmployee(
    @Req() req,
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(
      id,
      updateEmployeeDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('empleados.eliminar')
  deleteEmployee(@Req() req, @Param('id') id: string) {
    return this.employeesService.deleteEmployee(id, req.user);
  }
}
