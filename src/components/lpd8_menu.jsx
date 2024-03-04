import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import LPD8_MenuTopBar from './menu/lpd8_menu_topbar.jsx';
import LPD8_MenuConfig from './menu/lpd8_menu_config.jsx';
import {
    Stack,
    Divider,
    Grid
} from '@mui/material';



export default function LPD8_Menu({props}) {

    let getMode = () => {
        return props.modeState.mode;
    }
    let setMode = (mode) => {
        props.modeState.setMode(mode);
    }

    let setConnectStatus = (status) => {
        props.connectState.setStatus(status);
    }
    let getConnectStatus = () => {
        return props.connectState.status;
    }

    // Show menu based on current mode
    function _CurrentMenu({props}) {
        if (getMode() === 'configure' && getConnectStatus() === 'connected') {
            return (<>
                <LPD8_MenuConfig props={props} />
            </>)
        }
        return (<></>)
    }
    

    return (<>
        <Stack spacing={2} alignItems="center">
            
            <Grid container justifyItems='center' alignItems='center' direction='column'>

                <Stack spacing={2} alignItems="center">
                    <Grid item xs={12} md='auto' sm='auto' lg='auto'>
                        <LPD8_MenuTopBar props={props}/>
                    </Grid>
                    
                    <Divider
                        color="gray"
                        aria-hidden="true"
                        sx={{width: 1}}
                        md='auto'
                        lg='auto'
                        sm='auto'
                        xs={12}
                        variant='inset'
                    />
                </Stack>
            </Grid>

            <Grid container spacing={0} alignItems="center" justifyContent="center">
                <Grid item xs={12}>

                    <_CurrentMenu props={props}/>
                
                </Grid>
            </Grid>


        </Stack>
    </>)
}