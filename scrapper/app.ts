import { SQSEvent } from 'aws-lambda';
import { z, ZodError } from 'zod';
import { AxiosHttpGateway } from './adapters/axios-http-gateway';
import type { NfeParser } from './bondaries/nfe-parser';
import { CheerioNfeParser } from './adapters/cheerio-nfe-parser';
import type { MessageBroker } from './bondaries/message-broker';
import { SnsMessageBroker } from './adapters/sns-message-broker';
import { HttpGateway } from './bondaries/http-gareway';
import { ExtractAndPublishNfeUSeCase } from './use-cases/extract-and-publish-nfe-use-data-case';

export async function lambdaHandler(event: SQSEvent): Promise<void> {
    const recordSchema = z.array(
        z.object({
            url: z.string().url(),
        }),
    );

    try {
        const records = recordSchema.parse(
            event.Records.map((record) => ({
                url: JSON.parse(record.body).url,
            })),
        );

        const httpGateway: HttpGateway = new AxiosHttpGateway();
        const nfeParser: NfeParser = new CheerioNfeParser();
        const messageBroker: MessageBroker = new SnsMessageBroker();

        const extractAndPublishNfeDataUseCase = new ExtractAndPublishNfeUSeCase(httpGateway, nfeParser, messageBroker);

        for (let record of records) {
            await extractAndPublishNfeDataUseCase.execute({ url: record.url });
        }
        return;
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.log(error.format());
            return;
        }
        if (error instanceof Error) {
            console.log(error.message);
            return;
        }
        console.log(error);
        return;
    }
}