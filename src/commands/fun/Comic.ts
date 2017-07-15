import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as _request from 'request';
import * as cheerio from 'cheerio';
import * as bluebird from 'bluebird';

const request = bluebird.promisify(_request);

export default class extends Command {
    public constructor() {
        super({
            name: 'comic',
            description: 'Get a webcomic.',
            usage: '<prefix> comic <cah|xkcd|smbc|theoatmeal|random>',
            type: 'fun',
            rateLimit: [2, 10 * 100 * 30]
        });
    }

    private async cah(): Promise<string> {
        return request('http://explosm.net/comics/random/')
            .then(response => response.body)
            .then(cheerio.load)
            .then($ => `http:${$('#main-comic').attr('src')}`);;
    }

    private async xkcd(): Promise<string> {
        const options = {
            url: 'https://c.xkcd.com/random/comic/',
            rejectUnauthorized: false
        }

        return request(options)
            .then(response => response.body)
            .then(cheerio.load)
            .then($ => `https:${$('#comic').find('img').first().attr('src')}`);
    }

    private async smbc(): Promise<string> {
        return request('http://www.smbc-comics.com/')
            .then(response => response.body)
            .then(cheerio.load)
            .then($ => $('.random').first().attr('href'))
            .then(url => request(`http://www.smbc-comics.com/${url}`))
            .then(response => response.body)
            .then(cheerio.load)
            .then($ => `http://www.smbc-comics.com/${$('#comic').attr('src')}`);
    }

    private async oatmeal(): Promise<string> {
        return request('http://theoatmeal.com/feed/random')
            .then(response => response.body)
            .then(cheerio.load)
            .then($ => $('#comic').find('img').first().attr('src'));
    }

    private async random(): Promise<any> {
        const commands = [
            this.cah,
            this.xkcd,
            this.smbc,
            this.oatmeal
        ];
        const rand = Math.floor(Math.random() * commands.length);
        return commands[rand]();
    }

    public async invoke(message: Message, [comic]: [string]): Promise<void> {
        if (!comic) return message.reply(await this.random());

        comic = comic.toLowerCase();

        if (comic === 'random')
            return message.reply(await this.random());

        if (comic === 'cah')
            return message.reply(await this.cah());

        if (comic === 'xkcd')
            return message.reply(await this.xkcd());

        if (comic === 'smbc')
            return message.reply(await this.smbc());

        if (comic === 'theoatmeal')
            return message.reply(await this.oatmeal());
    }
}