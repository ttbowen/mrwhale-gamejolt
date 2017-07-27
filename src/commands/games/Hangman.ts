import { Message } from 'gamejolt.js';
import { Command, Permissions, Collection, Time, TimeUtil } from 'gamejolt-bot';
import { Game } from '../../core/types/HangmanGame';

export default class extends Command {
    public constructor() {
        super({
            name: 'hangman',
            description: 'Play the classic game "hangman".',
            usage: '<prefix> hangman <start|guess|end>, [letter]',
            type: 'fun',
            aliases: ['hm', 'hang'],
            pmOnly: true,
            ignoreCooldown: true
        });
        this._games = new Collection<number, Game>();
    }

    private _games: Collection<number, Game>;

    public async invoke(message: Message, [commandName, input]: [string, string]): Promise<void> {

        if (!commandName) return message.reply('Please provide a command. Use `!help hangman` for more info.');

        if (this._games.has(message.roomId)) {
            if (this._games.get(message.roomId).won || this._games.get(message.roomId).isGameOver) {
                this._games.delete(message.roomId);
            }
        }

        commandName = commandName.trim().toLowerCase();

        if (input) input = input.trim().toLowerCase();

        // Create a new hangman game
        if (commandName === 'start') {
            if (this._games.has(message.roomId)) {
                return message.reply(`There is already an active game for this room.`);
            } else {
                let newGame: Game = new Game(message.userId);
                let started = await newGame.start();

                if (started) {
                    this._games.set(message.roomId, newGame);
                    let letters: string[] = newGame.getLettersToShow();
                    let output: string = `I'm thinking of a **${letters.length}** lettered word. Start guessing.\n`;

                    for (let i = 0; i < letters.length; i++) {
                        output += letters[i] + ' ';
                    }
                    return message.reply(output);
                }
            }
        }
        else if (commandName === 'end') {

            if (!this._games.get(message.roomId)) {
                return message.reply('There is no game in progress.');
            }

            // Only allow the user that created the game to end it
            if (this._games.get(message.roomId).ownerId !== message.userId) {
                return message.reply('You must be the owner of this game to end it.');
            }

            let output: string = this._games.get(message.roomId).gameOver(false);
            this._games.delete(message.roomId);
            return message.reply(output);
        }
        else if (commandName === 'guess') {
            if (!this._games.has(message.roomId)) {
                return message.reply(`There is no game in progress for this room.`);
            }

            if (!input) return message.reply('Please provide a guess.');

            // Destroy the game after 5 minutes
            let diff: Time = TimeUtil.difference(Date.now(), this._games.get(message.roomId).startTime);

            if (diff.seconds > 300) {
                this._games.delete(message.roomId);
                return message.reply('The game has ended. Use `start` to begin another game.')
            }

            // Only use the first character as the guess
            input = input[0];

            let response: string = this._games.get(message.roomId).guess(input);

            return message.reply(response);
        }
    }
}