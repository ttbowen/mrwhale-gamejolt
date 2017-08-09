import { Message, User } from 'gamejolt.js';
import {
    ListenerDecorators,
    Client,
    LogLevel
} from 'gamejolt-bot';

import * as moment from 'moment';
import * as rooms from './types/DefaultRooms';

import { ManagerLoader } from './ManagerLoader';
import { Winston } from './Winston';

const { on, once } = ListenerDecorators;


/**
 * 
 * Main bot class.
 * @export
 * @class BotClient
 * @extends {Client}
 */
export class BotClient extends Client {

    private _loader: ManagerLoader;
    private _timeouts: Set<NodeJS.Timer>;
    private _intervals: Set<NodeJS.Timer>;
    private _winston: Winston;

    public constructor() {
        super({
            name: 'mrwhale',
            ownerIds: [15071],
            commandsDir: './lib/commands',
            configPath: './configs/config.json',
            defaultRooms: rooms.default,
            rateLimitInterval: [4, 10 * 100 * 60],
            logLevel: LogLevel.LOG,
            version: require('../../package.json').version
        });
        this._winston = new Winston({ logDir: 'logs', logFile: `${moment().format('YYYY-MM-DD')}.log` });
        this._init();
    }

    get winston() {
        return this._winston;
    }

    private _init(): void {
        this._timeouts = new Set();
        this._intervals = new Set();
    }

    @once('client-ready')
    private async _onClientReady(): Promise<void> {

        this._winston.logger.log('info', `${this.name} is ready. Client connected as ${this.clientUser.displayName}.`);

        this._loader = new ManagerLoader(this);
    }

    @on('message')
    private async _onMessage(message: Message): Promise<void> {

        this.chat.logMessage(message);

        let ts: string = moment().format('hh:mm');
        let user: User = message.user;
        let content: string = message.toString();

        this._winston.logger.log('info', `Room: ${message.roomId} | ${user.username} (${user.id}) - ${content}`);
    }

    public setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer {
        const timeout = setTimeout(() => {
            callback(...args);
            this._timeouts.delete(timeout);
        }, ms);
        this._timeouts.add(timeout);
        return timeout;
    }

    public clearTimeout(timeout: NodeJS.Timer): void {
        clearTimeout(timeout);
        this._timeouts.delete(timeout);
    }

    public setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer {
        const interval = setInterval(callback, ms, ...args);
        this._intervals.add(interval);
        return interval;
    }

    public clearInterval(interval: NodeJS.Timer) {
        clearInterval(interval);
        this._intervals.delete(interval);
    }

}