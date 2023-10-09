// import { Country } from "../models/entities/country";

// export class CountryCreatedEvent {
//     constructor(public readonly country: Country) {}
//   }

import { IEvent } from '@nestjs/cqrs';

export class CountryCreatedEvent<TCommand> implements IEvent {
  constructor(public readonly command?: TCommand) { }
}