import { Controller, Get, Query } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/dashboards')
@ApiTags('Dashboards')
export class DashboardsController {
    constructor(private dashboardsService: DashboardsService) {}

    @Get('categories')
    getDashboardCategories() {
       return this.dashboardsService.getSalesByCategory();
    }

    @Get('sales')
    getSalesDashboard(@Query('period') period: 'day' | 'week' | 'month' | 'year') {
       return this.dashboardsService.getSalesDashboard(period);
    }
}
