import { Entity, Size, Game } from '../../types';
import { snapToBounds } from '../utils';

const SPEED = {
    ORTHO : 5,
    DIAG: 3,
};
export interface PlayerState extends Entity.State {
    readonly type: 'player';
    // position of the player
    readonly position: {
        readonly x: number;
        readonly y: number;
    };
    // life
    readonly life: number;
    readonly size: Size;
}

// spawn a player entity (draw and update functions)
export const spawn: Entity.Spawn<PlayerState> =
    (id, destroy) => {
        return {
            draw,
            update:update(id, destroy),
        };
    };

// Player draw function
const draw: Entity.Draw<PlayerState> =
    ({ context }, { position: { x, y }, size : { width, height } }) => {
        context.fillStyle = 'green';
        const rx = Math.floor(x - width / 2);
        const ry = Math.floor(y - height / 2);
        context.fillRect(rx, ry, width, height);
    };

// Player update function
const update: Entity.InjectableUpdate<PlayerState> =
    (id, destroy) =>
    ({ game, input: { walking, direction } }, self) => {

        // if player is walking, update its position according to direction
        let position = { ... self.position };
        if (walking) {
            let dx = 0;
            let dy = 0;
            if ((direction & Game.Direction.Up)) {
                dy -= 1;
            }
            if ((direction & Game.Direction.Right)) {
                dx += 1;
            }
            if ((direction & Game.Direction.Down)) {
                dy += 1;
            }
            if ((direction & Game.Direction.Left)) {
                dx -= 1;
            }
            const spd = (dx !== 0 && dy !== 0) ? SPEED.DIAG : SPEED.ORTHO;
            position.y += dy * spd;
            position.x += dx * spd;
        }

        position = snapToBounds(position, game.map.size, self.size);
        return { ...self, position };
    };
