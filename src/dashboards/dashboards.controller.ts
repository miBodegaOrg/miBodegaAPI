import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionsGuard,
  Permissions,
} from 'src/auth/guards/permission.guard';

@Controller('api/v1/dashboards')
@ApiTags('Dashboards')
export class DashboardsController {
  constructor(private dashboardsService: DashboardsService) {}

  @Get('categories')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('dashboards.leer')
  getDashboardCategories(@Req() req) {
    return this.dashboardsService.getSalesByCategory(req.user);
  }

  @Get('sales')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('dashboards.leer')
  getSalesDashboard(
    @Req() req,
    @Query('period') period: 'day' | 'week' | 'month' | 'year',
  ) {
    return this.dashboardsService.getSalesDashboard(req.user, period);
  }

  @Get('rentability')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('dashboards.leer')
  getRentability(@Req() req) {
    return this.dashboardsService.getRentabilityDashboard(req.user);
  }

  @Get('inventory')
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('dashboards.leer')
  getInventoryDashboard(@Req() req) {
    return this.dashboardsService.getInventoryDashboard(req.user);
  }

  @Get('today/sales')
  @UseGuards(AuthGuard())
  async getTodaySales(@Req() req) {
    const dashboard = await this.dashboardsService.getSalesTodayDashboard(
      req.user,
    );
    return dashboard.length ? dashboard[0] : { sales: 0, total: 0 };
  }
}
