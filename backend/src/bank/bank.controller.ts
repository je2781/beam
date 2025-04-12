import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { BankService } from './bank.service';
import { UpdateBankDto } from './dto/update-bank.dto';
import { GetUser } from '../auth/decorator';
import { JwtGaurd } from '../auth/guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Bank } from './bank.entity';

@ApiTags('bank') 
@UseGuards(JwtGaurd)
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}


  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'getting current user bank details' })
  @ApiResponse({ status: 200, description: 'Bank profile retrieved', type: Bank})
  findOne(@GetUser('id') userId: string) {
    return this.bankService.findOne(userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
  //   return this.bankService.update(+id, updateBankDto);
  // }

}
