import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
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
}
