import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as decisions from '../../data/choose';

export default class extends Command {
    public constructor() {
        super({
            name: 'choose',
            description: 'Choose between one or multiple choices.',
            usage: '<prefix> choose <choice> or <choice> ...',
            type: 'fun',
            aliases: ['decide', 'pick'],
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    private multiDecide(options: string[]): string {
        const selected: string = options[Math.floor(Math.random() * options.length)];
        if (!selected)
            return this.multiDecide(options);
        return selected;
    }

    public async invoke(message: Message, [choices]: [string]): Promise<void> {
        if (!choices) return message.reply('No choices have been passed.');

        const options: string[] = choices.split(' or ');

        if (options.length > 1) {
            let index = Math.floor(Math.random() * decisions.default.length);
            let choice = this.multiDecide(options);
            return message.reply(decisions.default[index].replace(/<<CHOICE>>/g, choice));
        }
        else return message.reply('Please pass two or more choices.');
    }
}