import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) {}

  // Find all addresses for a specific user
  async findByUser(userId: number): Promise<Address[]> {
    return await this.addressRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async findDefaultByUserId(userId: number): Promise<Address | null> {
  const addresses = await this.findByUser(userId);
  
  // If the array has at least one address, return the first one
  if (addresses && addresses.length > 0) {
    return addresses[0]; 
  }
  
  // If they haven't added any address yet, return null
  return null;
}

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepo.findOneBy({ id });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async create(dto: CreateAddressDto): Promise<Address> {
    const newAddress = this.addressRepo.create(dto);
    return await this.addressRepo.save(newAddress);
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);
    Object.assign(address, dto);
    return await this.addressRepo.save(address);
  }

  async remove(id: number): Promise<void> {
    const result = await this.addressRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }
}