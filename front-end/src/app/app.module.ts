import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';
import { ManComponent } from './man/man.component';
import { BoardStateService } from './services/board-state.service';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';

@NgModule({
    declarations: [
        AppComponent,
        GameBoardComponent,
        CellComponent,
        ManComponent,
        StartMenuComponent,
        HelpScreenComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgbModule
    ],
    providers: [ BoardStateService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
