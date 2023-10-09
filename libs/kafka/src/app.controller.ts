import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('COUNTRY_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @EventPattern('CountryCreatedEvent')
  handleOrderCreated(data: any) {
    // Handle the received Kafka message (country event)
    console.log('Received Kafka Message:', data);

    // const event: AccountOpenedEvent = plainToClass(AccountOpenedEvent, value);

    // this.eventBus.publish(event);
  }


}