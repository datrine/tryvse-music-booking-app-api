import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ArtistProfileModule } from './modules/artist_profile/artist_profile.module';
import { EventListingModule } from './modules/event_listing/event_listing.module';
import { BookingTransactionModule } from './modules/booking_transaction/booking_transaction.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule, JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    JwtModule.registerAsync({
          global: true,
      useFactory: async () => {
        let res: JwtModuleOptions = {
          secret: process.env.JWT_SECRET_KEY,
        }
        return res
      },
    }),
    ArtistProfileModule,
    AuthModule,
    EventListingModule,
    BookingTransactionModule
    ,],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
