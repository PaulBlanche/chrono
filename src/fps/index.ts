import { A_SECOND } from '../const';

const DECAY = 0.9;

interface FpsState {
    fps: number; // estimated fps
    frameCount: number; // number of frame since last update
    lastUpdate: number; // timestamp of last update
}

// Initial state of fps indicator.
const initialState = {
    fps: 30,
    frameCount: 0,
    lastUpdate: 0,
};

// Rendering of the indicator
const draw = (element: Element, { fps }: FpsState) => {
    element.textContent = fps + ' fps';
};

// Update of the indicator
const update = ({ fps, frameCount, lastUpdate }: FpsState, now: number) => {

    // if was last update was more than a second ago, update fps with estimated
    // frames rendered during last second.
    if (now > lastUpdate + A_SECOND) {
        const estimatedFps = frameCount / ((now - lastUpdate) / A_SECOND);
        return {
            fps: DECAY * estimatedFps + (1 - DECAY) * fps,
            lastUpdate: now,
            frameCount: 0,
        };
    }
    // else update the frameCount.
    return { fps, lastUpdate, frameCount: frameCount + 1 };
};

// Fps indicator api
export interface Fps {
    update: (now: number) => number;
    draw: () => void;
}

// Fps indicator builder (closure to inject ui element where we put fps
// indicator)
export const init = (ui: Element): Fps => {
    const fps = document.createElement('div');
    fps.classList.add('fps');
    ui.appendChild(fps);

    // keep track of previous state.
    let state = initialState;
    return {
        update: (now: number) => {
            state = update(state, now);
            return state.fps;
        },
        draw: () => { draw(fps, state); },
    };
};
