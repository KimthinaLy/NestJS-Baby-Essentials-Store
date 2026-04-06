import { 
  Controller, Get, Post, Body, Param, 
  Render, Redirect, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './user.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
@Roles('ADMIN', 'EMPLOYEE', 'MANAGER') // Only these roles can enter
@Controller('staff/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('pages/staff/users/list')
  async listAll() {
    const users = await this.userService.findAll();
    return { 
      users, 
      title: 'User Management' 
    };
  }

  @Get('create')
  @Render('pages/staff/users/create')
  async showCreate() {
    return { 
      roles: Object.values(UserRole), 
      title: 'Add User' 
    };
  }

  @Post('create')
  @Redirect('/staff/users')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.createWithAddress(createUserDto);
  }

  @Get(':id/edit')
  @Render('pages/staff/users/edit')
  async showEdit(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneWithAddresses(id);
    return { 
      user, 
      roles: Object.values(UserRole), 
      title: `Edit User: ${user.fullName}` 
    };
  }

  @Post(':id/edit')
  @Redirect('/staff/users')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.userService.update(id, updateUserDto);
  }

  @Post(':id/delete')
  @Redirect('/staff/users')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
  }
}