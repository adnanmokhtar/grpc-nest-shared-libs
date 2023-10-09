import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';

@Injectable()
export class KafkaProducerService {
    private readonly producer: Producer;

    constructor() {
        const client = new KafkaClient({
            clientId: 'country',
            kafkaHost: 'localhost:9092'
        });
        this.producer = new Producer(client);
        this.producer.on('ready', () => {
            console.log('Kafka producer is ready');
        });
        this.producer.on('error', (err) => {
            console.error('Error in Kafka producer:', err);
        });
    }

    async produceMessage(topic: string, key: string, value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const payloads: ProduceRequest[] = [
                {
                    topic,
                    messages: [{ key, value }],
                },
            ];

            this.producer.send(payloads, (err, data) => {
                if (err) {
                    console.error('Error producing message:', err);
                    reject(err);
                } else {
                    console.log('Message sent:', data);
                    resolve();
                }
            });
        });
    }

    async sendEvent(topic: string, event: Record<string, any>): Promise<void> {
        const key = event.someKey; // Replace with the actual key
        const value = JSON.stringify(event);
        await this.produceMessage(topic, key, value);
    }
}
