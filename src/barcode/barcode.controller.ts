import { Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';

@ApiTags('Barcode')
@ApiBearerAuth()
@Controller('api/v1/barcode')
export class BarcodeController {
    constructor(private barcodeService: BarcodeService) {}

    @Post('create/:code')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('products.create')
    async createBarcode(@Res() res, @Req() req, @Param('code') code: string) {
        const barcodeImage = await this.barcodeService.createBarcode(code, req.user);
        res.setHeader('Content-Type', 'image/png');
        res.send(barcodeImage);
    }
}
