import { Message, User, FriendRequest } from 'gamejolt.js';
import { ListenerDecorators } from 'gamejolt-bot';
import { BotClient } from '../BotClient';
import { rageResponses, tooLongResponses, profanityResponses } from '../../data/policer';

import * as profanity from 'profanity-util';

const { on, registerListeners } = ListenerDecorators;


/**
 * 
 * A manager which handles chat policing and regulation 
 * @export
 * @class Policer
 */
export class Policer {

    private _client: BotClient;
    private _capLevel: number;
    private _profanityLevel: number;
    private _lastCheck: number;

    /**
     * Creates an instance of Policer.
     * @param {BotClient} client 
     * @memberof Policer
     */
    public constructor(client: BotClient) {
        this._client = client;
        this._capLevel = 0;
        this._profanityLevel = 0;
        this._lastCheck = Date.now();

        registerListeners(this._client, this);
    }

    @on('message')
    private async _onMessage(message: Message): Promise<void> {
 
        if (message.user.id === this._client.clientUser.id 
            || await this._client.isQuiet(message.roomId)) return;

        const capsregex: RegExp = /^[A-Z0-9-!$%#@£^¬&*()_+|~=`{}\[\]:";'<>?,.\/\\]*$/;
        
        // Check for profanity 
        const profanityAmount: number = (Date.now() - this._lastCheck) / 1000 / 10;
        this._profanityLevel = Math.max(this._profanityLevel - profanityAmount, 0);

        if (profanity.check(message.toString()).length > 0) {
            this._profanityLevel++;

            if (this._profanityLevel >= 2.0) {

                this._profanityLevel -= 2.0;
                return message.reply(profanityResponses[Math.floor(Math.random() * profanityResponses.length)]);
            }
        }

        // Check for excessive caps
        const capsAmount: number = (Date.now() - this._lastCheck) / 1000 / 10;
        this._capLevel = Math.max(this._capLevel - capsAmount, 0);

        if (message.toString().match(capsregex) && message.toString().length > 5) {
            this._capLevel++;

            if (this._capLevel >= 2.0) {

                this._capLevel -= 2.0;
                return message.reply(rageResponses[Math.floor(Math.random() * rageResponses.length)]);
            }

        }

        if (message.toString().length > 300) {
            return message.reply(tooLongResponses[Math.floor(Math.random() * tooLongResponses.length)]);
        }
        this._lastCheck = Date.now();
    }
}