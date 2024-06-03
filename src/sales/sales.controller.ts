import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSaleDto } from './dto/CreateSale.dto';

@ApiTags('Sales')
@ApiBearerAuth()
@Controller('api/v1/sales')
export class SalesController {
    constructor(private salesService: SalesService) {}

    @Post()
    @UseGuards(AuthGuard())
    async createSale(@Req() req, @Body() createSaleDto: CreateSaleDto) {
        return this.salesService.createSale(createSaleDto, req.user);
    }

    @Post('cancel/:id')
    @UseGuards(AuthGuard())
    async cancelSale(@Req() req, @Param('id') id: string) {
        return this.salesService.cancelSale(id, req.user);
    }

    @Post('paid/:id')
    @UseGuards(AuthGuard())
    async paidSale(@Req() req, @Param('id') id: string) {
        return this.salesService.paidSale(id, req.user);
    }

    @Get()
    @UseGuards(AuthGuard())
    async getSales(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('start_date') start_date: Date,
        @Query('end_date') end_date: Date
    ) {
        return this.salesService.getAllSales(req.user, start_date, end_date, page, limit);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getSaleById(@Req() req, @Param('id') id: string) {
        return this.salesService.getSaleById(id, req.user);
    }
}
