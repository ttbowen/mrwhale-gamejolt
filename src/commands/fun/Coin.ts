import { Message, Markdown } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

export default class extends Command {
    public constructor() {
        super({
            name: 'coin',
            description: 'Flip a coin and get a heads or tails outcome.',
            usage: '<prefix> coin',
            type: 'fun',
            aliases: [ 'flip' ],
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message): Promise<void> {
        const flip: number = Math.floor(Math.random() * 2) + 1;

        if (flip == 1) {
            return message.reply(`The outcome is ${ Markdown.bold('Heads') }`);
        }
        else {
            return message.reply(`The outcome is ${ Markdown.bold('Tails') }`);
        }
    }
}