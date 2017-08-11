import { Level } from './Level';

/**
 * Represents a Level map for room users
 * @export
 * @interface LevelMap
 */
export interface LevelMap {
    [userId: number]: Level;
}