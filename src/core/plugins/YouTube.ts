import * as Bluebird from 'bluebird';
import * as YouTube from 'youtube-node';
import * as nconf from 'nconf'

/**
 * Manages the Youtube API
 * @export
 * @class YoutubePlugin
 */
export class YoutubePlugin {

    private youtube: YouTube;

    public constructor() {
        this.youtube = new YouTube();
        this.youtube.setKey(nconf.get('youtube_api'));
        this.youtube.addParam('type', 'video');
    }

    /**
     * Search YouTube for a video
     * @param {string} query 
     * @returns {Promise<any>} 
     * @memberof YoutubePlugin
     */
    public async search(query: string): Promise<any> {
        let searchYoutube = Bluebird.promisify(this.youtube.search);
        return searchYoutube(query, 1).then((result) => {
            if (!result || !result.items || result.items.length < 1)
                return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

            return `http://www.youtube.com/watch?v=${result.items[0].id.videoId}`;
        });
    }


    /**
     * Get a YouTube video by id
     * @param {string} id 
     * @returns {Promise<any>} 
     * @memberof YoutubePlugin
     */
    public async getById(id: string): Promise<any> {
        let searchYoutube = Bluebird.promisify(this.youtube.getById);
        return searchYoutube(id).then((result) => {
            if (!result)
                return 'Could not this fetch video.';
            return result;
        });
    }
}