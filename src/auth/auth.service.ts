import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserRole } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
import { Address } from 'src/address/address.entity';

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource) {}

  async registerCustomer(dto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // FORCE the role to CUSTOMER regardless of what was in the DTO
      const user = queryRunner.manager.create(User, {
        ...dto,
        role: UserRole.CUSTOMER, // Hardcoded security
        password: dto.password  //plain text for now, will be hashed in the entity listener
      });

      const savedUser = await queryRunner.manager.save(user);

      // Create their initial empty address if provided
      if (dto.address) {
        const address = queryRunner.manager.create(Address, {
          ...dto.address,
          user: savedUser
        });
        await queryRunner.manager.save(address);
      }

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.dataSource.manager.findOne(User, { where: { email } });
    if (user && user.password === pass) { // In production, use hashed passwords and a proper comparison method
      return user;
    }
    return null;
  }
}
