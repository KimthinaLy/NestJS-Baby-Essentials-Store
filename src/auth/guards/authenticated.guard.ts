import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';


@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    // Passport adds this method to the request object automatically
    if (request.isAuthenticated()) {
      return true;
    }

    // If not authenticated, redirect to login page
    response.redirect('/auth/login?error=session_expired');
    return false;
  }
}