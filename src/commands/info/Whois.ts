import { Message, SiteUser } from 'gamejolt.js';
import { Command, Permissions, resolve, using } from 'gamejolt-bot';

import * as moment from 'moment';

export default class extends Command {
    public constructor() {
        super({
            name: 'whois',
            description: 'Get information about a user.',
            usage: '<prefix> whois <user>',
            type: 'info',
            pmOnly: true
        });
    }
    
    @using(resolve({ '<user>': 'SiteUser' }))
    public async invoke(message: Message, [user]: [SiteUser]): Promise<void> {
        if (!user) return message.reply('Could not find this user.');

        let output: string = `\n\rUser Id: ${user.id} \n
             \rUsername: ${user.username} \`${user.dogTag}\` \n
             \rDisplay Name: ${user.displayName} \n
             \rType: ${user.type} \n
             \rExperience: ${user.experience} EXP \n
             \rNext level in: ${user.experienceNext} EXP \n
             \rLevel: ${user.level} \n
             \rJoined: ${moment(user.joined).fromNow()} \n
             \rLastOnline: ${moment(user.lastOnline).fromNow()} \n
             \rWebsite: ${user.website} \n
             \rStatus: ${user.status == 1 ? 'Active' : 'Banned'} \n`
        
        return message.reply(output);
    }
}