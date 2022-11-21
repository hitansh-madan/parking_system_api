import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import Car from 'src/types/car.types';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private parkingService: ParkingService) {}

  @Post()
  initialize(@Body('numberOfSlots') numberOfSlots: number) {
    if (typeof numberOfSlots !== 'number') throw new BadRequestException();

    this.parkingService.initialize(numberOfSlots);
    return { totalSlots: numberOfSlots };
  }

  @Patch()
  addSlots(@Body('numberOfSlots') numberOfSlots: number) {
    if (typeof numberOfSlots !== 'number') throw new BadRequestException();

    this.parkingService.addSlots(numberOfSlots);
    return { totalSlots: this.parkingService.numberOfSlots };
  }

  @Post('park')
  allocateSlot(@Body() car: Car) {
    if (
      !car ||
      typeof car.regNumber !== 'string' ||
      typeof car.color !== 'string'
    )
      throw new BadRequestException();
    try {
      return this.parkingService.allocateSlot(car);
    } catch (e) {
      return { error: e.message };
    }
  }

  @Get('registration-numbers')
  getRegNumbersByColor(@Query('color') color: string): Array<string> {
    if (typeof color !== 'string') throw new BadRequestException();
    return this.parkingService.getRegNumbersByColor(color);
  }

  @Get('slot-numbers')
  getSlots(
    @Query('color') color: string,
    @Query('regNumber') regNumber: string,
  ) {
    if (typeof color !== 'string' && typeof regNumber !== 'string')
      throw new BadRequestException();
    try {
      if (color) return this.parkingService.getSlotsByColor(color);
      else return this.parkingService.getSlotByRegNumber(regNumber);
    } catch (e) {
      return { error: e.message };
    }
  }

  @Post('clear')
  freeSlot(@Body() body) {
    if (
      typeof body.slotNumber !== 'number' &&
      typeof body.regNumber !== 'string'
    )
      throw new BadRequestException();
    try {
      return {
        freedSlot: this.parkingService.freeSlot(
          body.slotNumber || body.regNumber,
        ),
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  @Get('status')
  getOccupiedSlots(): Array<Car> {
    return this.parkingService.getOccupiedSlots();
  }
}
