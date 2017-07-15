import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as request from 'request-promise';

export default class extends Command {
    public constructor() {
        super({
            name: 'gif',
            description: 'Search for gifs on giphy.',
            usage: '<prefix> gif <search>',
            type: 'useful',
            rateLimit: [ 2, 10 * 100 * 30  ]
        });
    }

    public async invoke(message: Message, [search]: [string]): Promise<void> {
        
        if (!search) return message.reply('You must pass a search query for this command.');

        let options = {
            url: `http://api.giphy.com/v1/gifs/random?tag=${encodeURI(search)}`,
            qs: {
                api_key: 'dc6zaTOxFJmzC',
                rating: 'pg-13',
                limit: 1
            },
            json: true
        }

        return request(options).then((body) => {
            if (body.data.id)
                return body.data.image_original_url;
        });
    }
}