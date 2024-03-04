// Previous itereation of the connect button to be converted to React compoent.

/* Connect Button 

let connectBtn = document.getElementById("connectBtn");
let connectBtnText = document.getElementById("connectBtnText");
let connectBtnProg = document.getElementById("connectBtnProg");

connectBtn.CurrentColor = "teal";

connectBtn.ChangeColor = function(color) {
	connectBtn.classList.add(color);
	connectBtn.classList.remove(connectBtn.CurrentColor);
	connectBtn.CurrentColor = color;
}

connectBtn.SetConnect = function() {
	connectBtn.ChangeColor("teal");
	connectBtnText.innerHTML = "Connect";
}

connectBtn.SetDisconnect = function() {
	connectBtn.ChangeColor("red");
	connectBtnText.innerHTML = "Disconnect";
}

connectBtn.addEventListener("click", event => {
	if (!LPD8.midi.connected) {
		connectBtn.ChangeColor("orange");
		connectBtnText.innerHTML = "Connecting...";
		connectBtnProg.style.visibility = "visible";

		MIDI_connectLPD8()
			.then(() => { // Success
				connectBtn.SetDisconnect();
				M.toast({text: "Connected"});
				MIDI_getProgram(0) // Ram
					.then((program) => {
						LPD8_setProgram(program);
						MIDI_getProgram(1);
					}).then((program) => {
						MIDI_getProgram(2);
					}).then((program) => {
						MIDI_getProgram(3);
					}).then((program) => {
						MIDI_getProgram(4);
					})
					.catch((error) => {
						console.log(error);
						M.toast({text: "Error retrieving program(s) from device: " + error.toString()});
					});
			})
			.catch((error) => {
				console.log("catch " + error);
				M.toast({text: error.toString()});
				connectBtn.SetConnect();
			})
			.finally(() => {
				connectBtnProg.style.visibility = "hidden";
			});

	} else {
		MIDI_disconnectLPD8()
			.then(() => {
				M.toast({text: "Disconnected"});
			})
			.catch((error) => {
				M.toast({text: error.toString()});
			})
			.finally(() => {
				connectBtn.SetConnect();
			});
	}
});

*/