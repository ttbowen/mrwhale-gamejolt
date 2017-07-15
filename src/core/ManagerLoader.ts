import { BotClient } from './BotClient';
import { CleverbotManager } from './managers/CleverbotManager';
import { FriendRequestManager } from './managers/FriendRequestManager';
import { LinkInfoManager } from './managers/LinkInfoManager';
import { Policer } from './managers/Policer';
import { ReplyManager } from './managers/ReplyManager';
import { NotificationManager } from './managers/NotificationManager';

/**
 * 
 * Loads all bot managers
 * @export
 * @class ManagerLoader
 */
export class ManagerLoader {

    public readonly managers: Managers;

    public constructor(client: BotClient) {
        this._client = client;
        this.managers = {
            cleverbotManager: new CleverbotManager(this._client),
            friendRequestManager: new FriendRequestManager(this._client),
            infoManager: new LinkInfoManager(this._client),
            policer: new Policer(this._client),
            replyManager: new ReplyManager(this._client),
            notificationManager: new NotificationManager(this._client)
        }
    }
    private _client: BotClient;
}

type Managers = {
    cleverbotManager: CleverbotManager;
    friendRequestManager: FriendRequestManager;
    infoManager: LinkInfoManager;
    policer: Policer;
    replyManager: ReplyManager;
    notificationManager: NotificationManager;
}