import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as memes from '../../data/Memes';

export default class extends Command {
    public constructor() {
        super({
            name: 'memelist',
            description: 'List all available memes.',
            usage: '<prefix> memelist',
            type: 'info',
            pmOnly: true
        });
    }

    public async invoke(message: Message): Promise<void> {

        let list: string = 'Available memes: \n';

        for (let meme in memes.default) {
            list += `\`${meme}\`\n`;
        }
        return message.reply(list);
    }
}