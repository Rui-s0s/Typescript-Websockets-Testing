import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Use NestExpressApplication to access Express-specific methods
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set the folder for your static assets (CSS, JS, Images)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Set the folder for your EJS files
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  
  // Set EJS as the view engine
  app.setViewEngine('ejs');

  await app.listen(4000);
}
bootstrap();