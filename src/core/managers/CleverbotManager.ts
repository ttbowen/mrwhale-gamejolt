import { Message, FriendRequest } from 'gamejolt.js';
import { ListenerDecorators, CommandRateLimiter, Command } from 'gamejolt-bot';
import { BotClient } from '../BotClient';
import { CleverbotPlugin } from '../plugins/Cleverbot';

const { on, registerListeners } = ListenerDecorators;

/**
 * 
 * Use cleverbot to chat to users
 * @export
 * @class CleverbotManager
 */
export class CleverbotManager {

    private _client: BotClient;
    private _cleverbot: CleverbotPlugin;
    private _rateLimit: CommandRateLimiter;
    
    /**
     * Creates an instance of ChatManager.
     * @param {BotClient} client 
     * @memberof ChatManager
     */
    public constructor(client: BotClient) {
        this._client = client;
        this._cleverbot = new CleverbotPlugin();
        this._rateLimit = new CommandRateLimiter([5, 10 * 1000 * 30], false);

        registerListeners(this._client, this);
    }

    private async hasCommand(message: Message): Promise<boolean> {
        const prefixes: string[] = [`!`];
        const pm: boolean = message.room.type === 'pm';

        if (await this._client.getPrefix(message.roomId)) prefixes.push(await this._client.getPrefix(message.roomId));

        let prefix: string = prefixes.find(a => message.contentRaw.trim().startsWith(a));

        if (typeof prefix === 'undefined' && message.isMentioned) prefix = message.contentRaw.split(' ')[0];
        if (pm && typeof prefix === 'undefined') prefix = '';
        if (typeof prefix === 'undefined' && !pm) return false;

        const commandName: string = message.contentRaw.trim()
            .slice(prefix.length).trim()
            .split(' ')[0];

        const command: Command<BotClient> = this._client.commands.find(c =>
            c.name.toLowerCase() === commandName.toLowerCase()
            || c.aliases.map(a => a.toLowerCase()).includes(commandName));

        if (command) return true;
        else return false;
    }

    @on('message')
    private async _onMessage(message: Message): Promise<void> {

        if (message.user.id === this._client.clientUser.id) return;

        if (!this._rateLimit.get(message, message.user).call()) return;

        let mode: string = await this._client.getCurrentMode(message.roomId);
        
        const pm: boolean = message.room.type === 'pm';
        const hasCommand: boolean = await this.hasCommand(message);
        
        if ((message.isMentioned && mode === 'chatty' && !hasCommand) || (!hasCommand && pm)) {

            let response: string = await this._cleverbot.speak(message);
            return message.reply(response);
        }
    }
}