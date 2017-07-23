import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

export default class extends Command {
    public constructor() {
        super({
            name: 'chdef',
            description: 'Change a definition for `define`.',
            usage: '<prefix> chdef <def>, <newdefinition>',
            type: 'manage',
            permissionLevels: [Permissions.SITE_MODERATOR]
        });
    }

    public async invoke(message: Message, [word, definition]: [string, string]): Promise<void> {
        
        if (!word || !definition) return message.reply(`You must pass a word and definition`);
        
        let newWord: string = word.trim().toLowerCase();

        this._redis.set(`dictionary::${newWord}`, `${definition}`).then(() => {
            return message.reply(`Changed definition for **${word}**`);
        })
        .catch(() => { 
            return message.reply(`Could not change this definition.'`); 
        });
    }
}