import { Message } from 'gamejolt.js';

import * as cleverbot from 'cleverbot-node';
import * as nconf from 'nconf'

/**
 * Handles cleverbot API
 * @export
 * @class CleverbotPlugin
 */
export class CleverbotPlugin {
    
    private bot: cleverbot;

    public constructor() {
        this.bot = new cleverbot;
        this.bot.configure({ botapi: nconf.get('cleverbot') });
    } 

    /**
     * Send message to cleverbot and return response from cleverbot
     * @param {Message} message 
     * @returns {Promise<any>} 
     * @memberof CleverbotPlugin
     */
    public speak(message: Message): Promise<any> {
        return new Promise((resolve) => {
            this.bot.write(message.contentRaw, (response) => {
               resolve(response.message);
            });
        })
    }
}