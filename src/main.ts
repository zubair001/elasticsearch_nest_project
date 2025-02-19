import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Allow only your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
