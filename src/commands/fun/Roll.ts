import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as d20 from 'd20';

export default class extends Command {
    public constructor() {
        super({
            name: 'roll',
            description: 'Roll one or multiple dice.',
            usage: '<prefix> roll [n sides] or [n dice] d[n sides] + [n dice] d[n sides] ...',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message, [input]: [string]): Promise<void> {

        if (!input) input = '';

        if (input.split('d').length <= 1) {
            return message.reply(`You rolled a ${d20.roll(input || '6')}`);
        }
        else if (input.split('d').length > 1) {

            let dice: string[] = input.split('+');
            let passed: boolean = true;

            for (let i = 0; i < dice.length; i++) {
                let current: number = parseInt(dice[i].split('d')[0]);
                if (current > 20)
                    passed = false;
            }

            if (passed)
                return message.reply(`You rolled a ${d20.roll(input, true)}`)
            else return message.reply(`You tried to roll too many dice at once.`);
        }
    }
}