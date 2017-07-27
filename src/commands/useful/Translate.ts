import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as request from 'request-promise';
import * as langs from 'langs';

export default class extends Command {
    public constructor() {
        super({
            name: 'translate',
            description: 'Translate text to specified language.',
            usage: '<prefix> translate <TEXT>, <LANGUAGE>',
            type: 'fun',
            rateLimit: [ 2, 10 * 100 * 30  ]
        });
    }

    public async invoke(message: Message, [text, language]: [string, string]): Promise<void> {
        let source: string = 'auto';
        let targetLang: string = 'en';
        let base: string = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=';
        
        if (!text) return message.reply('Please pass some text to translate.');

        if (message.toString().length > 255) return message.reply('Sorry but input is too large.');

        if (language) {
            let name: string;
            language = language.charAt(0).toUpperCase() + language.slice(1);

            if (langs.where('name', language)) {
                name = langs.where('name', language)["1"]
            }
            if (name) targetLang = name;
        }

        let options = {
            url: `${base}${source}&tl=${targetLang}&dt=t&q=${encodeURI(text)}`,
            headers: {
                'Content-type': 'text/plain'
            }
        }

        return request(options).then((result) => {
            let translated = result.match(/^\[\[\[".+?",/)[0];
            translated = translated.substring(4, translated.length - 2);

            return message.reply(`Translated: ${translated}`);
        });
    }
}