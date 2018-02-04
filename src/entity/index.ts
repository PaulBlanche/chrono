import { EntityHandler, State, Entity } from '../types';

// TODO : rewrite replacing closure reference with injection
// Entity handler builder (closure to inject rendering context, passed to each
// entity drawer).
export const entityHandler =
    (context: CanvasRenderingContext2D): EntityHandler => {
        // global entity count to id them.
        // TODO : maybe uuid ?
        let count = 0;
        // global entity map.
        const map = new Map<number, Entity<any>>();

        // entity handler api.
        return {
            // spawn a given entity with its initial state.
            spawn: (game, entity, initialState) => {
                // id of the spawned entity
                const id = count;
                // destroy function of the entity (dereference it from the
                // global entity map for garbage collection)
                const destroy = () => map.delete(id);

                // instantiate the entity with its initial state and its
                // destroy function, put it in the map, and put its state in
                // the game state.
                const e = entity(id, destroy, initialState);
                map.set(id, e);
                game.entities[id] = initialState;

                //update entity counter
                count++;
            },
            // update all entities
            update: (input, game, timestep) => {
                const entities: State[] = [];
                // iterate over all entitis in the entity map
                for (const [id, entity] of Array.from(map.entries())) {
                    // get its current state in the game state and update
                    const self = game.entities[id];
                    entities[id] = entity.update(input, game, timestep, self);
                }
                // return the new array of entity states
                // TODO : should it be an array or an object ?
                return entities;
            },
            // draw all entities
            draw: game => {
                for (const [id, entity] of Array.from(map.entries())) {
                    const self = game.entities[id];
                    entity.draw(context, self, game);
                }
            },
        };
    };
