import { useEffect } from 'react';

import './lpd8.css';

import createVirtualLPD8State from './components/lpd8_virtual_state.jsx';
import createMenuState from './components/lpd8_menu_state.jsx';
import LPD8_Virtual from './components/lpd8_virtual.jsx';
import LPD8_Menu from './components/lpd8_menu.jsx';

import Stack from '@mui/material/Stack';
import { Grid, Divider } from '@mui/material';


export default function LPD8App() {

    let lpd8State = createVirtualLPD8State();
    let menuState = createMenuState();

    // Initialization
    useEffect(() => {
        if (lpd8State.demo.demoMode) {
            lpd8State.set.controlPad('NOTE');
            for (let knobIndex in lpd8State.knobDegStates) {
                let randDeg = (Math.random() * (lpd8State.settings.knobs.knobDegMax - lpd8State.settings.knobs.knobDegMin));
                let randNeg = Math.random() > 0.5 ? 1 : -1;
                let deg = randDeg * randNeg;
                lpd8State.set.knobDeg(knobIndex, deg);
            }
            for (let padIndex in lpd8State.padStates) {
                lpd8State.set.padDown(padIndex, false);
                let randColor = {
                    up: {
                        r: Math.random() * 255,
                        g: Math.random() * 255,
                        b: Math.random() * 255,
                        a: 1    
                    },
                    down: {
                        r: Math.random() * 255,
                        g: Math.random() * 255,
                        b: Math.random() * 255,
                        a: .8
                    }
                }
                lpd8State.set.padColor(padIndex, randColor);
            }
        }
    }, []);

    return (<>
        <Stack spacing={2}>
            <LPD8_Virtual props={lpd8State} />
            <Grid container spacing={0} alignItems="center" justifyContent="center">
                <Grid item xs={10}>
                    <Divider variant="middle" color="gray" aria-hidden="true" />
                </Grid>
            </Grid>
            <LPD8_Menu props={menuState} />
        </Stack>
    </>)
}