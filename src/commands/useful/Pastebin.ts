import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as nconf from 'nconf';
import * as request from 'request-promise';

export default class extends Command {
    public constructor() {
        super({
            name: 'pastebin',
            description: 'Upload a paste to pastebin.',
            usage: '<prefix> pastebin <paste>',
            type: 'useful',
            aliases: [ 'paste' ],
            rateLimit: [ 2, 10 * 100 * 15  ]
        });
    }

    public async invoke(message: Message, [paste]: [string]): Promise<void> {

        if (!nconf.get('pastebin')) return message.reply('No API key provided for pastebin.');

        if (!paste || paste === '') return message.reply('Please provide a paste to upload.');

        let options = {
            url: `https://pastebin.com/api/api_post.php`,
            method: 'POST',
            form: {
                api_option: 'paste',
                api_paste_code: paste,
                api_dev_key: nconf.get('pastebin')
            }
        }

        return request(options).then((body) => {
            if (body)
                return message.reply(body);
        });
    }
}