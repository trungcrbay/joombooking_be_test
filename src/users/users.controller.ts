import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { ResponseMessage } from 'decorators/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create new user successfully')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('crt-random')
  createRandom() {
    return this.usersService.createRandomUser();
  }

  @Post('bulk')
  @ResponseMessage('Create multiple users successfully')
  createMany(@Body('users') createUserDtos: CreateUserDto[]) {
    return this.usersService.createManyUser(createUserDtos);
  }

  @Get()
  async findUserPagination(
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
    @Query('address') address?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('sortBy') sortBy?: string,
    @Query('age') age?: number,
    @Query('lt') lt?: number,
    @Query('gt') gt?: number,
    @Query('status') status?: "0" | "1",
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{ pagination: any; users: User[] }> {
    return this.usersService.findUserPagination(
      currentPage,
      limit,
      sortBy,
      sortOrder,
      address,
      name,
      phone,
      email,
      lt,
      gt,
      age,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ResponseMessage('Update user successfully!')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ResponseMessage('Deleted user successfully updated!')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ResponseMessage('Deleted users selected successfully!')
  @Delete()
  async removeManyUsers(@Body('userId') userIds: string[]) {
    return this.usersService.removeMany(userIds);
  }
}
