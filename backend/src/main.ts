import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Use cookie-parser middleware to parse cookies
  app.use(cookieParser());

  app.enableCors({
    origin: "http://localhost:3000", // allows all origins
    credentials: true, // allows cookies/authorization headers
    methods: "*", // allows all HTTP methods (GET, POST, etc.)
  });

  const config = new DocumentBuilder()
    .setTitle("beam documentation")
    .setDescription("beam rest api doc for wallet transactions")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
