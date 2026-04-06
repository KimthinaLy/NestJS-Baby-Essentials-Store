import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  Redirect,
  Query,
  Request,
  Res,
  UseGuards,
  Next,
} from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('pages/auth/register')
  showRegister() {
    return { title: 'Create Account' };
  }

  @Post('register')
  @Redirect('/auth/login?success=account_created')
  async register(@Body() dto: CreateUserDto) {
    await this.authService.registerCustomer(dto);
  }

  @Get('login')
  @Render('pages/auth/login')
  showLogin(@Query('success') success: string, @Query('error') error: string) {
    let errorMessage;
    if (error === 'invalid_credentials')
      errorMessage = 'Invalid email or password.';
    if (error === 'session_expired')
      errorMessage = 'Please log in to access this page.';
    if (error === 'unauthorized')
      errorMessage = 'You do not have permission to access this page.';
    return { title: 'Login', success, error:errorMessage };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: express.Response) {
    const user = req.user; // This is set by Passport's LocalStrategy

    if (user.role === 'CUSTOMER') {
      return res.redirect('/products');
    } else {
      return res.redirect('/products/crud');
    }
  }

  @Post('logout')
  async logout(@Request() req, @Res() res, @Next() next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  }
}
