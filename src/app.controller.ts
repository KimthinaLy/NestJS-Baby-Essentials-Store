import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // This maps to http://localhost:3000/
  @Render('pages/index') // Points to views/pages/index.ejs
  async getHome(@Req() req) {    
    return { 
      title: 'Welcome to Baby Essentials',
      user: req.user, // Pass the logged-in user (if any) to the template
    };
  }
}
