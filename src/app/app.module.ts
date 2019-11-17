import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';
import { ManComponent } from './man/man.component';
import { BoardStateService } from './services/board-state.service';

@NgModule({
	declarations: [
		AppComponent,
		GameBoardComponent,
		CellComponent,
		ManComponent
	],
	imports: [
		BrowserModule
	],
	providers: [ BoardStateService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
