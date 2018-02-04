import {
    Spawn, State, InjectableUpdate, Draw, Direction, Size,
} from '../../types';
import { snapToBounds } from '../utils';

const SPEED = {
    ORTHO : 5,
    DIAG: 3,
};

export interface PlayerState extends State {
    // position of the player
    position: {
        x: number;
        y: number;
    };
    // life
    life: number;
    size: Size;
}

// spawn a player entity (draw and update functions)
export const spawn: Spawn<PlayerState> =
    (id, destroy, initialState) => {
        return {
            draw,
            update:update(id, destroy, initialState),
        };
    };

// Player draw function
const draw: Draw<PlayerState> =
    (context, { position: { x, y }, size : { width, height } }, game) => {
        context.fillStyle = 'green';
        const rx = Math.floor(x - width / 2);
        const ry = Math.floor(y - height / 2);
        context.fillRect(rx, ry, width, height);
    };

// Player update function
const update: InjectableUpdate<PlayerState> =
    (id, destroy, initialState) =>
    ({ walking, direction }, game, timestep, self=initialState) => {
        const state = { ...self };

        // if player is walking, update its position according to direction
        if (walking) {
            let dx = 0;
            let dy = 0;
            if ((direction & Direction.Up)) {
                dy -= 1;
            }
            if ((direction & Direction.Right)) {
                dx += 1;
            }
            if ((direction & Direction.Down)) {
                dy += 1;
            }
            if ((direction & Direction.Left)) {
                dx -= 1;
            }
            const spd = (dx !== 0 && dy !== 0) ? SPEED.DIAG : SPEED.ORTHO;
            state.position.y += dy * spd;
            state.position.x += dx * spd;
        }

        state.position = snapToBounds(state.position, game.map.size, self.size);
        return state;
    };
