import { RedisProvider } from 'gamejolt-bot';
import { BotClient } from './BotClient';

export class Timer {
    private _client: BotClient;
    
    public name: string;
    private _timer: NodeJS.Timer;
    private _ticks: number;
    private _interval: number;
    private _callback: () => Promise<void>;
    

    /**
     * Creates an instance of Timer.
     * @param {BotClient} client 
     * @param {string} name 
     * @param {number} interval 
     * @param {() => Promise<void>} callback 
     * @memberof Timer
     */
    public constructor(client: BotClient, name: string, interval: number, callback: () => Promise<void>) {
        this.name = name;
        this._client = client;
        this._interval = interval;
        this._callback = callback;
        this._ticks = 0;
        this.createTimer();
    }
    

    /**
     * Create a new timer
     * @memberof Timer
     */
    public createTimer(): void {
        this._timer = this._client.setInterval(async () => 
        {
            if (this._ticks >= this._interval) this._ticks = 0;
            if (this._ticks++ === 0) this._callback().catch(console.error);      
        }, 1000);
    }
    

    /**
     * Destroy the timer
     * @memberof Timer
     */
    public destroy(): void {
        this._client.clearInterval(this._timer);
        this._ticks = 0;
        this._timer = null;
    }  
}