import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

export default class extends Command {
    public constructor() {
        super({
            name: 'rockpaper',
            description: 'Play Rock, Paper Scissors.',
            usage: '<prefix> rockpaper <rock|paper|scissors>',
            type: 'fun',
            aliases: ['rps'],
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    private compare(first: string, second: string): string {
        if (first === second) {
            return 'It\'s a tie!';
        }
        else if (first === 'rock') {

            if (second === 'scissors') return 'Rock wins! ✊';
            else
                return 'Paper wins! ✋';

        }
        else if (first === 'paper') {

            if (second === 'rock') return 'Paper wins! ✋';
            else
                return 'Scissors wins! ✌';
        }
    }

    public async invoke(message: Message, [choice]: [string]): Promise<void> {

        if (!choice || choice === '') return message.reply(`Please pass a choice`);
        
        let userChoice: string = choice.trim().toLowerCase();
        let compChoice: number = Math.random();
        let compChoiceStr: string = "";

        let validChoices: RegExp = /(rock|paper|scissors)/;
        let match: RegExpMatchArray = userChoice.match(validChoices);

        if (!match) return message.reply('Please pass rock, paper, scissors.');

        if (compChoice < 0.34) {
            compChoiceStr = 'rock';
        }
        else if (compChoice <= 0.67) {
            compChoiceStr = 'paper';
        }
        else {
            compChoiceStr = 'scissors';
        }
        let result: string = this.compare(userChoice, compChoiceStr);

        return message.reply(`${compChoice}. ${result}`);
    }
}