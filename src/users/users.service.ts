import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import mongoose, { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createJobDto: CreateUserDto) {
    const user = await this.userModel.create({
      name: createJobDto.name,
      email: createJobDto.email,
      phone: createJobDto.phone,
      address: createJobDto.address,
      age: createJobDto.age,
      status: true,
    });
    return {
      user,
    };
  }

  async createManyUser(users: CreateUserDto[]) {
    try {
      const validUsers = users.filter(
        (user) => user.name && user.email && user.phone && user.address,
      );

      if (!users) {
        throw new Error('No valid users to create');
      }

      const createdUsers = await this.userModel.insertMany(validUsers);
      return createdUsers;
    } catch (e) {
      console.error(e);
    }
  }

  async createRandomUser(): Promise<User> {
    const randomUser = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.country(),
      status: faker.datatype.boolean(0.6),
      age: faker.number.int({ min: 18, max: 70 }),
    };

    const user = await this.userModel.create(randomUser);
    console.log(user);
    return user;
  }
  // async searchQueryProject(
  //   address?: string,
  //   name?: string,
  //   phone?: string,
  //   email?: string,
  // ): Promise<User[]> {
  //   const query: any = {};

  //   if (address) {
  //     query.address = { $regex: '.*' + address.trim() + '.*', $options: 'i' };
  //   }
  //   if (name) {
  //     query.name = { $regex: '.*' + name.trim() + '.*', $options: 'i' };
  //   }
  //   if (phone) {
  //     query.phone = { $regex: '.*' + phone.trim() + '.*', $options: 'i' };
  //   }
  //   if (email) {
  //     query.email = { $regex: '.*' + email.trim() + '.*', $options: 'i' };
  //   }

  //   return this.userModel.find(query).exec();
  // }

  async findUserPagination(
    currentPage: number,
    limit: number,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc', // default to ascending order
    address?: string,
    name?: string,
    phone?: string,
    email?: string,
    lt?: number,
    gt?: number,
    age?: number,
    status?: '0' | '1',
  ): Promise<{ pagination: any; users: User[] }> {
    let query: any = {};

    // Build query based on provided parameters
    if (address) {
      query.address = { $regex: new RegExp('.*' + address + '.*', 'i') };
    }
    if (name) {
      query.name = { $regex: new RegExp('.*' + name + '.*', 'i') };
    }
    if (phone) {
      query.phone = { $regex: new RegExp('.*' + phone + '.*', 'i') };
    }
    if (email) {
      query.email = { $regex: new RegExp('.*' + email + '.*', 'i') };
    }
    if (lt) {
      query.age = { $lt: lt };
    }
    if (gt) {
      query.age = { $gt: gt };
    }
    if (status) {
      query.status = status === '1' ? true : false;
    }

    console.log('query: ', query);

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit || 10;

    const totalItems = await this.userModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Sorting options
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    try {
      const users = await this.userModel
        .find(query)
        .sort(sort)
        .skip(offset)
        .limit(defaultLimit)
        .exec();

      return {
        pagination: {
          page: currentPage,
          limit: limit,
          total: totalItems,
          totalPages: totalPages,
        },
        users,
      };
    } catch (error) {
      // Handle any errors that might occur during the database operation
      throw new Error(`Error finding users: ${error.message}`);
    }
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
