import { EntityHandler, Entity } from '../types';

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
            spawn: spawn(map, () => count++),
            update: update(map),
            draw: draw(map, context),
        };
    };

const draw = (
        map: Map<number, Entity<any>>, context: CanvasRenderingContext2D,
    ): EntityHandler.Draw =>
    game => {
        for (const [id, entity] of Array.from(map.entries())) {
            const self = game.entities[id];
            const ctx: Entity.DrawContext = { context, game };
            entity.draw(ctx, self);
        }
    };

const update =
    (map: Map<number, Entity<any>>): EntityHandler.Update =>
    (input, game, timestep) => {
        const entities: Entity.State[] = [];
        // iterate over all entitis in the entity map
        for (const [id, entity] of Array.from(map.entries())) {
            // get its current state in the game state and update
            const self = game.entities[id];
            const ctx: Entity.UpdateContext = { input, game, timestep };
            entities[id] = entity.update(ctx, self);
        }
        // return the new array of entity states
        // TODO : should it be an array or an object ?
        return entities;
    };

const spawn =
    (map: Map<number, Entity<any>>, ider: () => number): EntityHandler.Spawn =>
    (game, entity, initialState) => {

        const id = ider();
        // destroy function of the entity (dereference it from the
        // global entity map for garbage collection)
        const destroy = () => map.delete(id);

        // instantiate the entity with its initial state and its
        // destroy function, put it in the map, and put its state in
        // the game state.
        const e = entity(id, destroy, initialState);
        map.set(id, e);
        const entities = { ...game.entities, [id]:initialState };
        console.log(entities);
        return { ...game, entities };
    };
