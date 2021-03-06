const NOTE_INDEX = {
    'C': 0,
    'D': 2,
    'E': 4,
    'F': 5,
    'G': 7,
    'A': 9,
    'B': 11,
};

const ACCIDENTAL = {
    '#': +1,
    'b': -1,
};

export function expandVelocities(notes: string): string[] {
    return notes.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

export function parseVelocities(velocities: string): number[] | null {
    const numericVelocities = expandVelocities(velocities).map(s => parseInt(s, 10));
    return numericVelocities.findIndex(isNaN) === -1 ? numericVelocities : null;
}

export function textNoteToMidiNote(note: string): number {
    const match = (/(\w)(-?\d)?([#b])?/g).exec(note);
    const noteIndex = match && NOTE_INDEX[match[1]];
    if (match && noteIndex !== null) {
        const octave = parseInt(match[2], 10) || 3;
        const accidental = ACCIDENTAL[match[3]] || 0;
        return 24 + 12 * octave + noteIndex + accidental;
    } else {
        return NaN;
    }
}

export function expandNotes(notes: string): string[] {
    return notes.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

export function parseNotes(notes: string): number[] | null {
    const midiNotes = expandNotes(notes).map(s => textNoteToMidiNote(s) || parseInt(s, 10));
    return midiNotes.findIndex(isNaN) === -1 ? midiNotes : null;
}

export function textIntervalToMillis(interval: string, bpm: number): number {
    const match = (/(\d+)\/(\d+)/g).exec(interval);
    if (match) {
        const numerator = parseInt(match[1], 10);
        const denominator = parseInt(match[2], 10);
        return noteToMs(numerator, denominator, bpm);
    } else {
        return NaN;
    }
}

export function expandIntervals(intervals: string): string[] {
    return intervals.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

export function parseIntervals(intervals: string, bpm: number): number[] | null {
    const textIntervals = expandIntervals(intervals);
    const numericIntervals = [];
    for (const textInterval of textIntervals) {
        const numericInterval = textIntervalToMillis(textInterval, bpm) || parseInt(textInterval, 10);
        if (!numericInterval)
            return null;
        numericIntervals.push(numericInterval);
    }
    return numericIntervals;
}

export function parseSignature(signature: string): [number, number] | null {
    const match = (/^(\d+)?\/(\d+)?$/g).exec(signature);
    if (match) {
        const numerator = parseInt(match[1], 10);
        const denominator = parseInt(match[2], 10);
        return [numerator || 4, denominator || 4];
    } else {
        return null;
    }
}

export function noteToMs(beats: number, noteFraction: number, bpm: number): number {
    return ((60000 / (bpm / 4)) / noteFraction) * beats;
}
