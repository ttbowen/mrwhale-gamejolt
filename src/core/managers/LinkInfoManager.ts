import { Message, Game, GameOverview } from 'gamejolt.js';
import { ListenerDecorators } from 'gamejolt-bot';
import { BotClient } from '../BotClient';
import { YoutubePlugin } from '../plugins/YouTube';
import { formatYouTubeVideo, formatGameInfo } from '../util/FormatUtils';

const { on, registerListeners } = ListenerDecorators;


/**
 * 
 * Dispatches content information about various URLs posted
 * in chat
 * @export
 * @class LinkInfoHandler
 */
export class LinkInfoManager {

    /**
     * Creates an instance of LinkInfoDispatcher.
     * @param {BotClient} client 
     * @memberof LinkInfoDispatcher
     */
    public constructor(client: BotClient) {
        this._client = client;
        this._yt = new YoutubePlugin();

        registerListeners(this._client, this);
    }

    private _client: BotClient;
    private _yt: YoutubePlugin;

    @on('message')
    private async _onMessage(message: Message): Promise<void> {
        const ytregex = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;

        // Check if this is a youtube link
        if (message.toString().match(ytregex)) {
            const urlParts = ytregex.exec(message.toString());
            const video = await this._yt.getById(urlParts[urlParts.length - 1]);

            if (video || video.items || video.items.length) {
                const item = video.items[0];
                const videoResponse: string = formatYouTubeVideo(item);
                if (videoResponse) {
                    return this._client.chat.sendMessage(videoResponse, message.roomId);
                }
            }
        }

        const gameregex = /(http:|https:)?\/\/(www\.)?(gamejolt.com)\/(games)\/[^\/]+\/(\d+)/;

        // Check if this is a Game Jolt game link
        if (message.toString().match(gameregex)) {

            const matches: RegExpExecArray = gameregex.exec(message.toString());
            if (matches) {
                const gameId = parseInt(matches[matches.length - 1]);
                const game: Game = await this._client.api.getGame(gameId);
                const overview: GameOverview = await this._client.api.getGameOverview(gameId);
                const gameResponse: string = formatGameInfo(game, overview);
                if (gameResponse) {
                    return this._client.chat.sendMessage(gameResponse, message.roomId);
                }
            }
        }
    }
}