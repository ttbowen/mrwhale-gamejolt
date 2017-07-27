import * as fs from 'fs';
import * as path from 'path';

import { Difficulty } from './Difficulty';

const availableLetters: string = 'abcdefghijklmnopqrstuvwzyz';

export class Game {

    public constructor(ownerId: number) {

        this._lettersGuessed = '';
        this._lettersMatched = '';
        this._numLettersMatched = 0;
        this._lives = 5;
        this._isGameOver = false;
        this._won = false;
        this.ownerId = ownerId;
    }

    private _lettersGuessed: string;
    private _lettersMatched: string;
    private _numLettersMatched: number;
    private _lettersToShow: string[];
    private _currentWord: string;
    private _lives: number;
    private _won: boolean;
    private _isGameOver: boolean;
    private _difficulty: Difficulty | string;
    private _startTime: number;

    public started: boolean;
    public readonly ownerId: number;

    public get lives(): number {
        return this._lives;
    }

    public get won(): boolean {
        return this._won;
    }

    public get startTime(): number {
        return this._startTime;
    }

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    public guess(letter: string): string {
        if (this._isGameOver) return 'Game is over. You cannot make another guess.';

        letter = letter.trim().toLowerCase();

        if (availableLetters.indexOf(letter) > - 1) {
            if ((this._lettersGuessed && this._lettersGuessed.indexOf(letter) > -1) ||
                (this._lettersMatched && this._lettersMatched.indexOf(letter) > -1)) {

                return `Letter **${letter}** has already been guessed`;
            }
            else if (this._currentWord.indexOf(letter) > - 1) {
                for (let i = 0; i < this._currentWord.length; i++) {
                    if (this._currentWord.charAt(i) === letter) {
                        this._numLettersMatched++;
                    }
                }
                this._lettersMatched += letter;
                if (this._numLettersMatched === this._currentWord.length) return this.gameOver(true);

                let output: string = 'Correct guess.\n';
                output += this._printLetters();
                return output;
            }
            else {
                this._lettersGuessed += letter;
                this._lives--;
                if (this._lives === 0) return this.gameOver(false);
                return `Incorrect. You have **${this._lives}** lives remaining.`;
            }
        }
        else return 'Please enter a valid letter';
    }

    private _printLetters(): string {
        let output: string = '';
        let lettersLeft: string[] = this.getLettersToShow();

        for (let i = 0; i < this._currentWord.length; i++) {
            output += lettersLeft[i] + ' ';
        }
        return output;
    }

    public gameOver(won?: boolean): string {
        this._won = won;
        this._isGameOver = true;

        if (won) {
            return this._printLetters() + '\n\rYou win!';
        } else {
            return 'You lose. Your man has been hanged. :-(';
        }
    }

    public getLettersToShow(): string[] {
        let output: string[] = [];

        for (let i = 0; i < this._currentWord.length; i++) {
            output[i] = '\\_';
        }

        for (let i = 0; i < this._lettersMatched.length; i++) {
            let char: string = this._lettersMatched.charAt(i);

            for (let j = 0; j < this._currentWord.length; j++) {
                if (this._currentWord.charAt(j) === char) {
                    output[j] = char.toUpperCase();
                }
            }
        }
        return output;
    }

    private async loadWords(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            fs.readFile(path.join(__dirname, '../../data/static/Hangman.json'), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    public async start(): Promise<boolean> {

        // Load the dictionary and choose random word
        let dictionary = await this.loadWords();
        let word: string = dictionary[Math.floor(Math.random() * dictionary.length)];

        if (!word) {
            return false
        }
        this._currentWord = word;
        console.log(this._currentWord);
        this._startTime = Date.now();
        return true;
    }
}