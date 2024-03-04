import {useState} from 'react';

let config = {
    options: { // (Check documentation or LPD8mk2 manual for details)
        type: 0,// 0: Momentary, 1: Toggle
        pressureMessage: 2, // 0: Off, 1: Channel, 2: Polyphonic
        fullLevel: 1, // 0: On, 1: Off
        globalMidiChannel: 0, // 0: Channel 1, 15: Channel 16
    },

    pads: Array(8).map((element, index) => ({
        id : index,
        cc: 35 + index,
        pg: Math.max(0, index - 1),
        nt: 35 + index,
        ch: 1,
        color: {
            up: {r: 0, g: 0, b: 255},
            down: {r: 255, g: 0, b: 0}
        }
    })),

    knobs: Array(8).map((element, index) => ({
        cc: 35 + index,
        ch: 1,
        min: 0,
        max: 127,
    }))

}

export default function createConfigMenuState() {

    const [currentSelectedProgram, setCurrentSelectedProgram] = useState(0);
    let program = {currentSelectedProgram, setCurrentSelectedProgram};

    return {};
}