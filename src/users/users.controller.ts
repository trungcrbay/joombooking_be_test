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
  ): Promise<User[] | { pagination: any; users: User[] }> {
    if (address || name || phone || email) {
      return this.usersService.searchQueryProject(address, name, phone, email);
    } else if (currentPage && limit) {
      const qs = `page=${currentPage}&limit=${limit}`;
      return this.usersService.findUserPagination(currentPage, limit, qs);
    } else {
      return this.usersService.findAll();
    }
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
