import { Message, User, FriendRequest } from 'gamejolt.js';
import { ListenerDecorators } from 'gamejolt-bot';
import { BotClient } from '../BotClient';
import { rageResponses, tooLongResponses } from '../../data/policer';

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
    private _lastCheck: number;

    /**
     * Creates an instance of Policer.
     * @param {BotClient} client 
     * @memberof Policer
     */
    public constructor(client: BotClient) {
        this._client = client;
        this._capLevel = 0;
        this._lastCheck = Date.now();

        registerListeners(this._client, this);
    }

    @on('message')
    private async _onMessage(message: Message): Promise<void> {
        
        if (message.user.id === this._client.clientUser.id) return;

        const capsregex: RegExp = /^[A-Z0-9-!$%#@£^¬&*()_+|~=`{}\[\]:";'<>?,.\/\\]*$/;

        const amount: number = (Date.now() - this._lastCheck) / 1000 / 10;
        this._capLevel = Math.max(this._capLevel - amount, 0);

        if (message.toString().match(capsregex) && message.toString().length > 5) {
            this._capLevel++;

            if (this._capLevel >= 2.3) {

                this._capLevel -= 2.3;
                return message.reply(rageResponses[Math.floor(Math.random() * rageResponses.length)]);
            }

        }

        if (message.toString().length > 300) {
            return message.reply(tooLongResponses[Math.floor(Math.random() * tooLongResponses.length)]);
        }
        this._lastCheck = Date.now();
    }
}