import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as responses from '../../data/8ball';

export default class extends Command {
    public constructor() {
        super({
            name: '8ball',
            description: 'A magic 8ball. Tells your fortune.',
            usage: '<prefix> 8ball',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message): Promise<void> {
        const index: number = Math.floor(Math.random() * responses.default.length);
        return message.reply(`${responses.default[index]}`);
    }
}