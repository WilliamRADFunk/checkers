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
    private _people: number = 0;
    private _port: number = 4444;
    private _queue: { roomCode: string, playerId: string } = null;
    private _rooms: { [key: string]: { previousBoard: Board, player1: string; player2: string } } = {};
    private _socket;

	constructor() {
        this._io.on("connection", socket => {
            this._socket = socket;
            this._people++;
            this._io.emit('updated people count', { people: this._people });

            this._socket.on('disconnect', (data) => {
                console.log('disconnect', data.id);
                this._leaveRoom(data);
            });
            this._socket.on('quit', (data) => {
                console.log('quit', data.id);
                this._leaveRoom(data);
            });
            this._socket.on('new player', this._joinRoom.bind(this));
            this._socket.on('movement', this._makeMove.bind(this));
        });

        this._server.listen(this._port);
		console.log(`app running on port: ${this._port}`);
    }
    
    private _joinRoom(data): void {
        console.log('new player called', `roomCode: (${data.roomCode}), playerNumber: (${data.player}), id: (${data.id})`);
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
                console.log('~~~ 1 ~~~', 'Filling room with second player');
                this._rooms[this._queue.roomCode] = {
                    previousBoard: null,
                    player1: this._queue.playerId,
                    player2: data.id
                };
            } else {
                console.log('~~~ 2 ~~~', 'Setting up room for first player');
                this._queue = {
                    roomCode: uuidv1(),
                    playerId: data.id
                };
            }
            const isRoomFull = (this._rooms[this._queue.roomCode] && !!this._rooms[this._queue.roomCode].player1 && !!this._rooms[this._queue.roomCode].player2);
            console.log('Room Code: ', this._queue.roomCode, 'roomContents', this._rooms[this._queue.roomCode]);
            this._io.emit('joined room', {
                id: data.id,
                roomFull: isRoomFull,
                playerNumber: (this._rooms[this._queue.roomCode] && this._rooms[this._queue.roomCode].player2) ? 2 : 1,
                roomCode: this._queue.roomCode
            });
            if (isRoomFull) {
                this._queue = null;
            }
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
        if (!data.id) {
            this._people--;
            this._io.emit('updated people count', { people: this._people });
        }
        Object.keys(this._rooms).forEach(roomCode => {
            if (data.timedout && (this._rooms[roomCode].player1 === data.id || data.id === this._rooms[roomCode].player2)) {
                // Opposite user to caller is the player that forfeits.
                if (this._rooms[roomCode].player1 === data.id) {
                    console.log('Player 2: leaving room (via timeout)');
                    this._rooms[roomCode].player2 = null;
                } else if (this._rooms[roomCode].player2 === data.id) {
                    console.log('Player 1: leaving room (via timeout)');
                    this._rooms[roomCode].player1 = null;
                }
                this._forfeit(roomCode);
                this._rooms[roomCode] = null;
                delete this._rooms[roomCode];
                return;
            }
            if (this._rooms[roomCode].player1 === data.id) {
                console.log('Player 1: leaving room');
                this._rooms[roomCode].player1 = null;
            }
            if (this._rooms[roomCode].player2 === data.id) {
                console.log('Player 2: leaving room');
                this._rooms[roomCode].player2 = null;
            }
            if (!this._rooms[roomCode].player1 && !this._rooms[roomCode].player2) {
                this._rooms[roomCode] = null;
                delete this._rooms[roomCode];
                return;
            } else if ((!this._rooms[roomCode].player1 && this._rooms[roomCode].player2) || (this._rooms[roomCode].player1 && !this._rooms[roomCode].player2)) {
                this._forfeit(roomCode);
                this._rooms[roomCode] = null;
                delete this._rooms[roomCode];
                return;
            }
        });
    }

    private _forfeit(roomCode: string) {
        this._rooms[roomCode].previousBoard = this._rooms[roomCode].previousBoard ? this._rooms[roomCode].previousBoard : {} as any;
        this._rooms[roomCode].previousBoard.gameStatus = !!this._rooms[roomCode].player1 ? 1 : 2
        console.log(`Player ${this._rooms[roomCode].previousBoard.gameStatus === 1 ? 2 : 1}: forfeits game`);
        this._io.emit('move made', {
            board: this._rooms[roomCode].previousBoard,
            id: this._rooms[roomCode].player1 ? this._rooms[roomCode].player1 : this._rooms[roomCode].player2,
            roomCode: roomCode
        });
    }
    
    private _makeMove(data): void {
        this._rooms[data.roomCode].previousBoard = data.board;
        this._io.emit('move made', { board: data.board, id: data.id, roomCode: data.roomCode });
    }
}