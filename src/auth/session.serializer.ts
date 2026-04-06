import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  // What to store in the session (just the ID and Role for speed)
  serializeUser(user: any, done: Function): void {
    done(null, { id: user.id, role: user.role });
  }

  // How to recover the user from the session
  deserializeUser(payload: any, done: Function): void {
    done(null, payload);
  }
}