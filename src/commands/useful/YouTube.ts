import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import { YoutubePlugin } from '../../core/plugins/YouTube';

export default class extends Command {
    public constructor() {
        super({
            name: 'youtube',
            description: 'Search for YouTube videos.',
            usage: '<prefix> youtube <search>',
            type: 'useful',
            aliases: ['yt'],
            rateLimit: [ 2, 10 * 100 * 30  ]
        });
    }

    public async invoke(message: Message, [search]: [string]): Promise<void> {
        const yt: YoutubePlugin = new YoutubePlugin();
        const video = await yt.search(search);
        return message.reply(video);
    }
}