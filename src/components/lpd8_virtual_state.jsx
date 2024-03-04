import {useState} from 'react';

// Default Settings
const settings = {
    knobs: {
        knobMin: 0, // The lowest value the knob can send
        knobMax: 127, // The highest value the knob can send
        knobDegMin: -144, // The lowest degree the knob can rotate
        knobDegMax: 144, // The highest degree the knob can rotate
    },
    pads: {
        colorPadOff: 100, // If all colors are below this value, the alpha will be adjusted based on the highest value (max(r, g, b))
    },
    demo: true, // Start in demo mode
}


export default function createVirtualLPD8State() {

    // State: Demo Mode
    const [demoMode, setDemoMode] = useState(settings.demo); // Switch to mode in future, "DEMO", "CONFIGURE", "LIVE", "Virtual MIDI Instrument"

    // State: User Interaction
    const [currentControlPad, setCurrentControlPad] = useState('NULL');
  
    const padStates = new Array(8).fill(null).map((element, index) => {
        let padColor = {
            up: {r: 255, g: 0, b: 0},
            down: {r: 0, g: 0, b: 255}
        }
        const [isDown, setIsDown] = useState(false);
        const [isOff, setIsOff] = useState(!settings.demo);
        const [color, setColor] = useState(padColor);
        return {
            id: index,
            isDown: isDown,
            setIsDown: setIsDown,
            isOff: isOff,
            setIsOff: setIsOff,
            color: color,
            setColor: setColor
        }
    });

    const knobDegStates = new Array(8).fill(null).map((element, index) => {
        const [deg, setDeg] = useState(0);
        return {
            id: index,
            deg: deg,
            setDeg: setDeg
        }
    });

    // State: Programs in LPD8 hardware memory (0: Ram, 1-4: Presets)
    const programStates = new Array(5).fill(null).map((element, index) => {
        const [program, setProgram] = useState(generateProgram());
        return {
            program: program,
            setProgram: setProgram
        }
    });

    let LPD8State = {};
    LPD8State.settings = settings;
    LPD8State.demo = {demoMode, setDemoMode};
    LPD8State.controlPadStates = {currentControlPad, setCurrentControlPad};
    LPD8State.padStates = padStates;
    LPD8State.knobDegStates = knobDegStates;
    LPD8State.programStates = programStates;

    LPD8State.get = {};
    LPD8State.get.controlPad = () => currentControlPad;
    LPD8State.get.padDown = (padIndex) => padStates[padIndex].isDown;
    LPD8State.get.padOff = (padIndex) => padStates[padIndex].isOff;
    LPD8State.get.padColor = (padIndex) => padStates[padIndex].color;
    LPD8State.get.knobDeg = (knobIndex) => knobDegStates[knobIndex].deg;

    LPD8State.set = {};
    LPD8State.set.controlPad = (controlPad) => setControlPad(controlPad, setCurrentControlPad);
    LPD8State.set.padDown = (padIndex, isDown) => setPadDown(padIndex, isDown, padStates);
    LPD8State.set.padOff = (padIndex, isOff) => setPadOff(padIndex, isOff, padStates);
    LPD8State.set.padColor = (padIndex, color) => setPadColor(padIndex, color, padStates);
    LPD8State.set.knobDeg = (knobIndex, deg) => setKnobDeg(knobIndex, deg, knobDegStates);
    
    return LPD8State;
}

// Programs Data Structure & Defaults
function generateProgramOptionsData() {
    return ({
        options: {
            programNumber: 0,	// Track programs when fetching from MIDI
            triggerType: 0,		// 0: Momentary, 1: Toggle
            pressureMessage: 2,	// 0: Off, 1: Channel, 2: Polyphonic
            fullLevel: 1,			// 0: On, 1: Off
            globalMidiChannel: 0,	// 0: Channel 1, 15: Channel 16
        }

    })
}

function generateProgramPadData(index) {
    return ({
        id : index,
        cc: 35 + padIndex,
        pg: Math.max(0, index - 1),
        nt: 35 + index,
        ch: 1,
        color: {
            up: {r: 0, g: 0, b: 255},
            down: {r: 255, g: 0, b: 0}
        }
    })
}

function generateProgramKnobData(index) {
    return ({
        cc: 35 + index,
        min: 0,
        max: 127,
        ch: 1,
    })
}

function validateProgramOptions(options) {
    if (
        typeof options.triggerType !== typeof 1		||
        typeof options.pressureMessage !== typeof 1	||
        typeof options.fullLevel !== typeof 1			||
        typeof options.globalMidiChannel !== typeof 1
    ) return false;

    if (
        options.triggerType != 0 || options.triggerType != 1			||
        options.pressureMessage < 0 || options.pressureMessage > 2	||
        options.fullLevel != 0 || options.fullLevel != 1				||
        options.globalMidiChannel < 0 || options.globalMidiChannel > 15
    ) return false;

    for (let i = 1; i <= 8; i++) {
        if (!options.pads[i].isValid()) return false;
        if (!options.knobs[i].isValid()) return false;
    }

    return true;
}

function generateProgram() {
    return ({
        options: generateProgramOptionsData(),
        pads: Array(8).map((element, index) => generateProgramPadData(index)),
        knobs: Array(8).map((element, index) => generateProgramKnobData(index))
    })
}


// Getter/Setters
function setControlPad(controlPad, setCurrentControlPad) {
    if (
        controlPad == 'NOTE' ||
        controlPad == 'PROGCHNG' ||
        controlPad == 'CC' ||
        controlPad == 'PROGRAM' ||
        controlPad == 'NULL'
    ) {
        setCurrentControlPad(controlPad);
    }
}

function setPadColor(padIndex, color, padStates) {

    for (let colorType in color) { // Up/Down
        if (!(
            typeof color[colorType] === typeof {} &&
            typeof color[colorType].r === typeof 1 &&
            typeof color[colorType].g === typeof 1 &&
            typeof color[colorType].b === typeof 1 &&
            typeof color[colorType].a === typeof 1 &&
            color[colorType].r >= 0 && color[colorType].r <= 255 &&
            color[colorType].g >= 0 && color[colorType].g <= 255 &&
            color[colorType].b >= 0 && color[colorType].b <= 255 &&
            color[colorType].a >= 0 && color[colorType].a <= 1 &&
            padIndex >= 0 && padIndex <= 7
        )) {
            return;
        };

        if (
            color[colorType].r < settings.pads.colorPadOff &&
            color[colorType].g < settings.pads.colorPadOff &&
            color[colorType].b < settings.pads.colorPadOff
        ) {
            color[colorType].a = Math.max(color[colorType].r, color[colorType].g, color[colorType].b) / settings.pads.colorPadOff;
        }
    }

    padStates[padIndex].setColor(color);
}

function setPadOff(padIndex, isOff, padStates) {
    if (
        padIndex >= 0 && padIndex <= 7 &&
        typeof isOff === typeof true
    ) {
        padStates[padIndex].setIsOff(isOff);
    }
}

function setPadDown(padIndex, isDown, padStates) {
    if (
        padIndex >= 0 && padIndex <= 7 &&
        typeof isDown === typeof true
    ) {
        padStates[padIndex].setIsDown(isDown);
    }
}

function setKnobDeg(knobIndex, deg, knobDegStates) {
    if (
        knobIndex >= 0 && knobIndex <= 7 &&
        typeof deg === typeof 1 &&
        deg >= settings.knobs.knobDegMin && deg <= settings.knobs.knobDegMax
    ) {
        knobDegStates[knobIndex].setDeg(deg);
    }
}
