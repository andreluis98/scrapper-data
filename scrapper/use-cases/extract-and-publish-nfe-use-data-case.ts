import { HttpGateway } from "../bondaries/http-gareway";
import { MessageBroker } from "../bondaries/message-broker";
import { NfeParser } from "../bondaries/nfe-parser";

type Input = {
    url: string;
}

export class ExtractAndPublishNfeUSeCase{
    public constructor(
        readonly httpGateway: HttpGateway,
        readonly nfeParser: NfeParser,
        readonly messageBroker: MessageBroker,
    ){}
    public async execute({url}: Input): Promise<void> {
        const html = await this.httpGateway.get(url);
        const nfeData = this.nfeParser.getData(html);
        console.log(nfeData);
        
        await this.messageBroker.publish("arn:aws:sns:us-east-1:767397748001:nfe-data-parsed.fifo", nfeData)
    }
}