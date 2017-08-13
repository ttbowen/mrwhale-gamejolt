import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as eyes from '../../data/WhaleEyes';

export default class extends Command {
    public constructor() {
        super({
            name: 'Whale',
            description: 'Generate a whale face.',
            usage: '<prefix> whale x[number]',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 60]
        });
    }

    public async invoke(message: Message, [size]: [string]): Promise<void> {

        const min: number = 5;
        const max: number = 25;

        let tooSmall = [
            `You call that a whale?`,
            `Hahaha are you even trying?`,
            `What is this a centre for ants!!`
        ]

        let tooBig = [
            'Whoa, this will be spam man.',
            'I know whales are huge, but let\'s not make them too huge.',
            'This whale is too big for me.'
        ]

        let whaleSize: number = 5;
        
        if (size)
            whaleSize = parseInt(/x(\d+)/g.exec(size)[1]);

        if (isNaN(whaleSize))
            whaleSize = 5;

        if (whaleSize < min)
            return message.reply(tooSmall[Math.floor(Math.random() * tooSmall.length)]);

        if (whaleSize > max)
            return message.reply(tooBig[Math.floor(Math.random() * tooBig.length)]);
        
        let whale: string = '';
        let whaleEyes: string[] = eyes.default[Math.floor(Math.random() * eyes.default.length)];

        whale += whaleEyes[0];

        for (let i = 0; i < whaleSize; i++) {
            whale += '\\_';
        }       
        whale += whaleEyes[1];

        return message.reply(whale);
    }
}