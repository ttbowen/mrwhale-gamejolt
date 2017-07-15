import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as nconf from 'nconf';
import * as wolfram from 'wolfram';

export default class extends Command {
    public constructor() {
        super({
            name: 'wolfram',
            description: 'Query wolfram alpha.',
            usage: '<prefix> wolfram <query>',
            type: 'useful',
            pmOnly: true
        });
        this.wolfram = wolfram.createClient(nconf.get('wolfram_api'));
    }

    private wolfram: wolfram;

    private async queryWolfram(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.wolfram.query(query, (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }

    public async invoke(message: Message, [query]: [string]): Promise<void> {

        if (!query) return message.reply('Please provide a search query.');

        let result = await this.queryWolfram(query);

        if (!result || result.length < 1)
            return message.reply('No results found from wolfram alpha.');
        let response: string = '\n';

        for (let i = 0; i < result.length; i++) {
            response += result[i].title + ' - ' + result[i].subpods[0].value + '\n';
        }
        return message.reply(response);
    }
}