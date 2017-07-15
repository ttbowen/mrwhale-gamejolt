import { Message, FriendRequest } from 'gamejolt.js';
import { ListenerDecorators } from 'gamejolt-bot';
import { BotClient } from '../BotClient';
import { Timer } from '../Timer';

const { on, registerListeners } = ListenerDecorators;


/**
 * 
 * Fetches and manages all friend requests for bot client
 * @export
 * @class FriendRequestManager
 */
export class FriendRequestManager {

    private _client: BotClient;
    private _friendRequestsQueue: FriendRequest[];
    private _timer: Timer;
    
    /**
     * Creates an instance of FriendRequestManager.
     * @param {BotClient} client 
     * @memberof FriendRequestManager
     */
    public constructor(client: BotClient) {
        this._client = client;
        this._timer = new Timer(this._client, 'friendaccept', 5, async () => this._accept());
        this._friendRequestsQueue = [];
        
        registerListeners(this._client, this);
    }
    
    @on('friend-requests')
    private _onFriendRequest(requests: FriendRequest[]) {
        this._friendRequestsQueue = requests;
         
        if (this._timer) {
            this._timer.destroy();
            this._timer.createTimer();
        }
    }

    private async _accept(): Promise<void> {
        if (this._friendRequestsQueue.length > 0) {
            this._friendRequestsQueue.shift().accept();
        }
        else this._timer.destroy();
    }
}