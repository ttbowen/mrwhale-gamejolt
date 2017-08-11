import { Message, User } from 'gamejolt.js';
import { ListenerDecorators, Collection, RedisProvider } from 'gamejolt-bot';
import { BotClient } from '../BotClient';
import { Timer } from '../Timer';
import { Level } from '../types/Level';
import { LevelMap } from '../types/LevelMap';

const { on, registerListeners } = ListenerDecorators;


/**
 * 
 * Manages user levelling 
 * @export
 * @class LevelManager
 */
export class LevelManager {

    private _botClient: BotClient;

    private readonly _redis: RedisProvider;
    private readonly _minExpPerMessage: number;
    private readonly _maxExpPerMessage: number;
    private readonly _timeForExp: number;
    private _lastMessageMap: Collection<number, number>;

    /**
     * 
     * Creates an instance of LevelManager.
     * @param {BotClient} client 
     * @memberof LevelManager
     */
    public constructor(client: BotClient) {
        this._botClient = client;
        this._redis = RedisProvider.instance();

        this._minExpPerMessage = 15;
        this._maxExpPerMessage = 25;
        this._timeForExp = 60 * 1000;
        this._lastMessageMap = new Collection<number, number>();

        registerListeners(this._botClient, this);
    }

    /**
     * 
     * Calculates level experience
     * @static
     * @param {number} n 
     * @returns {number} 
     * @memberof LevelManager
     */
    public static getLevelExp(n: number): number {
        return 5 * n * n + 50 * n + 100;
    }

    /**
     * Calculate the level from experience 
     * @static
     * @param {number} exp 
     * @memberof LevelManager
     */
    public static getLevelFromExp(exp: number): number {
        let level: number = 0;
        let remainingExp: number = exp;

        while (remainingExp >= LevelManager.getLevelExp(level)) {
            remainingExp -= LevelManager.getLevelExp(level);
            level++;
        }
        return level
    }

    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    @on('message')
    private async _onMessage(message: Message): Promise<void> {

        if (message.user.id === this._botClient.clientUser.id)
            return;

        if (await this._botClient.isBlacklisted(message.user, message.roomId))
            return;

        const lastMessage: number = await this._lastMessageMap.get(message.user.id) || -Infinity;

        if (Date.now() - lastMessage >= this._timeForExp) {
            this._lastMessageMap.set(message.user.id, Date.now());

            let player = await this._redis.hget(`player::${message.user.id}`);

            player = player[0];

            if (player) {
                player.experience = parseInt(player.experience);
                player.experienceNext = parseInt(player.experienceNext);
                player.level = parseInt(player.level);
                player.totalExperience = parseInt(player.totalExperience);
            }

            const entry: Level = player ||
                { totalExperience: 0, experience: 0, experienceNext: LevelManager.getLevelExp(0), level: 0 }

            let level: number = entry.level;
            let exp: number = entry.experience;
            let expNext: number = LevelManager.getLevelExp(level);
            let totalExp: number = entry.totalExperience;
            let levelUp: boolean = false;

            const expGain: number = this.getRandomInt(this._minExpPerMessage, this._maxExpPerMessage);

            totalExp += expGain;
            exp += expGain;

            let newLevel = LevelManager.getLevelFromExp(exp);

            if (level != newLevel) {
                message.reply(`Congrats. You just advanced to **Level ${newLevel}** !`);
            }
            let levelEntry = { totalExperience: totalExp, experience: exp, level: newLevel, experienceNext: expNext }
            this._redis.hmset(`player::${message.user.id}`, levelEntry);
        }
    }
}