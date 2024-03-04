import {useState} from 'react';

let config = {
    mode: 'demo', //  Demo, Live, Configure
    connectionStatus: "disconnected",
}


export default function createMenuState() {

    const [mode, setMode] = useState(config.mode);
    const [status, setStatus] = useState(config.connectionStatus);

    const menuState = {
        modeState: {
            mode,
            setMode
        },
        connectState: {
            status,
            setStatus
        }
    };

    return menuState;
}