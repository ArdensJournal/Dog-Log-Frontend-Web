import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vaccine } from './vaccine.schema';
import { CreateVaccineDto } from './dto/create-vaccine.dto';

@Injectable()
export class VaccineService {
  constructor(
    @InjectModel(Vaccine.name) private vaccineModel: Model<Vaccine>,
  ) {}

  async findAllVaccines() {
    return this.vaccineModel.find();
  }

  async createVaccine(createVaccineDto: CreateVaccineDto) {
    const vaccine = new this.vaccineModel(createVaccineDto);
    return vaccine.save();
  }
}
