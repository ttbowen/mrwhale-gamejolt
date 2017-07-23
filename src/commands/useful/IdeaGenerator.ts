import { Message } from 'gamejolt.js';
import { Command, Permissions } from 'gamejolt-bot';

import * as fs from 'fs';
import * as path from 'path';
import * as seedrandom from 'seedrandom';

export default class extends Command {
    public constructor() {
        super({
            name: 'gameidea',
            description: 'Generate a random game idea.',
            usage: '<prefix> gameidea',
            type: 'useful'
        });
        this.setSeed();
    }

    private rng: seedrandom.prng;
    private ideaData: any;

    private setSeed(): void {
        this.rng = seedrandom();
    }

    private async loadGenres(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            fs.readFile(path.join(__dirname, '../../data/static/Genres.json'), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    public async invoke(message: Message): Promise<void> {
        this.ideaData = await this.loadGenres();

        let genres: any = this.ideaData.genres[0];

        let name: string = genres.name[Math.floor(this.rng() * genres.name.length)];
        let action: string = genres.actions[Math.floor(this.rng() * genres.actions.length)];
        let item: string = genres.items[Math.floor(this.rng() * genres.items.length)];
        let location: string = genres.locations[Math.floor(this.rng() * genres.locations.length)];
        let goal: string = genres.goals[Math.floor(this.rng() * genres.goals.length)];

        return message.reply(`A ${name} game, where you ${action} ${item} ${location} ${goal}`);
    }
}