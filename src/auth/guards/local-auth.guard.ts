import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    // 1. Check the credentials (email/password)
    const result = (await super.canActivate(context)) as boolean;

  
    
    // 2. Initialize the session (Passport handles this)
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    
    return result;
  }

  // what happens when validation fails
  handleRequest(err, user, info, context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();

    // If there is an error or no user was found by the Strategy
    if (err || !user) {
      // Redirect back to the login page with a query parameter
      return response.redirect('/auth/login?error=invalid_credentials');
    }

    return user;
  }
}