// Walking handling. Check is done for contradicting inputs
export const walking =
    (map: Map<string, boolean>, oldWalking: boolean): boolean => {
        let sx = 0;
        let sy = 0;
        if (map.get('ArrowUp')) {
            sy += 1;
        }
        if (map.get('ArrowDown')) {
            sy += 1;
        }
        if (map.get('ArrowLeft')) {
            sx += 1;
        }
        if (map.get('ArrowRight')) {
            sx += 1;
        }

        const noInput = sx === 0 && sy === 0;
        const conflictInput = sx === 2 || sy === 2;
        return !noInput && !conflictInput;
    };
