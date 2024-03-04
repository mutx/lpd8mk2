import React from 'react';

import MuiToggleButton from '@mui/material/ToggleButton';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
    Grid,
    Stack,
    Button,
    Divider,
    Typography,
    CircularProgress,
    createTheme,
    useTheme,
    hexToRgb,
} from '@mui/material';
import { ThemeProvider } from '@emotion/react';


export default function LPD8_MenuTopBar({props}) {

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


    // Button Clicked Mode Changed: 'Demo Live Configure'
    const handleMode = (event, newMode) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    }

    
    // Connect/Disconnect MIDI Controller
    const onConnectClick = () => {
        if (getConnectStatus() === "disconnected") {
            connectController();
        } else if (getConnectStatus() === "connecting") {
            disconnectController();
        } else if (getConnectStatus() === "connected") {
            disconnectController();
        }
    };

    function connectController() {
        setConnectStatus("connecting");
    }

    const disconnectController = () => {
        setConnectStatus("disconnected");

    }

    let theme = useTheme();
    console.log(theme)
    const buttonTheme = createTheme({
        components: {
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        color: 'rgba(230, 230, 230, .9)',
                        backgroundColor: 'rgba(100, 100, 100, .1)',
                        '&:not(.Mui-selected):hover': {
                        },
                        '&:not(.Mui-selected):not(:hover)': {
                            transform: 'scale(0.90)',
                        },
                        '&:disabled': {
                            color: theme.palette.secondary.main,
                            opacity: 0.5,
                            filter: 'saturate(0.5)'
                        }
                    },
                },
            },
        },
    });


    return (<>
        <ThemeProvider  theme={buttonTheme}>
            <MuiToggleButtonGroup
                color="secondary"
                value={getMode()}
                exclusive={true}
                onChange={handleMode}
                aria-label="Current Mode"
                fullWidth={false}
            >
                <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                    columnSpacing={0}
                    rowSpacing={0}
                    style={{'marginTop': '.1rem'}}
                    
                >
                    
                    <Grid item style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        transform: 'translateY(30%)'
                    }}>
                        <Button
                            variant={(
                                (getConnectStatus() === "connected") ? "outlined" : (
                                (getConnectStatus() === "connecting") ? "text" : (
                                (getConnectStatus() === "disconnected") ? "contained" :
                                ""
                            )))}
                            color={(
                                (getConnectStatus() === "connected") ? "error" : (
                                (getConnectStatus() === "connecting") ? "info"  : (
                                (getConnectStatus() === "disconnected") ? "success" : 
                                ""
                            )))}
                            onClick={onConnectClick}
                        >
                            {(
                                (getConnectStatus() === "connected") ? "Disconnect" : (
                                (getConnectStatus() === "connecting") ? (
                                    <>
                                        <CircularProgress thickness={4} size="1rem" style={{marginRight: '1rem'}} color="info" />
                                        Connecting
                                    </>
                                ) : (
                                (getConnectStatus() === "disconnected") ? "Connect" : ""
                            )))}
                        </Button>
                    </Grid>

                    <Grid item>
                        <Grid container>

                            <Grid item alignItems="center" justifyContent="center" >
                                <Divider
                                    orientation="vertical"
                                    variant='middle'
                                    color="gray"
                                    style={{
                                        marginRight: '1rem',
                                        marginLeft: '1rem',
                                        maxHeight: '45%',
                                        marginTop: '100%'
                                    }}
                                />
                            </Grid>

                            <Grid item>
                                <Grid container direction='column'>

                                    <Grid item xs={12} lg='auto' md='auto' sm='auto'>

                                        <Divider
                                            orientation='horizontal'
                                            variant='middle'
                                            color="gray"
                                            sx={{
                                                "&::before, &::after": {
                                                    borderColor: "gray",
                                                },
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    color: 'rgba(245, 245, 245, .7)',
                                                    userSelect: 'none'
                                                }}
                                                variant="button"
                                                spacing={2}
                                            >
                                                Mode
                                            </Typography>
                                        </Divider>
                                    </Grid>

                                    <Grid item xs={12} lg='auto' md='auto' sm='auto'>
                                        <Stack spacing={0} alignItems="center" direction='row'>
                                            <MuiToggleButton value="demo" aria-label="Demo">
                                                Demo
                                            </MuiToggleButton>
                                            <MuiToggleButton value="configure" aria-label="Configure" disabled={true}>
                                                Configure
                                            </MuiToggleButton>
                                            <MuiToggleButton value="live" aria-label="Live" disabled={true}>
                                                Live
                                            </MuiToggleButton>
                                        </Stack>
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            </MuiToggleButtonGroup>
        </ThemeProvider>
    </>);

}