import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import Car from 'src/types/car.types';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private parkingService: ParkingService) {}

  @Post()
  initialize(@Body('numberOfSlots') numberOfSlots: number) {
    this.parkingService.initialize(numberOfSlots);
    return { totalSlots: numberOfSlots };
  }

  @Patch()
  addSlots(@Body('numberOfSlots') numberOfSlots: number) {
    this.parkingService.addSlots(numberOfSlots);
    return { totalSlots: this.parkingService.numberOfSlots };
  }

  @Post('park')
  allocateSlot(@Body() car: Car) {
    return this.parkingService.allocateSlot(car);
  }

  @Get('registration-numbers')
  getRegNumbersByColor(@Query('color') color: string): Array<string> {
    return this.parkingService.getRegNumbersByColor(color);
  }

  @Get('slot-numbers')
  getSlotsByColor(
    @Query('color') color: string,
    @Query('regNumber') regNumber: string,
  ) {
    if (color) return this.parkingService.getSlotsByColor(color);
    else return this.parkingService.getSlotByRegNumber(regNumber);
  }

  @Post('clear')
  freeSlot(@Body() body): any {
    return {
      freedSlot: this.parkingService.freeSlot(
        body.slotNumber || body.regNumber,
      ),
    };
  }

  @Get('status')
  getOccupiedSlots(): Array<Car> {
    return this.parkingService.getOccupiedSlots();
  }
}
