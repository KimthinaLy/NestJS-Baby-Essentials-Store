import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import session from 'express-session';
import passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- Global Validation ---
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strips away properties that don't have decorators in the DTO
    forbidNonWhitelisted: false,    //This is what's causing the "should not exist" error
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // This automatically converts strings to numbers/booleans
    },               // Automatically transforms payloads to be objects typed according to their DTO classes
  }));

  // This allows Nest to serve the CSS file in the public folder
  app.useStaticAssets(join(__dirname, '..', 'public'));
  //to configure ejs
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // MUST have extended: true to support address[phone] syntax
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: 'baby-essentials-secret-key', // Use a strong random string in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1800000, // 30 minutes in milliseconds
        secure: false,   // Set to true if using HTTPS
      },
    }),
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
