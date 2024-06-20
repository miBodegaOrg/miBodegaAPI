import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSupplierDto } from './dto/CreateSupplier.dto';
import { UpdateSupplierDto } from './dto/UpdateSupplier.dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';

@Controller('api/v1/suppliers')
@ApiTags('Suppliers')
export class SuppliersController {
    constructor(private suppliersService: SuppliersService) {}

    @Get()
    @UseGuards(AuthGuard())
    getAllSuppliers(@Req() req) {
        return this.suppliersService.getAllSuppliers(req.user);
    }

    @Get(':ruc')
    @UseGuards(AuthGuard())
    getSupplierByRuc(@Param('ruc') ruc: string, @Req() req) {
        return this.suppliersService.getSupplierByRuc(ruc, req.user);
    }

    @Post()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('suppliers.create')
    createSupplier(@Req() req, @Body() createSupplierDto: CreateSupplierDto) {
        return this.suppliersService.create(createSupplierDto, req.user);
    }

    @Put(':ruc')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('suppliers.update')
    updateSupplier(@Param('ruc') ruc: string, @Req() req, @Body() updateSupplierDto: UpdateSupplierDto) {
        return this.suppliersService.update(ruc, req.user, updateSupplierDto);
    }

    @Delete(':ruc')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('suppliers.delete')
    removeSupplier(@Param('ruc') ruc: string, @Req() req) {
        return this.suppliersService.remove(ruc, req.user);
    }
}
