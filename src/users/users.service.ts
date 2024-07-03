import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import mongoose, { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createJobDto: CreateUserDto) {
    const user = await this.userModel.create({
      name: createJobDto.name,
      email: createJobDto.email,
      phone: createJobDto.phone,
      address: createJobDto.address,
    });
    return {
      user,
    };
  }

  async createRandomUser(): Promise<User> {
    const randomUser = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.country(),
    };

    const user = await this.userModel.create(randomUser);
    console.log(user);
    return user;
  }
  async searchQueryProject(
    address?: string,
    name?: string,
    phone?: string,
    email?: string,
  ): Promise<User[]> {
    try {
      const query: any = {};

      if (address) {
        query.address = { $regex: '.*' + address.trim() + '.*', $options: 'i' };
      }
      if (name) {
        query.name = { $regex: '.*' + name.trim() + '.*', $options: 'i' };
      }
      if (phone) {
        query.phone = { $regex: '.*' + phone.trim() + '.*', $options: 'i' };
      }

      if (email) {
        query.email = { $regex: '.*' + email.trim() + '.*', $options: 'i' };
      }

      let result = await this.userModel.find(query).exec();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error('Error searching users');
    }
  }

  async findUserPagination(
    currentPage: number,
    limit: number,
    qs: string,
    name?: string,
    phone?: string,
    address?: string,
  ): Promise<{ pagination: any; users: User[] }> {
    console.log('currentPage:', currentPage, 'limit:', limit);
    if (name) {
      return {
        pagination: {
          page: currentPage,
          limit: limit,
        },
        users: await this.searchQueryProject(name, phone, address),
      };
    }
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page; //tham so filter dang co page =>> delete no di
    delete filter.limit;

    console.log('filter:', filter);

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    console.log('offset:', offset, 'defaultLimit:', defaultLimit);

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const users = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    console.log('users:', users);

    return {
      pagination: {
        page: currentPage,
        limit: limit,
        total: totalItems,
      },
      users,
    };
  }

  async findAll() {
    let user = await this.userModel.find({});
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const objectId = new Types.ObjectId(id);
    return await this.userModel.updateOne(
      {
        _id: objectId,
      },
      {
        ...updateUserDto,
      },
    );
  }

  async remove(id: string) {
    try {
      const objectId = new Types.ObjectId(id);
      return await this.userModel.deleteOne({ _id: objectId });
    } catch (error) {
      console.error(error);
      throw new Error('Error removing user');
    }
  }

  async removeMany(userIds: string[]) {
    try {
      const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

      const result = await this.userModel.deleteMany({
        _id: { $in: objectIds },
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Error removing users');
    }
  }
}
