import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as nconf from 'nconf'

import * as bluebird from 'bluebird';
import * as Imgflipper from 'imgflipper';
import * as memes from '../../data/memes';

export default class extends Command {
    public constructor() {
        super({
            name: 'meme',
            description: 'Generate a meme with ImgFlipper.',
            usage: '<prefix> meme <meme>, <toptext>, <bottomtext>',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    public async invoke(message: Message, [memeName, top, bottom]: [string, string, string]): Promise<void> {

        const imgFlip: Imgflipper = new Imgflipper(nconf.get('imgflip_user'), nconf.get('imgflip_pass'));
        const meme = bluebird.promisify(imgFlip.generateMeme);

        return meme(memes.default[memeName], top, bottom).then((image) => {
            return message.reply(image);
        }).catch((err) => {
            return message.reply(err.message);
        });
    }
}