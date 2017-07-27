import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as leet from 'leet';

export default class extends Command {
    public constructor() {
        super({
            name: 'leet',
            description: 'Convert the text to l337.',
            usage: '<prefix> leet <Text>',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message, [text]: [string]): Promise<void> {
        if (!text || text === '') return message.reply('Please pass some text to convert');

        return message.reply(leet.convert(text));
    }
}