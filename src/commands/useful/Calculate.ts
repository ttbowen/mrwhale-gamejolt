import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as request from 'request-promise';

export default class extends Command {
    public constructor() {
        super({
            name: 'calculate',
            description: 'A scientific calculator.',
            usage: '<prefix> calculate <input>',
            type: 'useful',
            aliases: ['calc'],
            rateLimit: [ 2, 10 * 100 * 30  ]
        });
    }

    public async invoke(message: Message, [calc]: [string]): Promise<void> {
        const options = {
            url: `https://www.calcatraz.com/calculator/api?c=${encodeURIComponent(calc)}`,
            method: 'GET',
            headers: {
                'Content-type': 'text/plain'
            }
        };
        return request(options).then((answer) => {
            return message.reply(answer);
        });
    }
}