export default function LPD8_Virtual({props}) {

    return (
        <div id="LPD8mk2">

            <Edge side="Left"/>
            <Edge side="Right"/>

            <div className="colorWhite" id="frame">

                <LogoContainer />
                <ControlPadsContainer props={props}/>
                <DrumPadsContainer props={props}/>
                <KnobContainer props={props}/>

            </div>

        </div>
    )
}

// Utility Functions
function ExpandText({text}) {

    const expandedElements = [];
    let keyID = 0;

    if (typeof text === "string") {
        [...text].forEach(letter => {
            expandedElements.push(
                <span key={keyID}>{letter}</span>
            );
            keyID++;
        });
    } else if (text instanceof Array) {
        text.forEach(word => {
            expandedElements.push(
                <span key={keyID}>{word}</span>
            );
            keyID++;
        });
    }

    return (<>
        {expandedElements}
    </>)
}

function Edge({side}) {
    return (
        <div className="edge edgeContainer" id={"edge" + side}>
            <div className="edge subEdge" id={"subEdge" + side}></div>
        </div>
    )
}

function LogoContainer() {

    const logoBrandTop = "AKAI";
    const logoBrandBottom = "PROFESSIONAL";
    const modelBottom = ["LAPTOP", "PAD", "CONTROLLER"];

    return (
        <div id="logoContainer">
            
            <div className="logos" id="logoBrand">
                <div id="logoBrandTop" className="Archivo bigText centerSpanText">
                    <ExpandText text={logoBrandTop}/>
                </div>
                <div className = "Archivo smallText centerSpanText logoSmallBotom">
                    <ExpandText text={logoBrandBottom}/>
                </div>
            </div>

            <div className="logos colorWhite" id="logoModel">
                <div id="logoModelTop" className="Archivo bigText colorRed centerSpanText">
                    <ExpandText text="LPD"/>
                    <span className="colorWhite">8</span>
                </div>
                <div id="logoModelBottom" className="ChivoSemiBold smallText centerSpanText logoSmallBotom">
                    <ExpandText text={modelBottom}/>
                </div>
            </div>

        </div>
    )
}

function ControlPadsContainer({props}) {
    
    let demoMode = props.demo.demoMode;
    let activeControlPad = props.controlPadStates.currentControlPad;

    function ControlPad({id,  cPadProps: {activeControlPad='NULL', type='NULL', mid=1}}) {
        return (<>
            <div className="controlPad"
                id={id}
                style={(
                    (type ===  activeControlPad) ? ({
                        '--colorControlPad': 'var(--colorControlPadOn)', 
                        '--colorControlPadShadow': 'var(--colorControlPadOnShadow)', 
                    }) : ({
                        '--colorControlPad': 'var(--colorPadOff)', 
                        '--colorControlPadShadow': 'var(--colorPadOffShadow)',
                    })
                )}
                onClick={() => {
                    if (demoMode) {
                        props.set.controlPad(type);
                    }
                }}
            >
                {(mid ? (<div className="controlPadMiddle"></div>) : null)}
            </div>
        </>)
    }

    const noteLabel = "NOTE";
    const programLabel = "PROGRAM";
    const progChngLabel = ["PROG", "CHNG"];

    return(
        <div id="controlPadsContainer">
            
            <div className="controlPadContainer" id="controlPadProgram">
                <div className="ChivoSemiBold smallText colorRed centerSpanText padLabel" id="controlPadProgramLabel">
                    <ExpandText text={programLabel} />
                </div>
                <ControlPad id={"controlPadProgramPad"} cPadProps={{activeControlPad, type: "PROGRAM", mid: 1}} />
            </div>

            <div className="controlPadContainer" id="controlPadNote">
                <div className="ChivoSemiBold smallText centerSpanText padLabel padSmallLabel" id="controlPadNoteLabel">
                    <ExpandText text={noteLabel} />
                </div>
                <ControlPad id={"controlPadNotePad"} cPadProps={{activeControlPad, type: "NOTE"}} />
            </div>

            <div className="controlPadContainer" id="controlPadProgChng">
                <div className="ChivoSemiBold smallText centerSpanText padLabel" id="controlPadProgChngLabel">
                    <ExpandText text={progChngLabel} />
                </div>
                <ControlPad id={"controlPadProgChngPad"}  cPadProps={{activeControlPad, type: "PROGCHNG"}} />
            </div>

            <div className="controlPadContainer" id="controlPadCC">
                <div className="ChivoSemiBold smallText centerSpanText padLabel padSmallLabel" id="controlPadCCLabel">
                    <span>CC</span>
                </div>
                <ControlPad id={"controlPadCCPad"}  cPadProps={{activeControlPad, type: "CC"}} />
            </div>
            
        </div>
    )
}

function DrumPadsContainer({props}) {
    
    let demoMode = props.demo.demoMode;

    function DrumPad({num}) {

        let padIndex = num - 1;
        let isDown = props.get.padDown(padIndex);
        let isOff = props.get.padOff(padIndex);
        let padColors = props.get.padColor(padIndex);
        let color = isDown ? padColors.down : padColors.up;
        
        if (color.a === undefined) {
            color.a = 1;
        } 
        

        return (<>
            <div
                className={"drumPadContainer"}
                id={"drumPad" + num}
                style={{
                    ...(isDown ? {'--padDown': 1} : {'--padDown': 0}),
                    ...(isOff ? {
                            '--colorDrumPad': 'var(--colorPadOff)',
                            '--colorDrumPadBorder': 'var(--colorPadOffShadow)',
                            '--colorDrumPadShadow': 'var(--colorPadOffShadow)'
                        } : {
                            '--colorDrumPad': 'rgba(' +
                                color.r + ',' +
                                color.g + ',' +
                                color.b + ',' +
                                color.a + ')',
                            '--colorDrumPadBorder': 'rgba(' +
                                color.r + ',' +
                                color.g + ',' +
                                color.b + ',' +
                                (color.a * 1.5) + ')',
                            '--colorDrumPadShadow': 'rgba(' +
                                color.r + ',' +
                                color.g + ',' +
                                color.b + ',' +
                                (color.a * 0.35) + ')'
                        }
                    )
                }}
                onClick={() => {
                    if (demoMode) {
                        props.set.padDown(padIndex, !isDown);
                        props.set.padColor(padIndex, {
                            up: {
                                r: (Math.random() * 127) + 127,
                                g: (Math.random() * 127) + 127,
                                b: (Math.random() * 127) + 127,
                                a: 1
                            },
                            down: {
                                r: (Math.random() * 127) + 127,
                                g: (Math.random() * 127) + 127,
                                b: (Math.random() * 127) + 127,
                                a: 1
                            }
                        });
                    }
                }}
            >
                
                <div className="ChivoSemiBold smallText centerSpanText padLabel">
                    <span>PAD {num}</span>
                    {(num < 5) ? (<span className="colorRed">PROG {num}</span>) : null}
                </div>
                <div className="drumPadOff"></div>
                <div
                    className="drumPad"
                    id={"drumPad" + num + "Pad"}
                ></div>
            </div>
        </>)
    }

    return (
        <div id="drumPadsContainer">
           <DrumPad num={1} />
           <DrumPad num={2} />
           <DrumPad num={3} />
           <DrumPad num={4} />
           <DrumPad num={5} />
           <DrumPad num={6} />
           <DrumPad num={7} />
           <DrumPad num={8} />
        </div>
    );
}

// Functions to prevent scrolling of zoomed pages when scrolling on knobs
let preventSrolling = (e) => {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}
let documentScrollEnabled = true;
let knobEnableScroll = () => {
    if (!documentScrollEnabled) {
        document.body.removeEventListener('wheel', preventSrolling, false);
        documentScrollEnabled = true;
    }
}
let knobDisableScroll = () => {
    if (documentScrollEnabled) {
        document.body.addEventListener('wheel', preventSrolling, {passive: false});
        documentScrollEnabled = false;
    }
}

function KnobContainer({props}) {

    let settings = props.settings;
    let demoMode = props.demo.demoMode;

    function Knob({num}) {
        
        let knobIndex = num - 1;
        let lastTime = undefined;
        let knobDeg = props.get.knobDeg(knobIndex);
        let degLimit = 12;
        let degUpdateLimitPerSecond = 30;
        let degAcceleration = .75;
        
        let handleWheel = (e) => {

            let degInterval = Math.ceil(3 - (2/(e.deltaY || 1)));
            
            if (e.deltaY != 0) {
                
                if (lastTime === undefined) {
                    lastTime = e.timeStamp;
                } else {
                    if (e.timeStamp - lastTime < (1000 / degUpdateLimitPerSecond)) {
                        return;
                    } else {
                        lastTime = e.timeStamp;
                    }
                }
                

                let deg = props.get.knobDeg(knobIndex);
                deg += Math.min(Math.max((e.deltaY * degAcceleration), (degLimit * -1)), degLimit) * degInterval;

                if (deg < settings.knobs.knobDegMin) {
                    deg = settings.knobs.knobDegMin;
                } else if (deg > settings.knobs.knobDegMax) {
                    deg = settings.knobs.knobDegMax;
                }

                props.set.knobDeg(knobIndex, deg);
            }    
        };

        return (
            <div
                className={
                    "knob knobCol" + (((num - 1) % 4) + 1) + " " +
                    ((num > 4) ? "bottomKnobRow" : "")
                }
                id={"knob" + (num)}
                key={num}
                onWheel={(demoMode) ? handleWheel : null}
                onMouseEnter={(demoMode) ? knobDisableScroll : null}
                onMouseLeave={(demoMode) ? knobEnableScroll : null}
                
            >
                <div className="knobLabel ChivoSemiBold smallText padLabel">
                    <span>K{num}</span>
                </div>

                <div className="knobWheel" key={num}>
                    <svg
                        id={"knob" + (num) + "svg"}
                        key={num}
                        version="1.1"
                        viewBox="0 0 32 32"
                        height="100%" width="100%"
                        style={{'--rot': knobDeg + 'deg'}}
                    >
                        <use href="#knobSymbol"></use>
                    </svg>
                </div>

                <div className="knobDots">
                    <div className="knobDotLeft"></div>
                    <div className="knobDotRight"></div>
                </div>
            </div>
        )
    }

    function KnobSVG() {
        return (
            <svg version="1.1" style={{position: "absolute", userSelect: "none", outline: "none"}}>
                <defs>
                    {/*Gear Background Definition*/}
                    <linearGradient id="shape-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgb(80, 80, 81)"/>
                        <stop offset="100%" stopColor="rgb(14, 14, 15)"/>
                    </linearGradient>

                    {/*Innter Center Light Ring Circles Definition*/}
                    <radialGradient id="metal-rings" fx="50%" fy="50%" r="3%" spreadMethod="reflect">
                        <stop offset="30%" stopColor="rgba(55, 55, 55, .7)" stopOpacity="0.56"></stop>
                        <stop offset="42%" stopColor="rgba(108, 108, 109, .7)" stopOpacity="0.34"></stop> {/*Small Inner Rings Shine*/}
                        <stop offset="50%" stopColor="rgba(182, 182, 182, .5)" stopOpacity="0.39"></stop> {/*Small Inner Rings*/}
                        <stop offset="58%" stopColor="rgba(108, 108, 109, .7)" stopOpacity="0.34"></stop> {/*Small Inner Rings Shine*/}
                        <stop offset="70%" stopColor="rgba(55, 55, 55, .7)" stopOpacity="0.56"></stop>
                    </radialGradient>

                    {/*Outer Gear Shape Definition*/}
                    <path id="shape" d="
                        M 0.208 0.978
                        A 0.02 0.02 0 0 1 0.407 0.914
                        A -1 -1 0 0 0 0.588 0.809
                        A 0.02 0.02 0 0 1 0.743 0.669
                        A -1 -1 0 0 0 0.866 0.5
                        A 0.02 0.02 0 0 1 0.951 0.309
                        A -1 -1 0 0 0 0.995 0.105
                        A 0.02 0.02 0 0 1 0.995 -0.105
                        A -1 -1 0 0 0 0.951 -0.309
                        A 0.02 0.02 0 0 1 0.866 -0.5
                        A -1 -1 0 0 0 0.743 -0.669
                        A 0.02 0.02 0 0 1 0.588 -0.809
                        A -1 -1 0 0 0 0.407 -0.914
                        A 0.02 0.02 0 0 1 0.208 -0.978
                        A -0.7 -0.7 0 0 0 -0.208 -0.978
                        A -0.02 -0.02 0 0 1 -0.407 -0.914
                        A -1 -1 0 0 0 -0.588 -0.809
                        A 0.02 0.02 0 0 1 -0.743 -0.669
                        A -1 -1 0 0 0 -0.866 -0.5
                        A 0.02 0.02 0 0 1 -0.951 -0.309
                        A -1 -1 0 0 0 -0.995 -0.105
                        A 0.02 0.02 0 0 1 -0.995 0.105
                        A -1 -1 0 0 0 -0.951 0.309
                        A 0.02 0.02 0 0 1 -0.866 0.5
                        A -1 -1 0 0 0 -0.743 0.669
                        A 0.02 0.02 0 0 1 -0.588 0.809
                        A -1 -1 0 0 0 -0.407 0.914
                        A 0.02 0.02 0 0 1 -0.208 0.978
                        A -0.7 -0.7 0 0 0 0.208 0.978
                    "></path>

                    {/*Gear Size Definition*/}
                    <clipPath id="shape-mask" style={{transform: "scale(9.2)"}}> {/* style="transform: rotate(var(--rot)) scale(0.87)"*/}
                        <use href="#shape"/>
                    </clipPath>

                    {/*Gear Top Backlight Definition*/}
                    <filter id="lights">
                        <feDropShadow dx="0" dy="0.3" stdDeviation="0.1" floodOpacity="0.7" floodColor="rgb(24, 24, 25)"/>
                    </filter>

                    {/*Outer Shadow Definition*/}
                    <filter id="shadow">
                        <feDropShadow dx="0" dy="-1.2" stdDeviation="0.5" floodOpacity="0.7" floodColor="black"/> {/*Top Shadow*/}
                        <feDropShadow dx="0" dy="1.2" stdDeviation="0.5" floodOpacity="0.6" floodColor="black"/> {/*Bottom Shadow Outline*/}
                    </filter>

                    <symbol id="knobSymbol">
                        <g className="knobSVGGraphic">
                            {/*Outer Back Circle Outline*/}
                            <circle cx="0" cy="0" r="10" fill="rgb(26, 26, 27)" stroke="rgb(18, 18, 19)" strokeWidth="0.3"></circle>

                            <g filter="url(#shadow)"> {/*Outer Gear Bottom Shadow*/}
                                <g filter="url(#lights)"> {/*Outer Gear Top Backlight Shine*/}
                                    <g clipPath="url(#shape-mask)"> {/*Gear Shape Layer Mask (Cookie cut Main Gear Background*/}
                                        <rect x="-16" y="-16" width="32" height="32" fill="url(#shape-fill)"></rect> {/*Main Gear Background*/}
                                        <circle cx="0" cy="37" r="31" fill="rgba(250, 250, 255, .16)"></circle> {/*Top Overall Light Circle Shine*/}
                                        <circle cx="0" cy="0" r="8" stroke="rgba(28, 28, 29, .7)" strokeWidth="1.3"></circle> {/*Inner Outline*/}
                                        <circle cx="0" cy="0" r="7.5" fill="url(#metal-rings)" stroke="rgba(50, 50, 50, .8)" strokeWidth=".3"></circle> {/*Rings*/}
                                    </g>
                                </g>
                            </g>

                            {/*White Line*/}
                            <g>
                                <circle cx="0" cy="-9" r="1" fill="#111111"></circle>
                                <circle cx="0" cy="-9" r="0.7" fill="#DDDDD0"></circle>

                                <circle cx="0" cy="0" r="1.1" fill="#111111"></circle>

                                <rect x="-.9" y="-9" width="1.8" height="9" fill="#111111"></rect>
                                <rect x="-0.7" y="-9.04" width="1.4" height="9.04" fill="#DDDDD0"></rect>

                                <circle cx="0" cy="0" r="0.7" fill="#DDDDD0"></circle>
                            </g>
                        </g>
                    </symbol>
                </defs>
            </svg>
        )
    }

    return (
        <div id="knobContainer">
            <KnobSVG />
            <Knob num={1} />
            <Knob num={2} />
            <Knob num={3} />
            <Knob num={4} />
            <Knob num={5} />
            <Knob num={6} />
            <Knob num={7} />
            <Knob num={8} />
        </div>
    )
}