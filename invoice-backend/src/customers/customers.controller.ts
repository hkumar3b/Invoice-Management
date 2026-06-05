import { Controller, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get('top-five')
  getTopFive() {
    return this.customersService.getTopFive();
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.customersService.getProfile(id);
  }
}