import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from '@nestjs/passport';
import { MessageChatDto } from './dto/MessageChat.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/chats')
@ApiTags('Chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}

    @Post()
    @UseGuards(AuthGuard())
    createChat(@Body() createChatDto: MessageChatDto, @Req() req) {
        return this.chatsService.createChat(createChatDto, req.user);
    }

    @Post('response/:id')
    @UseGuards(AuthGuard())
    responseChat(@Param('id') id: string, @Body() messageChatDto: MessageChatDto, @Req() req) {
        return this.chatsService.responseChat(id, messageChatDto, req.user);
    }

    @Get()
    @UseGuards(AuthGuard())
    getAllChats(@Req() req) {
        return this.chatsService.getAllChats(req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    getChatById(@Param('id') id: string, @Req() req) {
        return this.chatsService.getChatById(id, req.user);
    }
}