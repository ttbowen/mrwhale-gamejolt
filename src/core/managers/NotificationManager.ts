import {
    Message,
    User,
    FriendRequest,
    SiteUser,
    Markdown,
    PublicRooms
} from 'gamejolt.js';

import { ListenerDecorators, RedisProvider, Collection } from 'gamejolt-bot';
import { BotClient } from '../BotClient';

import * as friendAddResponses from '../../data/friendAdd';
import * as friendRemoveResponses from '../../data/friendRemove';
import * as mutedResponses from '../../data/muted';
import * as unmutedResponses from '../../data/unmuted';
import * as botUnmuteResponses from '../../data/botUnmutes';
import * as bannedResponses from '../../data/userBan';
import * as userUpdatedResponses from '../../data/userUpdated';
import * as userMod from '../../data/mod';
import * as botMod from '../../data/botMod';

const { on, registerListeners } = ListenerDecorators;

/**
 * 
 * Dispatches notifications and announcements on various chat events
 * @export
 * @class NotificationManager
 */
export class NotificationManager {

    private _client: BotClient;
    private _redis: RedisProvider;
    private _countSinceLastNotification: Collection<number, number>;

    /**
     * Creates an instance of NotificationManager.
     * @param {BotClient} client 
     * @memberof NotificationManager
     */
    public constructor(client: BotClient) {
        this._client = client;
        this._redis = RedisProvider.instance();
        this._countSinceLastNotification = new Collection<number, number>();
        registerListeners(this._client, this);
    }

    private async sendNotification(notification: string, response: string, roomId: number): Promise<void> {

        if (await this._client.isQuiet(roomId)) return;

        let keyExist = await this._redis.keyExists(`${notification}::${roomId}`);

        if (keyExist[0] === 0) {
            this._redis.setExpire(`${notification}::${roomId}`, '', 3600);
            return this._client.chat.sendMessage(response, roomId);
        }
    }

    @on('user-muted')
    private async _onUserMuted(userId: number, roomId: number, isGlobal: boolean, user?: User): Promise<void> {
        let index: number;
        let response: string = '';
        let mode: string = await this._client.getCurrentMode(roomId);
        
        if (user) {

            // Fetch user from api as status may not have been updated yet
            let u: SiteUser = await this._client.api.getUser(user.username);

            if (u.status == 1) {
                index = Math.floor(Math.random() * mutedResponses[mode].length);
                if (mutedResponses[mode][index])
                    response = mutedResponses[mode][index].replace(/<<NAME>>/g, Markdown.bold(user.displayName));
            }
            else {
                index = Math.floor(Math.random() * bannedResponses[mode].length);
                if (bannedResponses[mode][index])
                    response = bannedResponses[mode][index].replace(/<<NAME>>/g, Markdown.bold(user.displayName));
            }
        } else {
            response = `User with Id ${Markdown.bold(userId.toString())} got muted.`;
        }
        this.sendNotification(`muted:${userId}`, response, roomId);
    }

    @on('user-unmuted')
    private async _onUserUnmuted(userId: number, roomId: number, isGlobal: boolean, user?: User): Promise<void> {

        let mode: string = await this._client.getCurrentMode(roomId);
        let index = Math.floor(Math.random() * unmutedResponses[mode].length);
        let response: string = '';

        if (user) {
            if (unmutedResponses[mode][index])
                response = unmutedResponses[mode][index].replace(/<<NAME>>/g, Markdown.bold(user.displayName));
        } else {
            response = `User with Id ${Markdown.bold(userId.toString())} got unmuted.`;
        }

        if (userId === this._client.chat.me.id) {
            index = Math.floor(Math.random() * botUnmuteResponses[mode].length);
            if (botUnmuteResponses[mode][index])
                response = botUnmuteResponses[mode][index];
        }
        this.sendNotification(`unmuted:${userId}`, response, roomId);
    }

    @on('friend-add')
    private async _onFriendAdd(friend: User): Promise<void> {
        let mode: string = await this._client.getCurrentMode(PublicRooms.lobby);
        let index = Math.floor(Math.random() * friendAddResponses[mode].length);
        let response = '';

        if (friend) {
            if (friend.displayName) {
                if (friendAddResponses[mode][index])
                    response = friendAddResponses[mode][index].replace(/<<NAME>>/g, Markdown.bold(friend.displayName));
            }
        }
        this.sendNotification(`friendadd:${friend.id}`, response, PublicRooms.lobby);
    }

    @on('friend-remove')
    private async _onFriendRemove(userId: number, removed?: User): Promise<void> {

        let mode: string = await this._client.getCurrentMode(PublicRooms.lobby);

        let index = Math.floor(Math.random() * friendRemoveResponses[mode].length);
        let response = '';

        if (removed) {
            if (removed.displayName) {
                if (friendRemoveResponses[mode][index])
                    response = friendRemoveResponses[mode][index].replace(/<<NAME>>/g, Markdown.bold(removed.displayName));
            }
        }
        this.sendNotification(`friendremoved:${userId}`, response, PublicRooms.lobby);
    }

    @on('role-set')
    private async _onRoleSet(data: any): Promise<void> {
        console.log(data);
    }

    @on('user-updated')
    private async _onUserUpdated(oldUser: User, user: User): Promise<void> {

        let mode: string = await this._client.getCurrentMode(PublicRooms.lobby);
        let index = Math.floor(Math.random() * userUpdatedResponses.default.length);
        let response = '';

        if (oldUser.displayName && user.displayName) {
            if (oldUser.displayName !== user.displayName) {
                response = userUpdatedResponses.default[index].replace(/<<NAME>>/g, Markdown.bold(user.displayName));
                response = response.replace(/<<NEWNAME>>/g, Markdown.bold(user.displayName));
            }
            else if (oldUser.username !== user.username) {
                response = userUpdatedResponses.default[index].replace(/<<NAME>>/g, oldUser.username);
                response = response.replace(/<<NEWNAME>>/g, Markdown.bold(user.username));
            }
        }
        this.sendNotification(`userupdated:${user.id}`, response, PublicRooms.lobby);
    }
}