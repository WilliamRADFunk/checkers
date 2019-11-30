import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';

const  allowedDomains = [
	'http://localhost:4200',
	'http://www.williamrobertfunk.com'
];

export class ExpressWrapper {
    private _app: Express = express();
    private _server = new http.Server(this._app);
    private _io = socketIO(this._server);
    private _port: number = 4444;
    private _socket;
    private _rooms: { [key: string]: { player1: string; player2: string } } = {};

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
        console.log('new player called', data.roomCode, data.player, this._socket.id);
        // If the room code isn't registered yet, set it up.
        if (data.roomCode && !this._rooms[data.roomCode]) {
            this._rooms[data.roomCode] = {
                player1: null,
                player2: null
            };
        } else if (!data.roomCode) {
            console.error('No room code provided for player registration.');
        }
        // Register the player that is stated in the data packet, if it's there.
        if (data.player) {
            this._rooms[data.roomCode][`player${data.player}`] = this._socket.id;
            this._io.emit('joined room', { id: this._socket.id, roomFull: (!!this._rooms[data.roomCode].player1 && !!this._rooms[data.roomCode].player2), playerNumber: data.player });
            return;
        }
        // If player number choice is not included in data packet, assign based off availability.
        if (this._rooms[data.roomCode].player1 && !this._rooms[data.roomCode].player2) {
            this._rooms[data.roomCode].player2 = this._socket.id;
            this._io.emit('joined room', { id: this._socket.id, roomFull: (!!this._rooms[data.roomCode].player1 && !!this._rooms[data.roomCode].player2), playerNumber: 2 });
        } else if (this._rooms[data.roomCode].player2 && !this._rooms[data.roomCode].player1) {
            this._rooms[data.roomCode].player1 = this._socket.id;
            this._io.emit('joined room', { id: this._socket.id, roomFull: (!!this._rooms[data.roomCode].player1 && !!this._rooms[data.roomCode].player2), playerNumber: 1 });
        } else {
            console.error(`Player (${this._socket.id}) trying to register for room (${data.roomCode}), but all player slots are full.`);
        }
    }
    
    private _leaveRoom(data): void {
        console.log('leaving room');
        Object.keys(this._rooms).forEach(roomCode => {
            if (this._rooms[roomCode].player1 === this._socket.id) {
                this._rooms[roomCode].player1 = null;
            }
            if (this._rooms[roomCode].player2 === this._socket.id) {
                this._rooms[roomCode].player2 = null;
            }
            if (!this._rooms[roomCode].player1 && !this._rooms[roomCode].player2) {
                delete this._rooms[roomCode];
            }
        });
    }
    
    private _makeMove(data): void {
        console.log('player makes a move');
    }
}