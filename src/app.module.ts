import { Module } from '@nestjs/common';
import { Authmodule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Authmodule, 
    UserModule, 
    BookmarkModule, 
    PrismaModule,
  ],
})
export class AppModule {}
