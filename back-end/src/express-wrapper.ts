import * as express from 'express';
import { Express } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Routes } from './routes';

export class ExpressWrapper {
	private app: Express = express();
	private port: number;
	private routes: Routes;

	constructor(isPrivate?: boolean) {
		this.port = 5000;
		this.app.use(cors());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.routes = new Routes(this.app);
		this.app.listen(this.port, this.start.bind(this));
	}

	private start(): void {
		console.log(`app running on port: ${this.port}`);
	};
}