# LPD8mk2

A visually responsive interface for the [LPD8 mk2](https://www.akaipro.com/lpd8-mk2.html).

<img src='./assets/preview.png'>


## About

This project aims to improve upon some aspects of the current LPD8 mk2 configuration program provided by AKAI. Some of these improvement:

- An interactive and visually responsive LPD8 mk2
- Redesign adhering to  the [Material UI](https://material.io) standard
- Added features for configurability of [LPD8 mk2 hardware settings](https://cdn.inmusicbrands.com/akai/LPD8/LPD8%20mk2%20-%20User%20Guide%20-%20v1.2.pdf) 
- Provide a full virtual experience with basic DAW functionality in future iterations.

## Dependencies
- [NodeJS/npm](https://nodejs.org/en)
- [WebMIDI enabled browser](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API#browser_compatibility) (most Chromium based browsers will work)

## Install
1. Download/clone the repository into a local folder.
2. Navigate to the local folder in your terminal using `cd folderPath`.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start your local server.
5. Enter the local host address `http://localhost:XXXX/` (shown in the terminal) into your browser. 

## Refactoring

This project is currently being refactored onto [React](https://react.dev) using [MUI](https://mui.com) and [JSX](https://facebook.github.io/jsx/).


## License

[Creative Commons Attribution-NonCommercial-ShareAlike (CC-BY-NC-SA)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

A creative commons license that bans commercial use and requires you to release any modified works under this license.