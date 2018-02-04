export interface State {}

export interface Vector {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Entity<STATE extends State> {
    draw: Draw<STATE>;
    update: Update<STATE>;
}
export interface Delta<STATE> { from: STATE; to: STATE; }

export interface Game {
    entities: any[];
    timestamp: number;
    fps: number;
    map: {
        size: {
            width: number;
            height: number;
        };
    };
}
export interface Input {
    walking: boolean;
    direction: Direction;
    pause: {
        state: boolean;
        edge: boolean;
    };
}
export enum Direction {
    None = 0,
    Up = 1,
    Right = 2,
    Down = 4,
    Left = 8,
}
export type GameSetter = (game: Game) => Game;

export type Update<STATE extends State> = (input: Input, game: Game, timestep: number, self?: STATE) => STATE;
export type InjectableUpdate<STATE extends State> = (id: number, destroy: Destroy,initialState: STATE) => Update<STATE>;

export type Draw<STATE extends State> = (context: CanvasRenderingContext2D, self: STATE, game: Game) => void;

export type Destroy = () => void;

export type Spawn<STATE extends State> =  (id: number, destroy: Destroy, initialState: STATE) => Entity<STATE>;

export interface EntityHandler {
    spawn: <STATE extends State> (game: Game, entity: Spawn<STATE>, initialState: STATE) => void;
    update: (input: Input, game: Game, timestep: number) => State[];
    draw: (game: Game) => void;
}
