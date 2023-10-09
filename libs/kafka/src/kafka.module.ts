import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
// import { CountryKafkaConsumerService } from './country-kafka-consumer.service';
// import { KafkaProducerService } from './kafka-producer.service';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.KAFKA_SERVICE || 'default-service-name',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID || 'default-client-id',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'default-group-id',
          },
        },
      },
    ]),
  ],
  providers: [
    // KafkaProducerService,
    ClientKafka,
    // CountryKafkaConsumerService
  ],
  controllers: [AppController],
  exports: [ClientsModule],

})
export class KafkaModule { }