import { Controller, Delete, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from "./settings.service";

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Delete('delete-all')
  @UseGuards(AuthGuard())
  deleteSettings(@Req() req) {
    return this.settingsService.deleteAllData(req.user);
  }
}
