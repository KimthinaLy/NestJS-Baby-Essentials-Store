import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from 'src/address/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      order: { id: 'DESC' },// Show newest users first
      relations: ['addresses'], 
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneWithAddresses(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['addresses'], // Load related addresses when fetching a user
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createWithAddress(dto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the User
      const user = queryRunner.manager.create(User, {
        fullName: dto.fullName,
        email: dto.email,
        password: dto.password, // Remember to hash this later!
        phone: dto.phone,
        role: dto.role,
      });
      const savedUser = await queryRunner.manager.save(user);

      // 2. Create the Address linked to the new User ID
      const address = queryRunner.manager.create(Address, {
        ...dto.address,
        userId: savedUser.id, // Link it here
      });
      await queryRunner.manager.save(address);

      // 3. Commit the whole thing
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      // If ANYTHING fails, undo everything
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the user with their address
      const user = await queryRunner.manager.findOne(User, {
        where: { id },
        relations: ['addresses'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updateData: any = {
        fullName: dto.fullName,
        email: dto.email,
        role: dto.role,
        phone: dto.phone,
      };

      if (dto.password && dto.password.trim() !== '') {
        // updateData.password = await bcrypt.hash(dto.password, 10);
        updateData.password = dto.password;
      }
      Object.assign(user, updateData);
      await queryRunner.manager.save(user);

      // 3. Update the Address
      if (dto.address && user.addresses && user.addresses.length > 0) {
        const address = user.addresses[0]; // Get the existing one
        Object.assign(address, dto.address); // Merge new data from form
        await queryRunner.manager.save(address);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Used for future Authentication
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }
}
