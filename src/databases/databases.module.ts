import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService],
})
export class DatabasesModule {}
