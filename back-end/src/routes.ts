import { Express } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';

const  allowedDomains = [
	'http://localhost:4200',
	'http://www.williamrobertfunk.com'
];

export class Routes {
    private _server: http.Server;
    private _io: socketIO;
    private _socket: socketIO.socket;
    private rooms: { [key: string]: { player1: number; player2: number } } = {};

	constructor(app: Express) {
        this._server = new http.Server(app);
        this._io = socketIO(this._server);
        this._socket = this._io.socket;
        console.log('socket', this._socket);

        this._io.on('connection', socket => {
            console.log('socket', socket);
            Object.keys(socket).forEach(key => {
                console.log('socket - key', key);
            });
            socket.on('disconnect', () => {
                // remove disconnected player
                Object.keys(this.rooms).forEach(roomCode => {
                    if (this.rooms[roomCode].player1 === socket.id) {
                        this.rooms[roomCode].player1 = null;
                    }
                    if (this.rooms[roomCode].player2 === socket.id) {
                        this.rooms[roomCode].player2 = null;
                    }
                    if (!this.rooms[roomCode].player1 && !this.rooms[roomCode].player2) {
                        delete this.rooms[roomCode];
                    }
                });
            });
            socket.on('new player', data => {
                // If the room code isn't registered yet, set it up.
                if (data.roomCode && !this.rooms[data.roomCode]) {
                    console.log('new player called', data.roomCode);
                    this.rooms[data.roomCode] = {
                        player1: null,
                        player2: null
                    };
                } else if (!data.roomCode) {
                    console.error('No room code provided for player registration.');
                }
                // Register the player that is stated in the data packet, if it's there.
                if (data.player) {
                    this.rooms[data.roomCode][`player${data.player}`] = socket.id;
                    return;
                }
                // If player number choice is not included in data packet, assign based off availability.
                if (this.rooms[data.roomCode].player1 && !this.rooms[data.roomCode].player2) {
                    this.rooms[data.roomCode].player2 = socket.id;
                } else if (this.rooms[data.roomCode].player2 && !this.rooms[data.roomCode].player1) {
                    this.rooms[data.roomCode].player1 = socket.id;
                } else {
                    console.error(`Player (${socket.id}) trying to register for room (${data.roomCode}), but all player slots are full.`);
                }
            });
            socket.on('movement', data => {
                var player = this.rooms[socket.id] || {};
            });
        });

		app.get("/", this.default);
		app.get("/register-gameroom/:code", this.registerRoom.bind(this));
	}

	private default(req, res) {
		res.status(200).send({ message: "You\'ve reached the checkers backend"});
		res.end();
		return;
	};

	private registerRoom(req, res): void {
        const code: string = req.params && req.params.code;
        console.log('registerRoom', code);
		if (code) {
            this._socket.emit('new player', { roomCode: code });
			res.status(200).send({ message: `Successful code: ${code}`});
		} else {
			res.status(404).send({ message: `Invalid code: ${code}`});
		}
		res.end();
		return;
	}
}