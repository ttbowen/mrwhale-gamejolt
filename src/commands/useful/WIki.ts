import { Message } from 'gamejolt.js';
import { Command, Permissions, Util } from 'gamejolt-bot';

import wiki from 'wikijs';

export default class extends Command {
    public constructor() {
        super({
            name: 'wiki',
            description: 'Search for a Wiki page.',
            usage: '<prefix> wiki <query>',
            type: 'fun',
            pmOnly: true
        });
    }

    public async invoke(message: Message, [query]: [string]): Promise<void> {

        if (!query) return message.reply(`Please provide a search.`);

        wiki().search(query.trim(), 1).then((data) => {
            wiki().page(data.results[0]).then((page) => {
                page.summary().then((info) => {
                    info = Util.truncate(255, info);
                    return message.reply(info);
                });
            });
        }).catch(() => { return message.reply(`I couldn't search for this wiki`); });
    }
}