import { Controller, Get, ParseIntPipe, Body,Post , Param } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}

  @Get()
  async list(@Param('userId', ParseIntPipe) userId: number) {
    const addresses = await this.addressService.findByUser(userId);  
    return { addresses, userId, title: 'Manage Addresses' };
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const address = await this.addressService.findOne(id);
    return { address, title: 'Address Details' };
  }

// Handle Create Action
  @Post('create')
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createAddressDto: CreateAddressDto,
    ) {
    createAddressDto.userId = userId; // Ensure URL ID matches body ID
    await this.addressService.create(createAddressDto);
  }

  // Handle Delete Action
  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.addressService.remove(id);
  }
}
