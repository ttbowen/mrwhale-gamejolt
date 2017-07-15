import { Game, GameOverview } from 'gamejolt.js';
import { Util } from 'gamejolt-bot';

import { VideoItem } from '../types/video';


/**
 * 
 * Format YouTube video data for displaying in chat
 * @export
 * @param {any} video 
 * @returns {string} 
 */
export function formatYouTubeVideo(video: VideoItem): string {
    if (!video || !video.snippet) return;
    
    const data = {
        title: Util.truncate(25, video.snippet.title),
        channel: Util.truncate(25, video.snippet.channelTitle),
        views: Util.formatNumber(video.statistics.viewCount),
        likes: Util.formatNumber(video.statistics.likeCount),
        dislikes: Util.formatNumber(video.statistics.dislikeCount)
    }
    return ` *${data.title} By ${data.channel} - Views: ${data.views}, Likes: ${data.likes} Dislikes: ${data.dislikes}* `;
}

/**
 * 
 * Format Game Jolt game data for displaying in chat
 * @export
 * @param {any} game 
 * @param {any} overview 
 * @returns 
 */
export function formatGameInfo(game: Game, overview: GameOverview): string {
    if (!game || !game.developer || !overview) return;

    const data = {
        title: Util.truncate(25, game.title),
        author: Util.truncate(25, game.developer.displayName),
        rating: Math.floor(game.avgRating),
        follow: Util.formatNumber(game.followerCount) || 0,
        category: game.categoryHuman,
        maturity: game.tigrsAge,
        views: Util.formatNumber(overview.profileCount),
        plays: Util.formatNumber(overview.downloadCount + overview.playCount)
    }
    return `*${data.title} By ${data.author} - ${(data.rating) ? ` Rating: ${data.rating},` : ` Followers: ${data.follow},`} Views: ${data.views}, Plays: ${data.plays},  Maturity: ${data.maturity}, Category: ${data.category}*`;
}