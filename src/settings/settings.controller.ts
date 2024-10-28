import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('api/v1/settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Delete('delete-all')
  @UseGuards(AuthGuard())
  deleteSettings(@Req() req) {
    return this.settingsService.deleteAllData(req.user);
  }
}
