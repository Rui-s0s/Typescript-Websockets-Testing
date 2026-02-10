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

  await app.listen(4000, '0.0.0.0'); // This for not localhost 
}
bootstrap();

/*
  Modify Windows Defender Firewall to allow incoming connections on port 4000:

  1. Open Windows Defender Firewall with Advanced Security.
  2. Click on "Inbound Rules" in the left pane.
  3. Click "New Rule..." in the right pane.
  4. Select "Port" and click "Next".
  5. Select "TCP" and specify "4000" in the "Specific local ports" field, then click "Next".
  6. Choose "Allow the connection" and click "Next".
  7. Select the network profiles (Domain, Private, Public) where you want to allow the connection, then click "Next".
  8. Give the rule a name (e.g., "NestJS Chat Server") and click "Finish".

*/