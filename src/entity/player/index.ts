import { Spawn, Entity, State, InjectableUpdate, Draw, Direction } from '../../types';

export interface PlayerState extends State {
    // position of the player
    position: {
        x: number;
        y: number;
    };
    // life
    life: number;
    // speeds (ortho/diagonal)
    // TODO : better it to be a constant ?
    speed: {
        orthogonal: number;
        diagonal: number;
    };
}

// spawn a player entity (draw and update functions)
export const spawn: Spawn<PlayerState> = (id, destroy, initialState) => {
    return {
        draw,
        update:update(id, destroy, initialState),
    };
};

// Player draw function
const draw: Draw<PlayerState> = (context, { position: { x, y } }, game) => {
        context.fillStyle = 'green';
        context.fillRect(x - 10, y - 10, 20, 20);
    };

// Player update function
const update: InjectableUpdate<PlayerState> = (id, destroy, initialState) => ({ walking, direction }, game, timestep, self=initialState) => {
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
        const speed = state.speed;
        const spd = (dx !== 0 && dy !== 0) ? speed.diagonal : speed.orthogonal;
        state.position.y += dy * spd;
        state.position.x += dx * spd;
    }

    // Snap player to game bounding box
    // FIXME : magic number, should be in game state ?
    if (state.position.y < 10) {
        state.position.y = 10;
    }
    if (state.position.y > 390) {
        state.position.y = 390;
    }
    if (state.position.x < 10) {
        state.position.x = 10;
    }
    if (state.position.x > 390) {
        state.position.x = 390;
    }
    return state;
};
