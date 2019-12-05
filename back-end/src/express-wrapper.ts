import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';

import * as uuidv1 from 'uuid/v1';
import * as socketIO from 'socket.io';

import { Board } from '../../front-end/src/app/models/board';

const  allowedDomains = [
	'http://localhost:4200',
	'http://www.williamrobertfunk.com'
];

export class ExpressWrapper {
    private _app: Express = express();
    private _server = new http.Server(this._app);
    private _io = socketIO(this._server);
    private _port: number = 4444;
    private _queue: { roomCode: string, playerId: string } = null;
    private _rooms: { [key: string]: { previousBoard: Board, player1: string; player2: string } } = {};
    private _socket;

	constructor() {
        this._io.on("connection", socket => {
            this._socket = socket;

            this._socket.on('disconnect', this._leaveRoom.bind(this));
            this._socket.on('new player', this._joinRoom.bind(this));
            this._socket.on('movement', this._makeMove.bind(this));
        });

        this._server.listen(this._port);
		console.log(`app running on port: ${this._port}`);
    }
    
    private _joinRoom(data): void {
        console.log('new player called', data.roomCode, data.player, data.id);
        // If the room code isn't registered yet, set it up.
        if (data.roomCode && !this._rooms[data.roomCode]) {
            this._rooms[data.roomCode] = {
                previousBoard: null,
                player1: null,
                player2: null
            };
        } else if (!data.roomCode) {
            console.log('No room code provided for player registration.');
            if (this._queue && this._queue.roomCode && this._queue.playerId) {
                this._rooms[this._queue.roomCode] = {
                    previousBoard: null,
                    player1: this._queue.playerId,
                    player2: data.id
                };
            } else {
                this._queue = {
                    roomCode: uuidv1(),
                    playerId: data.id
                };
            }
            console.log('Room Code: ', this._rooms[this._queue.roomCode]);
            this._io.emit('joined room', {
                id: data.id,
                roomFull: (this._rooms[this._queue.roomCode] && !!this._rooms[this._queue.roomCode].player1 && !!this._rooms[this._queue.roomCode].player2),
                playerNumber: (this._rooms[this._queue.roomCode] && this._rooms[this._queue.roomCode].player2) ? 2 : 1,
                roomCode: this._queue.roomCode
            });
            return;
        }
        // Register the player that is stated in the data packet, if it's there.
        if (data.player) {
            this._rooms[data.roomCode][`player${data.player}`] = data.id;
            this._io.emit('joined room', { id: data.id, roomFull: (!!this._rooms[data.roomCode].player1 && !!this._rooms[data.roomCode].player2), playerNumber: data.player });
            return;
        }
        // If player number choice is not included in data packet, assign based off availability.
        if (this._rooms[data.roomCode].player1 && !this._rooms[data.roomCode].player2) {
            this._rooms[data.roomCode].player2 = data.id;
            this._io.emit('joined room', { id: data.id, roomFull: (!!this._rooms[data.roomCode].player1 && !!this._rooms[data.roomCode].player2), playerNumber: 2 });
        } else if (this._rooms[data.roomCode].player2 && !this._rooms[data.roomCode].player1) {
            this._rooms[data.roomCode].player1 = data.id;
            this._io.emit('joined room', { id: data.id, roomFull: (!!this._rooms[data.roomCode].player1 && !!this._rooms[data.roomCode].player2), playerNumber: 1 });
        } else {
            console.error(`Player (${data.id}) trying to register for room (${data.roomCode}), but all player slots are full.`);
        }
    }
    
    private _leaveRoom(data): void {
        console.log('leaving room');
        Object.keys(this._rooms).forEach(roomCode => {
            if (this._rooms[roomCode].player1 === data.id) {
                this._rooms[roomCode].player1 = null;
            }
            if (this._rooms[roomCode].player2 === data.id) {
                this._rooms[roomCode].player2 = null;
            }
            if (!this._rooms[roomCode].player1 && !this._rooms[roomCode].player2) {
                console.log('leaving room');
                delete this._rooms[roomCode];
            }
        });
    }
    
    private _makeMove(data): void {
        this._rooms[data.roomCode].previousBoard = data.board;
        this._io.emit('move made', { board: data.board, id: data.id, roomCode: data.roomCode });
    }
}