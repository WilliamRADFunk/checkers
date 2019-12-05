import { TestBed } from '@angular/core/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { BoardStateService } from './board-state.service';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

describe('BoardStateService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            SocketIoModule.forRoot(config)
        ]
    }));

    it('should be created', () => {
        const service: BoardStateService = TestBed.get(BoardStateService);
        expect(service).toBeTruthy();
    });
});
