import { Express } from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as io from 'socket.io-client'

const  allowedDomains = [
	'http://localhost:4200',
	'http://www.williamrobertfunk.com'
];

export class Routes {
    private _server: http.Server;
    private _client;
    private _io: socketIO.Server;
    private rooms: { [key: string]: { player1: string; player2: string } } = {};

	constructor(app: Express) {
        app.get("/", this._default);
		app.get("/join-gameroom/:code", this._joinRoom.bind(this));
        app.get("/register-gameroom/:code/:playerNumber", this._registerRoom.bind(this));

        this._server = new http.Server(app);
        this._io = socketIO.listen(this._server);

        this._io.on('connection', socket => {
            console.log('socket', socket);
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
                console.log('new player called', data.roomCode, data.player);
                // If the room code isn't registered yet, set it up.
                if (data.roomCode && !this.rooms[data.roomCode]) {
                    console.log('new player called', data.roomCode, data.player);
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
            // socket.on('movement', data => {
            //     var player = this.rooms[socket.id] || {};
            // });
        });
        
        this._client = io.connect('http://127.0.0.1:5000');
	}

	private _default(req, res) {
		res.status(200).send("You\'ve reached the checkers backend");
		res.end();
		return;
	};

	private _joinRoom(req, res): void {
        const code: string = req.params && req.params.code;
		if (code) {
            let player;
            const data = {
                roomCode: code
            };
            console.log('joinRoom', code, JSON.stringify(Object.keys(this.rooms)));
            if (this.rooms[code]) {
                player = this.rooms[code].player1 ? 2 : 1;
            }
            this._client.emit('new player', data);
			res.status(200).send({ player: player });
		} else {
			res.status(404).send({ message: `Invalid code: ${code}`});
		}
		res.end();
		return;
    }

	private _registerRoom(req, res): void {
        const code: string = req.params && req.params.code;
        const playerNumber: number = req.params && req.params.playerNumber && Number(req.params.playerNumber);
        console.log('registerRoom', code, playerNumber);
		if (code && (playerNumber === 1 || playerNumber === 2)) {
            const data = {
                player: playerNumber,
                roomCode: code
            };
            this._client.emit('new player', data);
            res.status(200).send({ message: `Successful code: ${code}`});
		} else {
            res.status(404).send({ message: `Invalid code: ${code}`});
		}
        res.end();
        return;
    }

	private _makeMove(req, res): void {

	}
}