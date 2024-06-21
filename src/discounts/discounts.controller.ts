import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';
import { CreateDiscountDto } from './dto/CreateDiscount..dto';
import { UpdateDiscountDto } from './dto/UpdateDiscount.dto';

@Controller('api/v1/discounts')
@ApiTags('Discounts')
export class DiscountsController {
    constructor(private discountsService: DiscountsService) {}

    @Get()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('discounts.read')
    getDiscounts(@Req() req) {
        return this.discountsService.getAllDiscounts(req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('discounts.read')
    getDiscountById(@Req() req, @Param('id') id: string) {
        return this.discountsService.getDiscountById(id, req.user);
    }

    @Post()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('discounts.create')
    createDiscount(@Req() req, @Body() createDiscountDto: CreateDiscountDto) {
        return this.discountsService.createDiscount(createDiscountDto, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('discounts.update')
    updateDiscount(@Req() req, @Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
        return this.discountsService.updateDiscount(id, updateDiscountDto, req.user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('discounts.delete')
    deleteDiscount(@Req() req, @Param('id') id: string) {
        return this.discountsService.deleteDiscount(id, req.user);
    }
}
