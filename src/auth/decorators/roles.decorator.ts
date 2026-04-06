import { SetMetadata } from '@nestjs/common';

// This allows to use @Roles('ADMIN', 'STAFF') on your controllers
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);