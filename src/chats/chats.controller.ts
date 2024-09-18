import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from '@nestjs/passport';
import { MessageChatDto } from './dto/MessageChat.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  PermissionsGuard,
  Permissions,
} from 'src/auth/guards/permission.guard';

@Controller('api/v1/chats')
@ApiTags('Chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Permissions('chats.crear')
  createChat(@Body() createChatDto: MessageChatDto, @Req() req) {
    return this.chatsService.createChat(createChatDto, req.user);
  }

  @Post('recommendation')
  @UseGuards(AuthGuard())
  createRecommendation(@Req() req) {
    return this.chatsService.createRecommendation(req.user);
  }
}
