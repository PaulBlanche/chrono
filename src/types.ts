export interface Size {
    readonly width: number;
    readonly height: number;
}

export interface Vector {
    readonly x: number;
    readonly y: number;
}

export interface Game {
    readonly entities: { readonly [s: string]: any };
    readonly timestamp: number;
    readonly fps: number;
    readonly map: {
        readonly size: Size;
    };
}
export namespace Game {
    export interface Input {
        readonly walking: boolean;
        readonly direction: Direction;
        readonly pause: Pause;
    }
    export interface Pause {
        readonly state: boolean;
        readonly edge: boolean;
    }
    export enum Direction {
        None = 0,
        Up = 1,
        Right = 2,
        Down = 4,
        Left = 8,
    }
    export interface Fps {
        readonly update: (now: number) => number;
        readonly draw: () => void;
    }
    export type Update =
        (input: Input, game: Game) => Game;

    export type Draw =
        (game: Game) => void;

    export type Before =
        (timestamp: number, game: Game) => Game;

    export type After =
        () => void;

    export type Loop = (timestamp: number) => void;

    export interface Config {
        // maximum fps of the rendering engine
        readonly maxFps: number;
        // length of a tick of the game simulation engine
        readonly timestep: number;
    }

}

export interface EntityHandler {
    readonly spawn: EntityHandler.Spawn;
    readonly update: EntityHandler.Update;
    readonly draw: EntityHandler.Draw;
}
export namespace EntityHandler {

    export type Spawn = <STATE extends Entity.State>
        (game: Game, entity: Entity.Spawn<STATE>, initialState: STATE) => Game;

    export type Update =
        (input: Game.Input, game: Game, timestep: number) =>
        ReadonlyArray<Entity.State>;

    export type Draw =
        (game: Game) => void;

}

export interface Entity<STATE extends Entity.State> {
    readonly draw: Entity.Draw<STATE>;
    readonly update: Entity.Update<STATE>;
}
export namespace Entity {
    export interface State {
        readonly type: string;
    }

    export interface UpdateContext {
        readonly input: Game.Input;
        readonly game: Game;
        readonly timestep: number;
    }

    export interface DrawContext {
        readonly context: CanvasRenderingContext2D;
        readonly game: Game;
    }

    export type Draw<STATE extends State> =
        (context: DrawContext, self: STATE) => void;

    export type Update<STATE extends State> =
        (context: UpdateContext, self: STATE) => STATE;

    export type InjectableUpdate<STATE extends State> =
        (id: number, destroy: Destroy) => Update<STATE>;

    export type Destroy = () => void;

    export type Spawn<STATE extends State> =
        (id: number, destroy: Destroy, initialState: STATE) => Entity<STATE>;

}
