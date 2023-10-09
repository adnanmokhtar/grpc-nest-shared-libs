import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { DynamicConfigService } from './application/services/dynamic-config.service';
import { LocalizationService } from './application/services/localization.service';
import { config } from './infrastructure/config/config';
import { ErrorLoggingInterceptor } from './infrastructure/interceptors/error-logging.interceptor';
import { LocalizationMiddleware } from './infrastructure/middlewares/localization.middleware';
import { FileLogger } from './infrastructure/utils/logger.service';
import { ResponseHandler } from './infrastructure/utils/response.handler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config]
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
            ],
        }),
    ],
    providers: [
        FileLogger,
        LocalizationService,
        DynamicConfigService,
        LocalizationMiddleware,
        ResponseHandler,
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorLoggingInterceptor,
        },
    ],
    exports: [
        LocalizationService,
        FileLogger,
        ResponseHandler
    ]
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LocalizationMiddleware).forRoutes('*');
    }
}