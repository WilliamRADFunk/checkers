import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

// const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
// const config: SocketIoConfig = { url: '157.245.226.187:80', options: {} };
const config: SocketIoConfig = {
    url: 'https://the-something-long-anonymous-thing.casa.the-something-long-anonymous-thing.casa:443',
    options: {
        secure: true,
        reconnect: true,
        rejectUnauthorized: false
    }
};

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
        BrowserAnimationsModule,
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
