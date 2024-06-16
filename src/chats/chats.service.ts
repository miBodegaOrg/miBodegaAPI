import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Shop } from 'src/schemas/Shop.schema';
import { MessageChatDto } from './dto/MessageChat.dto';
import { Chat } from 'src/schemas/Chat.schema';
import { validateObjectId } from 'src/utils/validateObjectId';
import { Product } from 'src/schemas/Product.schema';
import { Sale } from 'src/schemas/Sales.schema';
import * as fs from 'fs';

@Injectable()
export class ChatsService {
    private openai: OpenAI;

    constructor(
        private configService: ConfigService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Sale.name) private saleModel: Model<Sale>
    ) {
        this.openai = new OpenAI({
            organization: "org-5W2Aph8TnYoX2SHq3qhTp130",
            project: this.configService.get<string>('OPENAI_PROJECT_ID'),
        });
    }
    
    
    async createChat(messageChatDto: MessageChatDto, shop: Shop) {

        const productsQuery = await this.productModel.find({ shop: shop._id }).populate('category', 'name');

        const products = productsQuery.map(product => ({
            name: product.name,
            price: product.price,
            category: product.category.name,
            stock: product.stock,
            sales: product.sales
        }));

        const salesQuery = await this.saleModel.find({ shop: shop._id, createdAt: { $gt: new Date().setMonth(new Date().getMonth() - 1)}, status: 'paid'})

        const sales = salesQuery.map(sale => ({
            products: sale.products,
            total: sale.total,
            subtotal: sale.subtotal,
            discount: sale.discount,
            igv: sale.igv,
            createdAt: sale.createdAt
        }));

        const jsonProducts = JSON.stringify(products, null, 2);
        fs.writeFileSync('products.json', jsonProducts)

        const jsonSales = JSON.stringify(sales, null, 2);
        fs.writeFileSync('sales.json', jsonSales)

        const fileStreams = ["products.json", "sales.json"].map((path) =>
            fs.createReadStream(path),
        )
           
        let vectorStore = await this.openai.beta.vectorStores.create({
            name: "Shop data - " + new Date().toISOString(),
        });
        await this.openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams })
    
        const assistant = await this.openai.beta.assistants.create({
            name: "Asesor comercial",
            instructions: "Eres un experto comercial en tiendas pequeñas y medianas. Usa tu base de conocimientos para responder preguntas sobre recomendaciones o estrategias para mejorar las ventas.",
            model: "gpt-4o",
            tools: [{ type: "file_search" }],
            tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
        });

        
        const thread = await this.openai.beta.threads.create({
            messages: [
              {
                role: "user",
                content: messageChatDto.message,
              },
            ],
          });

          const run = await this.openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant.id,
          });
           
          const messages = await this.openai.beta.threads.messages.list(thread.id, {
            run_id: run.id,
          });

        const chat = new this.chatModel({
            shop: shop._id,
            messages: [
                { role: "user", text: messageChatDto.message },
                // @ts-ignore
                { role: "assistant", text: messages.data[0].content[0].text.value }
            ],
            thread: thread.id,
            assistant: assistant.id
        });

        const createdChat = await chat.save();
        
        return {
            "_id": createdChat._id,
            // @ts-ignore
            "response": messages.data[0].content[0].text.value
        };
    }

    async responseChat(id: string, messageChatDto: MessageChatDto, shop: Shop) {
        validateObjectId(id, 'chat');

        const chat = await this.chatModel.findOne({ _id: id, shop: shop._id });
        if (!chat) throw new HttpException('Chat not found', 404);

        await this.openai.beta.threads.messages.create(
            chat.thread, {
                role: "user",
                content: messageChatDto.message,
            },
        );

        const run = await this.openai.beta.threads.runs.createAndPoll(chat.thread, {
            assistant_id: chat.assistant,
        });

        const messages = await this.openai.beta.threads.messages.list(chat.thread, {
            run_id: run.id,
        });

        await this.chatModel.updateOne(
            { _id: id },
            {
              $push: {
                messages: {
                  $each: [
                    {
                      role: "user",
                      text: messageChatDto.message
                    },
                    {
                      role: "assistant",
                      // @ts-ignore
                      text: messages.data[0].content[0].text.value
                    }
                  ]
                }
              }
            }
          );

        return {
            "_id": id,
            // @ts-ignore
            "response": messages.data[0].content[0].text.value
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
