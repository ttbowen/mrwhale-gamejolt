import { Message } from 'gamejolt.js';
import { Command, Permissions, Collection } from 'gamejolt-bot';

export default class extends Command {
    public constructor() {
        super({
            name: 'rank',
            description: 'Get a player info and rank.',
            usage: '<prefix> rank',
            type: 'info'
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

        for (let i = 0; i < players.length; i++) {
            if (players[i].player === `player::${message.user.id}`) {
                let rank: number = i + 1;

                let response: string =  `You are ranked **${rank}/${players.length}**. Experience breakdown:\n\r`

                response += `**Experience:** ${players[i].experience}\n\r`;
                response += `**Experience Next:** ${players[i].experienceNext}\n\r`;
                response += `**Level:** ${players[i].level}\n\r`;
                return message.reply(response)
            }
        }
    }
}