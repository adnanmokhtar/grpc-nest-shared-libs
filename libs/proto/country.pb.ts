/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

// Define the package name for the protobuf definitions
export const protobufPackage = "countryproto";

// Define the request message for the "createCountry" RPC method
export interface createCountryRequest {
  name: string;
  isoCode: string;
  isActive: string;
}

// Define the response message for the "createCountry" RPC method
export interface createCountryResponse {
  message: string;
}

// Define the package name for the gRPC service
export const COUNTRYPROTO_PACKAGE_NAME = "countryproto";

// Define the gRPC client interface for the "CountryService"
export interface CountryServiceClient {
  createCountry(request: createCountryRequest): Observable<createCountryResponse>;
}

// Define the gRPC controller interface for the "CountryService"
export interface CountryServiceController {
  createCountry(
    request: createCountryRequest,
  ): Promise<createCountryResponse> | Observable<createCountryResponse> | createCountryResponse;
}

// Decorator function for defining gRPC methods in the controller
export function CountryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createCountry"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CountryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CountryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

// Define the service name for the gRPC service
export const COUNTRY_SERVICE_NAME = "CountryService";
