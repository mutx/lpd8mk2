/*
	Only the LPD8 mk2 MIDI sysex protocol is supported
	LPD8 (original or Wi-Fi version) MIDI sysex is not supported.
*/


PROTOCOL = {
	SYSEX_START: 			[0xF0],
 	MAN_ID: 				[0x47],
 	HEADER: 				[0x7F, 0x4C],
 	SYSEX_END: 				[0xF7],
 	PROGRAM_GET: 			[0x03, 0x00, 0x01], // Software Program Request from Hardware
 	PROGRAM_SET: 			[0x01, 0x01, 0x29], // Software Program Send to Hardware
 	PROGRAM_REPLY: 			[0x03, 0x01, 0x29], // Program Return from Hardware
 	HEADER_PROGRAM_GET: 	[0xF0, 0x47, 0x7F, 0x4C, 0x03, 0x00, 0x01], // Pre-built headers
 	HEADER_PROGRAM_SET: 	[0xF0, 0x47, 0x7F, 0x4C, 0x01, 0x01, 0x29],
 	HEADER_PROGRAM_REPLY: 	[0xF0, 0x47, 0x7F, 0x4C, 0x03, 0x01, 0x29]
}

function PROTOCOL_buildMessage(...data) {
	let buffer = [];
	for (const block of data) {
		buffer.push(...block);
	}
	return buffer;
}

function PROTOCOL_getProgram(programNum) {
	return PROTOCOL_buildMessage(
		PROTOCOL.HEADER_PROGRAM_GET,
		[programNum],
		PROTOCOL.SYSEX_END
	);
}

function PROTOCOL_parseProgram(sysex) {

	let program = new LPD8_Program();

	// Globals
	program.setPG(sysex[7]);
	program.setGCH(sysex[8]);
	program.setPM(sysex[9]);
	program.setFL(sysex[10]);
	program.setTT(sysex[11]);

	// Pads/Knobs
	let padOffset = 12; // Index at which first pad begins
	let knobOffset = 140; // Index at which first knob begins
	for (let index = 1; index <= 8; ++index) {

		let pad = program.getPad(index);
		let totalPadOffset = (padOffset + ((index - 1) * 16)); // Start position of Pad index MIDI NT
		pad.setNT(sysex[totalPadOffset + 0]);
		pad.setCC(sysex[totalPadOffset + 1]);
		pad.setPG(sysex[totalPadOffset + 2]);
		pad.setCH(sysex[totalPadOffset + 3]);

		let _colorOn = {
			redOverflow: sysex[totalPadOffset + 4],
			redValue: sysex[totalPadOffset + 5],
			greenOverflow: sysex[totalPadOffset + 6],
			greenValue: sysex[totalPadOffset + 7],
			blueOverflow: sysex[totalPadOffset + 8],
			blueValue: sysex[totalPadOffset + 9],
		};
		let _colorOff = {
			redOverflow: sysex[totalPadOffset + 10],
			redValue: sysex[totalPadOffset + 11],
			greenOverflow: sysex[totalPadOffset + 12],
			greenValue: sysex[totalPadOffset + 13],
			blueOverflow: sysex[totalPadOffset + 14],
			blueValue: sysex[totalPadOffset + 15],
		};
		let colorOn = {
			r: _colorOn.redValue + (_colorOn.redOverflow * 128),
			g: _colorOn.greenValue + (_colorOn.greenOverflow * 128),
			b: _colorOn.blueValue + (_colorOn.blueOverflow * 128),
		};
		let colorOff = {
			r: _colorOff.redValue + (_colorOff.redOverflow * 128),
			g: _colorOff.greenValue + (_colorOff.greenOverflow * 128),
			b: _colorOff.blueValue + (_colorOff.blueOverflow * 128),
		};

		pad.setColorOn(colorOn);
		pad.setColorOff(colorOff);

		let knob = program.getKnob(index);
		let totalKnobOffset = (knobOffset + ((index - 1) * 4));
		knob.setCC(sysex[totalKnobOffset + 0]);
		knob.setCH(sysex[totalKnobOffset + 1]);
		knob.setMin(sysex[totalKnobOffset + 2]);
		knob.setMax(sysex[totalKnobOffset + 3]);
	}

	return program;
}

function MIDI_getIOPorts() {
	return new Promise((resolve, reject) => {

		let inputOpenPort = null;
		let outputOpenPort = null;

		// Get MIDI input
		for (const entry of LPD8.midi.access.inputs) {
			if (entry[1].name == "LPD8 mk2") {
				inputOpenPort = entry[1].open();
			}
		}

		if (!inputOpenPort) {
			return reject(new Error("MIDI PORT IN NOT FOUND"));
		}

		// Get MIDI output
		for (const entry of LPD8.midi.access.outputs) {
			if (entry[1].name == "LPD8 mk2") {
				outputOpenPort = entry[1].open();
			}
		}

		if (!outputOpenPort) {
			return reject(new Error("MIDI PORT OUT NOT FOUND"));
		}

		Promise.all([inputOpenPort, outputOpenPort])
			.then((ports) => {
				for (const port of ports) {
					if (port.state === "connected") {
						if (port.type === "input") {
							LPD8.midi.in = port;
						} else if (port.type === "output") {
							LPD8.midi.out = port;
						}
					} else {
						console.log("MIDI Port successful connection, but MIDIPort.state status not connected");
						return reject(new Error("MIDI PORT STATUS NOT CONNECTED"));
					}
				}
				resolve();
			})
			.catch((error) => {
				console.log("Input/Output MIDI Port Request Error: " + error.toString());
				return reject(new Error("MIDI PORT OPEN ERROR: " + error.toString()));
			});
	});
}

function MIDI_connectLPD8() {
	return new Promise((resolve, reject) => {
		if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess({sysex:true})
				.then((access) => {
					LPD8.midi.access = access;
					MIDI_getIOPorts()
						.then(() => {
							LPD8.midi.access.onstatechange = (event) => {
								if (event.port.state === "disconnected") {
									M.toast({text: "Disconnected"});
									MIDI_disconnectLPD8();
									UI_connectBtnSetDisconnect();
								}
							};
							LPD8.midi.connected = true;
							return resolve();
						})
						.catch((error) => {
							return reject(error)
						});
				})
				.catch((error) => {
					return reject(new Error("MIDI access request failed; " + error));
				});
		} else {
			return reject(new Error("Browser does not support MIDI"));
		}
	});
}

function MIDI_disconnectLPD8() {
	return new Promise((resolve, reject) => {
		LPD8.midi.connected = false;
		LPD8.midi.access = null;
		if (LPD8.midi.in !== null) {
			if (typeof LPD8.midi.in.close === "function") {
				LPD8.midi.in.close();
			}
			LPD8.midi.in = null;
		}
		if (LPD8.midi.out !== null) {
			if (typeof LPD8.midi.out.close === "function") {
				LPD8.midi.out.close();
			}
			LPD8.midi.out = null;
		}
		LPD8_reset();
		resolve();
	});
}

function MIDI_getProgram(programNum) {
	return new Promise((resolve, reject) => {
		if (
			typeof programNum !== typeof 1 		||
			programNum < 0 || programNum > 4
		) return reject(new Error("Invalid argument"));

		if (LPD8.midi.connected) {

			let oldFunc = LPD8.midi.in.onmidimessage;
			LPD8.midi.in.onmidimessage = (msg) => {

				let isReply = true;
				for (let index = 0; index <= 6; ++index) { // Header check
					if (msg.data[index] != PROTOCOL.HEADER_PROGRAM_REPLY[index]) {
						isReply = false;
					}
				}

				if (isReply) {
					let program = PROTOCOL_parseProgram(msg.data);
					LPD8.programs[programNum] = program;
					LPD8.midi.in.onmidimessage = oldFunc;
					return resolve(program);
				} else if (typeof oldFunc === "function") {
					oldFunc(msg);
				}
			};

			LPD8.midi.out.send(PROTOCOL_getProgram(programNum));

		} else {
			return reject(new Error("No MIDI connection"));
		}
	});
}

