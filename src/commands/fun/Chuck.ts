import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as request from 'request-promise';

export default class extends Command {
    public constructor() {
        super({
            name: 'chucknorris',
            description: 'Get a random Chuck Norris joke.',
            usage: '<prefix> joke <firstname>, <lastname>, <category>',
            type: 'fun',
            aliases: ['chuck', 'norris'],
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message, [firstName, lastName, category]: [string, string, string]): Promise<void> {

        const options = {
            url: `http://api.icndb.com/jokes/random?`,
            method: 'GET',
            qs: {
                escape: 'javascript',
                firstName: firstName,
                lastName: lastName
            },
            headers: {
                'Content-type': 'application/json'
            },
            json: true
        };

        if (category) options.url += `category=[${category}]`;

        return request(options).then((response) => {
            if (response.value.joke)
                return message.reply(response.value.joke);
        });
    }
}