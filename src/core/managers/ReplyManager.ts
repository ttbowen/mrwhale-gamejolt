import { Message, User, FriendRequest } from 'gamejolt.js';
import { ListenerDecorators, CommandRateLimit, RedisProvider } from 'gamejolt-bot';
import { BotClient } from '../BotClient';

const { on, registerListeners } = ListenerDecorators;


export class ReplyManager {

    private _client: BotClient;
    private _commandRateLimit: CommandRateLimit;
    private _redis: RedisProvider;

    public constructor(client: BotClient) {
        this._client = client;
        this._commandRateLimit = new CommandRateLimit([5, 10 * 100 * 30]);
        this._redis = RedisProvider.instance();
        registerListeners(this._client, this);
    }

    private async _findWhale(message: Message): Promise<void> {
        if (message.toString().match(/O[\\?_]+O/)) {

            let face: string = message.toString().match(/O[\\?_]+O/)[0];

            let keyExist = await this._redis.keyExists(`whale::${message.roomId}`);

            if (keyExist[0] === 0) {
                this._redis.setExpire(`whale::${message.roomId}`, '', 180);
                message.replied = true;

                return this._client.chat.sendMessage(face, message.roomId);
            }
        }
    }

    @on('message')
    private async _onMessage(message: Message): Promise<void> {
        if (message.user.id === this._client.clientUser.id) return;
        
       await this._findWhale(message);
    }
}