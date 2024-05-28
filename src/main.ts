import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('miBodega API')
    .setDescription('endpoints for miBodega application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
