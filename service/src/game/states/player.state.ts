import { Schema, type } from '@colyseus/schema';

export class PlayerState extends Schema {
    @type('string') sessionId: string;
    @type('string') playerId: string;
    @type('number') x: number;
    @type('number') y: number;
    @type('boolean') flipX: boolean;

}