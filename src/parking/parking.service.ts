import { Injectable } from '@nestjs/common';
import Car from '../types/car.types';
import { MinHeap } from '@datastructures-js/heap';

@Injectable()
export class ParkingService {
  numberOfSlots: number;
  ticketCounter: number;
  emptySlots: MinHeap<number>;
  ticketToCar: Map<string, Car>;

  slotToTicket: Map<number, string>;
  colorToTicket: Map<string, Set<string>>;
  regNumberToTicket: Map<string, string>;

  constructor() {
    this.initialize(0);
  }

  initialize(numberOfSlots: number) {
    this.numberOfSlots = 0;
    this.ticketCounter = 0;
    this.emptySlots = new MinHeap<number>();
    this.ticketToCar = new Map<string, Car>();

    this.slotToTicket = new Map<number, string>();
    this.colorToTicket = new Map<string, Set<string>>();
    this.regNumberToTicket = new Map<string, string>();

    this.addSlots(numberOfSlots);
  }

  addSlots(numberOfSlots: number) {
    for (let i = 1; i <= numberOfSlots; i++) {
      this.emptySlots.insert(this.numberOfSlots + i);
    }
    this.numberOfSlots += numberOfSlots;
  }

  generateNewTicket(): string {
    this.ticketCounter++;
    let newTicketId = this.ticketCounter.toString();
    newTicketId = newTicketId.padStart(9 - newTicketId.length, '0');
    return newTicketId;
  }

  allocateSlot(car: Car) {
    if (this.emptySlots.isEmpty()) {
      throw new Error('No empty slots');
    }
    const closestSlot = this.emptySlots.extractRoot();
    const newTicketId = this.generateNewTicket();

    car.slot = closestSlot;
    this.ticketToCar.set(newTicketId, car);
    this.slotToTicket.set(closestSlot, newTicketId);
    if (!this.colorToTicket.get(car.color)) {
      this.colorToTicket.set(car.color, new Set<string>());
    }
    this.colorToTicket.get(car.color).add(newTicketId);
    this.regNumberToTicket.set(car.regNumber, newTicketId);

    return {
      allocatedSlot: closestSlot,
      ticketId: newTicketId,
    };
  }

  getRegNumbersByColor(color: string): Array<string> {
    const regNumbers = [];
    this.colorToTicket.get(color).forEach((ticketId) => {
      regNumbers.push(this.ticketToCar.get(ticketId).regNumber);
    });
    return regNumbers;
  }

  getSlotsByColor(color: string): Array<number> {
    const slots = [];
    this.colorToTicket.get(color).forEach((ticketId) => {
      slots.push(this.ticketToCar.get(ticketId).slot);
    });
    return slots;
  }

  getSlotByRegNumber(regNumber: string): number {
    if (!this.regNumberToTicket.has(regNumber)) {
      throw new Error('Car with given registration number not parked in lot.');
    }
    return this.ticketToCar.get(this.regNumberToTicket.get(regNumber)).slot;
  }

  freeSlot(slot: number): number;
  freeSlot(regNumber: string): number;

  freeSlot(key: any): number {
    let ticketId: string;
    if (typeof key === 'number') {
      if (!this.slotToTicket.has(key)) {
        throw new Error('Slot already empty');
      }
      ticketId = this.slotToTicket.get(key);
    } else if (typeof key === 'string') {
      if (!this.regNumberToTicket.has(key)) {
        throw new Error('Car with given registration number not parked in lot');
      }
      ticketId = this.regNumberToTicket.get(key);
    } else {
      throw new Error('Invalid input type');
    }
    const car = this.ticketToCar.get(ticketId);
    this.emptySlots.insert(car.slot);
    this.ticketToCar.delete(ticketId);
    this.slotToTicket.delete(car.slot);
    this.colorToTicket.get(car.color).delete(ticketId);
    this.regNumberToTicket.delete(car.regNumber);
    return car.slot;
  }

  getOccupiedSlots(): Array<Car> {
    return [...this.ticketToCar.values()];
  }
}
