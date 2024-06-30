import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreatePromotionDto } from './dto/CreatePromotion.dto';
import { UpdatePromotionDto } from './dto/UpdatePromotion.dto';

@Controller('api/v1/promotions')
@ApiTags('Promotions')
export class PromotionsController {
    constructor(private promotionsService: PromotionsService) {}

    @Get()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('promociones.leer')
    getPromotions(@Req() req) {
        return this.promotionsService.getPromotions(req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('promociones.leer')
    getPromotionById(id: string, @Req() req) {
        return this.promotionsService.getPromotion(id, req.user);
    }

    @Post()
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('promociones.crear')
    createPromotion(@Req() req, @Body() createPromotionDto: CreatePromotionDto) {
        return this.promotionsService.createPromotion(createPromotionDto, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('promociones.actualizar')
    updatePromotion(id: string, @Req() req, @Body() updatePromotionDto: UpdatePromotionDto) {
        return this.promotionsService.updatePromotion(id, updatePromotionDto, req.user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('promociones.eliminar')
    deletePromotion(id: string, @Req() req) {
        return this.promotionsService.removePromotion(id, req.user);
    }
}
