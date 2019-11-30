import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';
import { ManComponent } from './man/man.component';
import { BoardStateService } from './services/board-state.service';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

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
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [ BoardStateService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }