
//--------------
//variables to init at runtime
//--------------
var ts_num = 4;
var ts_den = 4;
var tempo = 115;

const TIME_FUTURE = 0.05;
const start = 8;
var count = start;
var playing = false;
let cur_sequence;
const GAIN_LEAD = 0.6;
let first = true;

//--------------
//temp variables that can be made into dials and other selectors
//--------------
var kitType = "analog";
var dial_tempo = 100;
var boolPlayMode = 0;
var playedOnce = 0;
//player_length is the amount of notes to generate AFTER the seed. so play_length=40 is in total length 48
const player_length = 16;
const arp_pattern_length = 16;
//I think turning this up will make the generated beat have more notes
const temperature_drum = 1.5;
//Seed for pattern
var seed_pattern = [
    [0, 2],
    [],
    [1, 7],
    [],
    [0, 2],
    [],
    [1, 7],
    []
];
var arp_seq_limit = 50;
var temperature_arp = 1.0;

const lead_gain = new Tone.Gain(GAIN_LEAD);
var lead_synth = new Tone.Synth()
loadLeadConnections();

function loadLeadConnections() {

    var cheb = new Tone.Chebyshev(40);

    lead_synth.connect(cheb);

    var pitchShift = new Tone.PitchShift(-4);
    var chorus = new Tone.Chorus(10, 5, 0.5);
    var filter = new Tone.Filter(2000, "lowpass");

    cheb.connect(pitchShift);
    pitchShift.connect(chorus);
    chorus.connect(filter);
    filter.toMaster();
}


lead_gain.toMaster();

function toPiano() {
    lead_synth = new Tone.Sampler({
        'A0': 'A0.[mp3|ogg]',
        'C1': 'C1.[mp3|ogg]',
        'D#1': 'Ds1.[mp3|ogg]',
        'F#1': 'Fs1.[mp3|ogg]',
        'A1': 'A1.[mp3|ogg]',
        'C2': 'C2.[mp3|ogg]',
        'D#2': 'Ds2.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'C3': 'C3.[mp3|ogg]',
        'D#3': 'Ds3.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'C4': 'C4.[mp3|ogg]',
        'D#4': 'Ds4.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'C5': 'C5.[mp3|ogg]',
        'D#5': 'Ds5.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'C6': 'C6.[mp3|ogg]',
        'D#6': 'Ds6.[mp3|ogg]',
        'F#6': 'Fs6.[mp3|ogg]',
        'A6': 'A6.[mp3|ogg]',
        'C7': 'C7.[mp3|ogg]',
        'D#7': 'Ds7.[mp3|ogg]',
        'F#7': 'Fs7.[mp3|ogg]',
        'A7': 'A7.[mp3|ogg]',
        'C8': 'C8.[mp3|ogg]'
    }, {
        'baseUrl': 'sounds/salamander/'
    }).toMaster();

    lead_synth.release = 3;
    lead_synth.volume.value = 3;
}

var cur_note = "";

//--------------
//temporary call to hide buttons until load is clicked
//--------------
// $("#play").hide();
$("#stop").hide();

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
var drum_kick, drum_snare, drum_hihat_closed, drum_hihat_open, drum_tom_low, drum_tom_mid, drum_tom_high, drum_clap, drum_ride;

loadPlayers();

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
loadDrumConnections();
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

    var drumCompThresh = -30;
    var drumCompRatio = 3;

    var drumDistortionAmt = 0.03;

    var drumReverbAmt = 0.04;

    var compressor = new Tone.Compressor(drumCompThresh, drumCompRatio).toDestination();
    var drumDistortion = new Tone.Distortion(drumDistortionAmt);
    var drumReverb = new Tone.JCReverb(drumReverbAmt);

    drumChannel.connect(drumReverb);
    drumReverb.connect(drumDistortion);
    drumDistortion.connect(compressor);

    compressor.toMaster()
}
async function loadTone() {
    await Tone.start();
    console.log('Tone.js is Ready');
}



function playInstrument(row_value, time) {
    if (!time) {
        time = 0;
    }
    if (row_value == 0) {
        drum_kick.start(time + TIME_FUTURE);
    } else if (row_value == 1) {
        drum_snare.start(time + TIME_FUTURE);
    } else if (row_value == 2) {
        drum_hihat_closed.start(time + TIME_FUTURE);
    } else if (row_value == 3) {
        drum_hihat_open.start(time + TIME_FUTURE);
    } else if (row_value == 4) {
        drum_tom_low.start(time + TIME_FUTURE);
    } else if (row_value == 5) {
        drum_tom_mid.start(time + TIME_FUTURE);
    } else if (row_value == 6) {
        drum_tom_high.start(time + TIME_FUTURE);
    } else if (row_value == 7) {
        drum_clap.start(time + TIME_FUTURE);
    } else if (row_value == 8) {
        drum_ride.start(time + TIME_FUTURE);
    }
}

document.querySelector("#play").addEventListener("click", function () {
    $("#play").hide();
    $("#stop").show();
    if(first){
        first=false;
        loadTone();
        runArp();
    }
    scheduleTimeOn();
});

document.querySelector("#stop").addEventListener("click", function () {
    $("#stop").hide();
    $("#play").show();
    scheduleTimeOff();
});

document.querySelector("#generate").addEventListener("click", function () {
    let cur_seq = drum_to_note_sequence(seed_pattern);
    sequenceInit();

    runArp();

});

function runArp() {
    let s_seq = [
        {
            note: 58,
            time: Tone.now()
        }];

    let c_prg = Tonal.Note.pc(Tonal.Note.fromMidi(58)[0]) + "M";
    predictArpSequence(58, s_seq, c_prg);
}

//------------------------------
// initiate drum seed buttons
//------------------------------
addDrumUI();
function addDrumUI() {
    let stepButtons = document.querySelectorAll(".deepdrum-step-buttons");

    for (var x = 0; x < stepButtons.length; x++) {
        stepButtons[x].addEventListener("click", function (event) {
            button = event.target;

            let index = parseInt(button.id.split("_")[2]);
            let sound = parseInt(button.id.split("_")[1]);

            if (button.classList.contains("deepdrum-on")) {
                button.classList.remove("deepdrum-on");

                seed_pattern[index].splice(seed_pattern[index].indexOf("sound"), 1);

            }
            else {
                button.classList.add("deepdrum-on");
                seed_pattern[index].push(sound);
            }
        });
    }

    //label play for beats
    let stepLabels = document.querySelectorAll(".drum-row-title");

    for (var x = 0; x < stepLabels.length; x++) {
        stepLabels[x].addEventListener("click", function (event) {
            playInstrument(event.target.id.split("_")[1]);
        });
    }
}

//------------------------------
// Load default seed into buttons
//------------------------------
loadSeed();
function loadSeed() {
    for (var x = 0; x < seed_pattern.length; x++) {
        for (var y = 0; y < seed_pattern[x].length; y++) {
            document.querySelector("#drum_" + seed_pattern[x][y] + "_" + x).classList.add("deepdrum-on");
        }
    }
}

//------------------------------
// master scheduler time ON
//------------------------------
function scheduleTimeOn() {
    tempo = dial_tempo;
    Tone.Transport.bpm.value = tempo;

    Tone.Transport.scheduleRepeat(playPattern, "8n");

    Tone.Transport.start();
    playing = true;
}

//------------------------------
// master scheduler time OFF
//------------------------------
function scheduleTimeOff() {
    Tone.Transport.stop();
    count = 0;
    chordIdx = 0;
    bassIdx = 0;
    arpCount = 0;
    step = 0;
    gen_arp_idx = 0;
    indicator_count = 0;
    count_display_timeline = 0;
    Tone.Transport.cancel();
    playing = false;
}


//------------------------------
// PLAY
//------------------------------
function playPattern(time) {

    //iterate through drum sequence to play sounds
    for (let x = 0; x < sequence[count].length; x++) {
        playInstrument(sequence[count][x], time);
    }

    let note = cur_sequence[count - start];

    if (note != "" && note != null) {
        lead_synth.triggerAttackRelease(note, "8n", time + TIME_FUTURE);
    }

    //reset count when reaching end of array
    count = count + 1;
    if (count >= sequence.length) {
        count = start;
        runArp();
    }
}



//Machine learning stuff


//this is getting the model for the drum machine learning
let drums_rnn = new mm.MusicRNN("https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/drum_kit_rnn");
drums_rnn.initialize();

//setting up improv
let improv_rnn = new mm.MusicRNN('https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/chord_pitches_improv');
improv_rnn.initialize();

//called at runtime but shouldnt be later on
let cur_seq = drum_to_note_sequence(seed_pattern);

//---------------------------------
// drum to note sequence formation
//---------------------------------
function drum_to_note_sequence(quantize_tensor) {
    var notes_array = [];
    var note_index = 0;
    for (var i = 0; i < quantize_tensor.length; i++) {
        var notes = quantize_tensor[i];
        if (notes.length > 0) {
            for (var j = 0; j < notes.length; j++) {
                notes_array[note_index] = {};
                notes_array[note_index]["pitch"] = notes[j];
                notes_array[note_index]["startTime"] = i * 0.5;
                notes_array[note_index]["endTime"] = (i + 1) * 0.5;
                note_index = note_index + 1;
            }
        }
    }

    return mm.sequences.quantizeNoteSequence(
        {
            ticksPerQuarter: 220,
            totalTime: quantize_tensor.length / 2,
            timeSignatures: [
                {
                    time: 0,
                    numerator: ts_num,
                    denominator: ts_den
                }
            ],
            tempos: [
                {
                    time: 0,
                    qpm: tempo
                }
            ],
            notes: notes_array
        },
        1
    );
}

//sequenceInit is called from runtime though it shouldnt be later on

sequenceInit();
runArp();
let sequence;

async function sequenceInit() {

    predicted_sequence = await drums_rnn
        .continueSequence(cur_seq, player_length, temperature_drum)
        .then(r => seed_pattern.concat(note_to_drum_sequence(r, player_length)));

    sequence = predicted_sequence;
}


//---------------------------------
// note to drum sequence formation
//---------------------------------
function note_to_drum_sequence(seq, pLength) {
    let res = [];
    for (var i = 0; i < pLength; i++) {
        empty_list = [];
        res.push(empty_list);
    }
    for (let { pitch, quantizedStartStep } of seq.notes) {
        res[quantizedStartStep].push(reverseMidiMapping.get(pitch));
    }
    return res;
}

//--------------------------------
// build arpeggiator sequence
//--------------------------------
function buildArpSequence(seed) {
    var notes = [{
        0: {
            pitch: seed[0]["note"],
            quantizedStartStep: 0,
            quantizedEndStep: 1
        }
    }];

    return {
        totalQuantizedSteps: 1,
        quantizationInfo: {
            stepsPerQuarter: 1
        },
        notes: notes
    };
}

//--------------------------------
// predict arpeggiator sequence
//--------------------------------
async function predictArpSequence(n, s, c, idx) {
    cur_sequence = [];
    await improv_rnn
        .continueSequence(buildArpSequence(s), arp_seq_limit, temperature_arp, [c])
        .then(function (r) {
            res_notes = construct_arpeggio(r, arp_seq_limit);
            for (var i = 0; i < arp_pattern_length; i++) {
                if (res_notes[i] == undefined) {
                    cur_sequence[i] = res_notes[0];
                } else {
                    cur_sequence[i] = res_notes[i];
                }
            }
        });
    cur_sequence = cur_sequence;

    return cur_sequence;
}

//---------------------------------
// construct arpeggio sequence
//---------------------------------
function construct_arpeggio(seq, pLength) {
    let res = [];
    res.push(cur_note);
    for (let { pitch, quantizedStartStep } of seq.notes) {
        res.push(Tonal.Note.fromMidi(pitch));
    }
    res.filter(n => n);
    return res;
}