import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as request from 'request-promise';

export default class extends Command {
    public constructor() {
        super({
            name: 'topic',
            description: 'Random topic.',
            usage: '<prefix> topic',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message): Promise<void> {

        const options = {
            url: `https://www.randomlists.com/data/topics.json`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return request(options).then((body) => {
            const topics = JSON.parse(body);

            const index = Math.floor(Math.random() * topics.data.length);

            const replies = [
                'Let\'s talk about <<TOPIC>>',
                'You know what\'s interesting? <<TOPIC>>',
                'I\'ve been thinking a lot about <<TOPIC>> lately. Let\'s talk about it.',
                'Let\'s discuss <<TOPIC>>',
                'What do you think about <<TOPIC>>',
                'I want to talk about <<TOPIC>>'
            ];

            const reply: string = replies[Math.floor(Math.random() * replies.length)].replace(/<<TOPIC>>/, topics.data[index]);
            
            return message.reply(reply);
        });
    }
}