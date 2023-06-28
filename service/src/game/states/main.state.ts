import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from '../states/player.state';

export class MainState extends Schema {
    @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}