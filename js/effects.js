var kitType = "analog";

var instrument_player = [
    "sounds/drum-kits/" + kitType + "/kick.mp3",
    "sounds/drum-kits/" + kitType + "/snare.mp3",
    "sounds/drum-kits/" + kitType + "/hihat-closed.mp3",
    "sounds/drum-kits/" + kitType + "/hihat-open.mp3",
    "sounds/drum-kits/" + kitType + "/tom-low.mp3",
    "sounds/drum-kits/" + kitType + "/tom-mid.mp3",
    "sounds/drum-kits/" + kitType + "/tom-high.mp3",
    "sounds/drum-kits/" + kitType + "/clap.mp3",
    "sounds/drum-kits/" + kitType + "/ride.mp3"
];

function refreshInstrumentPlayer(){
    instrument_player = [
        "sounds/drum-kits/" + kitType + "/kick.mp3",
        "sounds/drum-kits/" + kitType + "/snare.mp3",
        "sounds/drum-kits/" + kitType + "/hihat-closed.mp3",
        "sounds/drum-kits/" + kitType + "/hihat-open.mp3",
        "sounds/drum-kits/" + kitType + "/tom-low.mp3",
        "sounds/drum-kits/" + kitType + "/tom-mid.mp3",
        "sounds/drum-kits/" + kitType + "/tom-high.mp3",
        "sounds/drum-kits/" + kitType + "/clap.mp3",
        "sounds/drum-kits/" + kitType + "/ride.mp3"
    ];
}
var drum_kick, drum_snare, drum_hihat_closed, drum_hihat_open, drum_tom_low, drum_tom_mid, drum_tom_high, drum_clap, drum_ride;

function loadPlayers() {
    drum_kick = new Tone.Player(instrument_player[0]);
    drum_snare = new Tone.Player(instrument_player[1]);
    drum_hihat_closed = new Tone.Player(instrument_player[2]);
    drum_hihat_open = new Tone.Player(instrument_player[3]);
    drum_tom_low = new Tone.Player(instrument_player[4]);
    drum_tom_mid = new Tone.Player(instrument_player[5]);
    drum_tom_high = new Tone.Player(instrument_player[6]);
    drum_clap = new Tone.Player(instrument_player[7]);
    drum_ride = new Tone.Player(instrument_player[8]);
}
var drumChannel = new Tone.Channel(0, 0);

var drumCompThresh = -30;
    var drumCompRatio = 3;

    var drumDistortionAmt = 0.03;

    var drumReverbAmt = 0.0;

function loadDrumConnections() {

    drum_kick.connect(drumChannel);
    drum_snare.connect(drumChannel);
    drum_hihat_closed.connect(drumChannel);
    drum_hihat_open.connect(drumChannel);
    drum_tom_low.connect(drumChannel);
    drum_tom_mid.connect(drumChannel);
    drum_tom_high.connect(drumChannel);
    drum_clap.connect(drumChannel);
    drum_ride.connect(drumChannel);

    

    var compressor = new Tone.Compressor(drumCompThresh, drumCompRatio);
    var drumDistortion = new Tone.Distortion(drumDistortionAmt);
    var drumReverb = new Tone.JCReverb(drumReverbAmt);

    drumChannel.chain(drumReverb,drumDistortion,compressor, Tone.Destination);

    
}

document.querySelector("#compThreshKnob").addEventListener("mod", function(){
    drumCompThresh = document.querySelector("#compThreshKnob").value;
    loadDrumConnections()
    console.log(drumCompThresh);
});
document.querySelector("#compRatioKnob").addEventListener("mod", function(){
    drumCompRatio = document.querySelector("#compRatioKnob").value;
    loadDrumConnections()
    //console.log(drumCompRatio);
});
document.querySelector("#drumDistortionKnob").addEventListener("mod", function(){
    drumDistortionAmt = document.querySelector("#drumDistortionKnob").value;
    loadDrumConnections()
    //console.log(drumDistortionAmt);
});
document.querySelector("#drumreverbAmount").addEventListener("mod", function(){
    drumReverbAmt = document.querySelector("#drumreverbAmount").value/10;
    loadDrumConnections()
    //console.log(drumReverbAmt);
});

var leadPitchShiftAmt = 0;
    var leadChorusFreq = 0;
    var leadChorusDelay = 0;
    var leadChorusDepth = 0;
    var leadFilterFreq = 30000;

function loadLeadConnections() {
    

    var pitchShift = new Tone.PitchShift(leadPitchShiftAmt);
    var chorus = new Tone.Chorus(leadChorusFreq, leadChorusDelay, leadChorusDepth);
    var filter = new Tone.Filter(leadFilterFreq, "lowpass");

    lead_synth.chain(pitchShift,chorus,filter,Tone.Destination); 
}

document.querySelector("#synthChorusFreqKnob").addEventListener("mod", function(){
    leadChorusFreq = document.querySelector("#synthChorusFreqKnob").value;
    loadDrumConnections()
    //console.log(leadChorusFreq);
});

document.querySelector("#synthChorusDelayKnob").addEventListener("mod", function(){
    leadChorusDelay = document.querySelector("#synthChorusDelayKnob").value;
    loadDrumConnections()
    //console.log(leadChorusDelay);
});
document.querySelector("#synthChorusDepthKnob").addEventListener("mod", function(){
    leadChorusDepth = document.querySelector("#synthChorusDepthKnob").value;
    loadDrumConnections()
    //console.log(leadChorusDepth);
});
document.querySelector("#synthPitchKnob").addEventListener("mod", function(){
    leadPitchShiftAmt = document.querySelector("#synthPitchKnob").value;
    loadDrumConnections()
    //console.log(leadPitchShiftAmt);
});