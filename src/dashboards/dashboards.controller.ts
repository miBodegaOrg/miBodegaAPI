import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';

@Controller('api/v1/dashboards')
@ApiTags('Dashboards')
export class DashboardsController {
    constructor(private dashboardsService: DashboardsService) {}

    @Get('categories')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('dashboards.read')
    getDashboardCategories(@Req() req) {
       return this.dashboardsService.getSalesByCategory(req.user);
    }

    @Get('sales')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('dashboards.read')
    getSalesDashboard(@Req() req, @Query('period') period: 'day' | 'week' | 'month' | 'year') {
       return this.dashboardsService.getSalesDashboard(req.user, period);
    }
}
