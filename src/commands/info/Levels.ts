import { Message, SiteUser } from 'gamejolt.js';
import { Command, Permissions, Collection } from 'gamejolt-bot';

export default class extends Command {
    public constructor() {
        super({
            name: 'levels',
            description: 'Get 10 ten players.',
            usage: '<prefix> levels',
            type: 'info',
            pmOnly: true,
            rateLimit: [ 2, 10 * 100 * 30  ],
            aliases: ['level', 'lvl', 'leaderboard']
        });
    }

    public async invoke(message: Message): Promise<void> {

        let playerKeys = await this._redis.keys('player::*');
        playerKeys = playerKeys[0];

        let stats = new Collection<string, any>();

        for (let p of playerKeys) {
            let obj = await this._redis.hgetall(p);

            obj[0].player = p;
            obj[0].experience = parseInt(obj[0].experience);
            obj[0].experienceNext = parseInt(obj[0].experienceNext);
            obj[0].level = parseInt(obj[0].level);
            obj[0].totalExperience = parseInt(obj[0].totalExperience);

            stats.set(p, obj[0]);
        }
        let players = stats.array().sort((a, b) => a.experience - b.experience).reverse();

        players = players.slice(0, 5);

        let response: string = '\n';

        for (let i = 0; i < 5; i++) {
            let rank: number = i + 1;
            let id: number = parseInt(players[i].player.substring(8, players[i].player.length));
            let user: SiteUser = await this.client.api.getUser(id);
            response += `${rank}. [@${user.username}](@${user.username}) - Level: ${players[i].level} (${players[i].experience} EXP) \n`;
        }
        return message.reply(response);
    }
}