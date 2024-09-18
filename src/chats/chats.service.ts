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
import { Promotion } from 'src/schemas/Promotion.schema';
import { Discount } from 'src/schemas/Discount.schema';
import { Purchase } from 'src/schemas/Purchase.schema';
import { Supplier } from 'src/schemas/Supplier.schema';
import { start } from 'repl';

@Injectable()
export class ChatsService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {
    this.openai = new OpenAI({
      organization: 'org-5W2Aph8TnYoX2SHq3qhTp130',
      project: this.configService.get<string>('OPENAI_PROJECT_ID'),
    });
  }

  async createChat(messageChatDto: MessageChatDto, shop: Shop) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    let assistant = await this.chatModel.findOne({
      shop: shop._id,
      createdAt: { $gte: startOfDay },
    });

    if (!assistant) assistant = await this.createAssistant(shop);

    await this.openai.beta.threads.messages.create(assistant.thread, {
      role: 'user',
      content: messageChatDto.message,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(
      assistant.thread,
      {
        assistant_id: assistant.assistant,
      },
    );

    const messages = await this.openai.beta.threads.messages.list(
      assistant.thread,
      {
        run_id: run.id,
      },
    );

    // @ts-ignore
    const response = messages.data[0].content[0].text.value;
    const cleanResponse = response.replace(/\s*【[^】]*】\s*/g, ' ').trim();

    return {
      response: cleanResponse,
    };
  }

  async createAssistant(shop: Shop) {
    const productsQuery = await this.productModel
      .find({ shop: shop._id })
      .populate('category', 'name');
    const salesQuery = await this.saleModel.find({
      shop: shop._id,
      status: 'paid',
    });
    const promotionsQuery = await this.promotionModel
      .find({ shop: shop._id })
      .populate('products', 'name');
    const discountsQuery = await this.discountModel
      .find({ shop: shop._id })
      .populate('products', 'name');

    const purchasesQuery = await this.purchaseModel.aggregate([
      {
        $match: {
          shop: shop._id,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.code',
          foreignField: 'code',
          as: 'productDetails',
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                $mergeObjects: [
                  '$$product',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productDetails',
                          as: 'productDetail',
                          cond: {
                            $eq: ['$$productDetail.code', '$$product.code'],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplier',
        },
      },
      {
        $project: {
          productDetails: 0,
        },
      },
    ]);

    const suppliersQuery = await this.supplierModel
      .find({ shop: shop._id })
      .populate('products._id', 'name');

    const files = [];

    if (productsQuery.length > 0) {
      const products = productsQuery.map((product) => ({
        name: product.name,
        price: product.price,
        category: product.category.name,
        stock: product.stock,
        sales: product.sales,
      }));

      const jsonProducts = JSON.stringify(products, null, 2);
      fs.writeFileSync('products.json', jsonProducts);

      files.push('products.json');
    }

    if (salesQuery.length > 0) {
      const sales = salesQuery.map((sale) => ({
        products: sale.products,
        total: sale.total,
        subtotal: sale.subtotal,
        discount: sale.discount,
        igv: sale.igv,
        createdAt: sale.createdAt,
      }));

      files.push('sales.json');

      const jsonSales = JSON.stringify(sales, null, 2);
      fs.writeFileSync('sales.json', jsonSales);
    }

    if (discountsQuery.length > 0) {
      files.push('discounts.json');

      const discounts = discountsQuery.map((discount) => ({
        name: discount.name,
        percentage: discount.percentage,
        active: discount.active,
        startDate: discount.startDate,
        endDate: discount.endDate,
        products: discount.products.map((product) => product.name),
      }));

      const jsonDiscounts = JSON.stringify(discounts, null, 2);
      fs.writeFileSync('discounts.json', jsonDiscounts);
    }

    if (promotionsQuery.length > 0) {
      files.push('promotions.json');

      const promotions = promotionsQuery.map((promotion) => ({
        name: promotion.name,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        active: promotion.active,
        buy: promotion.buy,
        pay: promotion.pay,
        products: promotion.products.map((product) => product.name),
      }));

      const jsonPromotions = JSON.stringify(promotions, null, 2);
      fs.writeFileSync('promotions.json', jsonPromotions);
    }

    if (purchasesQuery.length > 0) {
      files.push('purchases.json');

      const purchases = purchasesQuery.map((purchase) => ({
        products: purchase.products.map((product) => ({
          name: product.name,
          quantity: product.quantity,
        })),
        total: purchase.total,
        subtotal: purchase.subtotal,
        discount: purchase.discount,
        status: purchase.status,
        createdAt: purchase.createdAt,
        supplier: purchase.supplier.name,
      }));

      const jsonPurchases = JSON.stringify(purchases, null, 2);
      fs.writeFileSync('purchases.json', jsonPurchases);
    }

    if (suppliersQuery.length > 0) {
      files.push('suppliers.json');

      const suppliers = suppliersQuery.map((supplier) => ({
        name: supplier.name,
        ruc: supplier.ruc,
        phone: supplier.phone,
        // @ts-ignore
        products: supplier.products.map((product) => product.name),
      }));

      const jsonSuppliers = JSON.stringify(suppliers, null, 2);
      fs.writeFileSync('suppliers.json', jsonSuppliers);
    }

    const fileStreams = files.map((path) => fs.createReadStream(path));

    const vectorStore = await this.openai.beta.vectorStores.create({
      name: 'Shop data - ' + new Date().toISOString(),
    });
    await this.openai.beta.vectorStores.fileBatches.uploadAndPoll(
      vectorStore.id,
      { files: fileStreams },
    );

    const assistant = await this.openai.beta.assistants.create({
      name: 'Asesor comercial',
      instructions:
        "Eres un experto comercial en tiendas pequeñas y medianas. Usa tu base de conocimientos para responder preguntas sobre recomendaciones o estrategias para mejorar las ventas. Utiliza los archivos proporcionados que contienen información sobre productos, ventas, descuentos, promociones, compras y proveedores de las bodegas. Todas las respuestas deben estar relacionadas con la información proporcionada. Por ejemplo, si te preguntan que descuentos o promociones crear, debes responser basado en el archivo de productos y proporciorles que productos específicamente debe crear el descuento o promoción. Sé lo más específico posible en tus respuestas y proporciona ejemplos concretos para ayudar a los dueños de las tiendas a tomar decisiones informadas posible y no des respuestas tan generales como 'crear un descuento para mejorar las ventas' o 'establece que produtos quieres hacer la promoción'. Si no puedes responder la pregunta, puedes decir 'No sé' o 'No tengo información suficiente para responder esa pregunta'. Siempre da ejemplos con la información proporcionada en los archivos. No digas 'Basándome en la información proporcionada', el cliente ya asume que la información se encuentra cargada. No indiques la fuente o referencia a los archivos como [16:0+source], ya que el cliente no cuenta con ellos. Usa la moneda en soles (S/).",
      model: 'gpt-4o',
      tools: [{ type: 'file_search' }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    const thread = await this.openai.beta.threads.create();

    const chat = {
      shop: shop._id,
      assistant: assistant.id,
      thread: thread.id,
      date: new Date(),
    };

    return this.chatModel.create(chat);
  }

  async createRecommendation(shop: Shop) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    let assistant = await this.chatModel.findOne({
      shop: shop._id,
      createdAt: { $gte: startOfDay },
    });

    if (!assistant) assistant = await this.createAssistant(shop);

    const thread = await this.openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content:
            'Dame una sola recomendación según los datos para mejorar el rendimiento de mi tienda en 20 palabras o menos y explica en 15 palabras más el por qué de esa recomendación.',
        },
      ],
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.assistant,
    });

    const messages = await this.openai.beta.threads.messages.list(thread.id, {
      run_id: run.id,
    });

    // @ts-ignore
    const response = messages.data[0].content[0].text.value;
    const cleanResponse = response.replace(/\s*【[^】]*】\s*/g, ' ').trim();

    return {
      response: cleanResponse,
    };
  }
}
