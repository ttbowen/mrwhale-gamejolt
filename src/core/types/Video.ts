import { VideoSnippet } from './VideoSnippet';
import { VideoStatistics } from './VideoStatistics';

/**
 * Represents a YouTube video
 * @typedef {Video}
 */
export type VideoItem = {
    snippet: VideoSnippet;
    statistics: VideoStatistics;
}