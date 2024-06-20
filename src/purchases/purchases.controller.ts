import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePurchaseDto } from './dto/CreatePurchase.dto';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';

@Controller('api/v1/purchases')
@ApiTags('Purchases')
export class PurchasesController {
    constructor(private purchasesService: PurchasesService) {}

    @Get()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('purchases.read')
    getAllPurchases(@Req() req) {
        return this.purchasesService.getAllPurchases(req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('purchases.read')
    getPurchaseById(@Req() req, @Param('id') id: string) {
        return this.purchasesService.getPurchaseById(id, req.user);
    }

    @Post()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('purchases.create')
    createPurchase(@Req() req, @Body() createPurchaseDto: CreatePurchaseDto) {
        return this.purchasesService.createPurchase(createPurchaseDto, req.user);
    }

    @Post('received/:id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('purchases.create')
    receivedPurchase(@Req() req, @Param('id') id: string) {
        return this.purchasesService.receivedPurchase(id, req.user);
    }

    
}
