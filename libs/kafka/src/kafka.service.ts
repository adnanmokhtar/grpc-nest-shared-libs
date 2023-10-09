// kafka.service.ts

import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
    private kafka: Kafka;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'your-client-id',
            brokers: ['localhost:9092'],
        });
    }

    async sendMessage(topic: string, key: string, message: string) {
        const producer = this.kafka.producer();

        await producer.connect();
        await producer.send({
            topic,
            messages: [{ key, value: message }],
        });
        await producer.disconnect();
    }

    async consumeMessage(topic: string, groupId: string, callback: (message: any) => void) {
        const consumer = this.kafka.consumer({ groupId });

        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ message }) => {
                // Use optional chaining to safely access 'message.value'
                const messageValue = message?.value?.toString();
                if (messageValue) {
                    callback(messageValue);
                }
            },
        });
    }
}
