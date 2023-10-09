import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';

@Injectable()
export class CountryKafkaConsumerService {
  constructor(
    @Inject('COUNTRY_SERVICE') private readonly authClient: ClientKafka,
    private readonly clientKafka: ClientKafka
  ) { }

  @MessagePattern('CountryCreatedEvent')
  async handleCountryEvent(data: any): Promise<void> {
    // Handle the received Kafka message (country event)
    console.log('Received Kafka Message:', data);

    // const event: AccountOpenedEvent = plainToClass(AccountOpenedEvent, value);

    // this.eventBus.publish(event);
  }
}
