import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as nconf from 'nconf';
import * as request from 'request-promise';

export default class extends Command {
    public constructor() {
        super({
            name: 'google',
            description: 'Search with Google.',
            usage: '<prefix> google <search>',
            type: 'useful',
			pmOnly: true,
			rateLimit: [ 2, 10 * 100 * 15  ]
        });
    }

    public async invoke(message: Message, [search]: [string]): Promise<void> {
		
	    if (!search) return message.reply('You must pass a search query for this command.');

        let options = {
            url: `https://www.googleapis.com/customsearch/v1`,
            qs: {
			    key: nconf.get('youtube_api'),
				cx: nconf.get('google_api'),
                q: search.replace(/\s/g, '+'),
                alt: 'json',
               	num: 3,
                start: 1		
            },
            json: true
        }

        return request(options).then((body) => {
			if (!body) {
			    return message.reply(`Error: ${ JSON.stringify(body)} `);
			}
			else if (!body.items || body.items.length === 0) {
			    return message.reply(`No result for '${search}'`);
			}
            let output: string = '';

            for (let i = 0; i < body.items.length; i++) {
                if(body.items[i])
                    output += `${i+1}. ${body.items[i].title}\n ${body.items[i].link} \n\n`
            }
            return message.reply(output);
        });
    }
}