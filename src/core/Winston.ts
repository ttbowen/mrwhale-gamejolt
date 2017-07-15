import * as fs from 'fs';
import * as winston from 'winston';

const env = process.env.NODE_ENV || 'development';
const tsFormat = () => (new Date()).toLocaleTimeString();


/**
 * 
 * Helper class for Winston logger
 * @export
 * @class Winston
 */
export class Winston {

    private _winston: winston.LoggerInstance;

    public constructor(options: any) {
        this.setup(options);
    }

    public setup(options: any): void {
        if (!fs.existsSync(options.logDir)) fs.mkdirSync(options.logDir);

        this._winston = new (winston.Logger)({
            transports: [
                new winston.transports.Console({ colorize: true }),
                new winston.transports.File({
                    filename: `${options.logDir}/${options.logFile}`,
                    level: env === 'development' ? 'debug' : 'info',
                    timestamp: tsFormat,
                    datePattern: 'yyyy-MM-dd'
                })
            ]
        });
    }

    get logger(): winston.LoggerInstance {
        return this._winston;
    }
}