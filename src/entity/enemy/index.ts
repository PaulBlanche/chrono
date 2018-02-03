import { Spawn, Entity, State, InjectableUpdate, Draw, Direction } from '../../types';

export interface EnemyState extends State {
    position: {
        x: number;
        y: number;
    }; // enemy position
    lastdir: {
        x: number;
        y: number;
    }; // enemy last dir for inertia
}

// spawn an enemy entity (draw and update functions)
export const spawn: Spawn<EnemyState> = (id, destroy, initialState) => {
    return {
        draw,
        update:update(id, destroy, initialState),
    };
};

// Enemy draw function
const draw: Draw<EnemyState> = (context, { position: { x, y } }, game) => {
        context.fillStyle = 'red';
        context.fillRect(Math.floor(x) - 10, Math.floor(y) - 10, 20, 20);
    };

// Compute enemy speed given the distance to player
const speed = (norm: number) => {
    if (norm > 400) { return 0; }
    return (1 - Math.pow(norm / 400, 2)) * 3;
};

// Update enemy.
const update: InjectableUpdate<EnemyState> = (id, destroy, initialState) => (input, game, timestep, self=initialState) => {
    const state = {...self};

    // Get player state
    // FIXME : magic number, have an index in game for types of entity ?
    const player = game.entities[0];

    // distance to player
    const x = player.position.x - state.position.x;
    const y = player.position.y - state.position.y;
    const n = Math.sqrt(x ** 2 + y ** 2);

    // direction to player (normalized)
    const dx = n === 0 ? 0 : x / n;
    const dy = n === 0 ? 0 : y / n;

    // update dir with inertia
    state.lastdir = {
        x: 0.05 * dx + 0.95 * self.lastdir.x,
        y: 0.05 * dy + 0.95 * self.lastdir.y,
    };

    // update position given direction and speed
    state.position.x += state.lastdir.x * speed(n);
    state.position.y += state.lastdir.y * speed(n);

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
