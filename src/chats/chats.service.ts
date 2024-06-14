import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Shop } from 'src/schemas/Shop.schema';
import { MessageChatDto } from './dto/MessageChat.dto';
import { Chat } from 'src/schemas/Chat.schema';
import { validateObjectId } from 'src/utils/validateObjectId';

@Injectable()
export class ChatsService {
    private openai: OpenAI;

    constructor(
        private configService: ConfigService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>
    ) {
        this.openai = new OpenAI({
            organization: "org-5W2Aph8TnYoX2SHq3qhTp130",
            project: this.configService.get<string>('OPENAI_PROJECT_ID'),
        });
    }
    
    
    async createChat(createChatDto: MessageChatDto, shop: Shop) {
        const completion = await this.openai.chat.completions.create({
            messages: [
                { role: "system", content: "Eres un comediante que cuenta chistes" },
                { role: "user", content: createChatDto.message }
            ],
            model: "gpt-3.5-turbo-16k",
          });

          const createdChat = await this.chatModel.create({
                messages: [
                    { role: "system", content: "Eres un comediante que cuenta chistes" },
                    { role: "user", content: createChatDto.message },
                    { role: "assistant", content: completion.choices[0].message.content }
                ],
                shop: shop._id
          });

        return {
            "_id": createdChat._id,
            "response": completion.choices[0].message.content
        };
    }

    async responseChat(id: string, messageChatDto: MessageChatDto, shop: Shop) {
        validateObjectId(id, 'chat');

        const chat = await this.chatModel.findOne({ _id: id, shop: shop._id });
        if (!chat) throw new HttpException('Chat not found', 404);

        const messages = [...chat.messages, { role: "user", content: messageChatDto.message }] as any; ;

        const completion = await this.openai.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo-16k",
          });

        await this.chatModel.findOneAndUpdate({
            _id: id,
            shop: shop._id
        }, {
            $set: {
                messages: [...messages, { role: "assistant", content: completion.choices[0].message.content }]
            }
        });

        return {
            "_id": id,
            "response": completion.choices[0].message.content
        };
    }

    getChatById(id: string, shop: Shop) {
        validateObjectId(id, 'chat');
        return this.chatModel.findOne({ _id: id, shop: shop._id });
    }

    getAllChats(shop: Shop) {
        return this.chatModel.find({ shop: shop._id });
    }
}
