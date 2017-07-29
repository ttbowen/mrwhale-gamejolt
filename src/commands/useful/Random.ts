import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as Randomorg from 'random-org';
import * as nconf from 'nconf';

export default class extends Command {
    public constructor() {
        super({
            name: 'random',
            description: 'Generate random values.',
            usage: '<prefix> random <gaussian|integer|fraction>',
            type: 'useful',
            extraHelp: [{
                commandName: 'gaussian',
                description: 'Generate gaussian integrals.',
                args: '<prefix> random gaussian, [num, mean, standardDeviation, significantDigits]'
            }, {
                commandName: 'integer',
                description: 'Generate random integers.',
                args: '<prefix> random integer, [num, min, max]'
            }, {
                commandName: 'fraction',
                description: 'Generate fractions.',
                args: '<prefix> random integer, [num, decimalPlaces]'
            }]
        });
        if (nconf.get('random_org')) this.rand = new Randomorg({ apiKey: nconf.get('random_org') });
    }

    private rand: Randomorg;

    private async gaussian(n: number, mean: number, stdDev: number, significantDigits: number): Promise<any> {
        if (n > 10) return;

        return this.rand.generateGaussians({ n, mean, standardDeviation: stdDev, significantDigits })
            .then(response => response.random)
    }

    private async integer(n: number, min: number, max: number, replacement: boolean): Promise<any> {
        if (n > 10) return;
        
        return this.rand.generateIntegers({ n, min, max, replacement })
            .then(response => response.random)
    }

    private async fraction(n: number, replacement: boolean, decimalPlaces: number): Promise<any> {
        if (n > 10) return;
        
        return this.rand.generateDecimalFractions({ n, replacement, decimalPlaces })
            .then(response => response.random)
    }

    public async invoke(message: Message, [commandName, ...args]: [string, string]): Promise<void> {
        if (!commandName) return message.reply('Use `!help random` for help how to use this command.');

        if (commandName === 'gaussian') {

            let n: number = parseInt(args[0]) || 2;
            let mean: number = parseInt(args[1]) || 50;
            let stdDev: number = parseInt(args[2]) || 10;
            let sigDig: number = parseInt(args[3]) || 5;

            let gaussian = await this.gaussian(n, mean, stdDev, sigDig);

            return message.reply(gaussian.data.toString());

        } else if (commandName === 'integer') {

            let n: number = parseInt(args[0]) || 2;
            let min: number = parseInt(args[1]) || 1;
            let max: number = parseInt(args[2]) || 50;

            let integer = await this.integer(n, min, max, false);

            return message.reply(integer.data.toString());

        } else if (commandName === 'fraction') {

            let n: number = parseInt(args[0]) || 1;
            let decimalPlaces: number = parseInt(args[1]) || 5;

            let fraction = await this.fraction(n, false, decimalPlaces);

            return message.reply(fraction.data.toString());
        }
    }
}