window.onload = function() {
    Nexus.context = Tone.context
    main()
}

function main() {
    initUI()
    initSynth()
    initMidi()
}

function initUI() {

    piano = new Nexus.Piano('#piano', {
        'size': [500, 170],
        'mode': 'button',  // 'button', 'toggle', or 'impulse'
        'lowNote': 48,
        'highNote': 73
    })

    piano.on('change', k => {
        synth.triggerAttackRelease(Tone.Midi(k.note).toNote())
    })

    reverb = new Nexus.Dial('#reverb', {
        size: [75, 75],
        interaction: 'radial', // "radial", "vertical", or "horizontal"
        mode: 'relative', // "absolute" or "relative"
        min: 0,
        max: 800,
        step: 1,
        value: 0
    })

    reverbNumber = new Nexus.Number('#reverbNumber', {
        'size': [60, 30],
        'value': 0,
        'min': 0,
        'max': 20000,
        'step': 1
    })

    reverbNumber.link(reverb)

    var oscilloscope = new Nexus.Oscilloscope('#oscilloscope', {
        'size': [300, 150]
    })

    oscilloscope.connect(Tone.Master)

}

function initSynth() {

    // synth = new Tone.Synth({
    //     oscillator: {
    //         type: 'triangle'
    //     },
    //     envelope: {
    //         attack: 0.005,
    //         decay: 0.1,
    //         sustain: 0.3,
    //         release: 1
    //     }
    // })

    synth = new Tone.AMSynth({
        harmonicity: 1,
        detune: -2,
        oscillator: {
            type: 'sine'
        }  ,
        envelope: {
            attack: 0.01,
            decay: 0.21,
            sustain: 1,
            release: 0.4
        }  ,
        modulation: {
            type: 'triangle'
        }  ,
        modulationEnvelope: {
            attack: 0.5,
            decay: 0,
            sustain: 1,
            release: 2.5
        }
    })

    // effect = new Tone.PingPongDelay(0.25, 1)
    // effect = new Tone.Vibrato()
    // effect = new Tone.Panner(0)

    effect = new Tone.Filter({
        type: 'highpass',
        frequency: 400,
        rolloff: -12,
        Q: 1,
        gain: 0
    })

    effect2 = new Tone.FeedbackDelay(0.1, 0.7)

    synth.chain(effect2, effect, Tone.Master)
}

function initMidi() {

    WebMidi.enable(function (err) {
        if (err) {
            console.log("WebMidi could not be enabled.", err)
        } else {
            console.log("WebMidi enabled!")
            console.log(WebMidi.outputs)

            mc = WebMidi.inputs[0]

            mc.addListener('noteon', 'all', function (evt) {
                console.log("NOTEON", evt.note)
                piano.toggleKey(evt.note.number)
                const note = Tone.Midi(evt.note.number).toNote()
                synth.triggerAttackRelease(note)
            })

            mc.addListener('noteoff', 'all', function (evt) {
                console.log("NOTEOFF", evt.note)
                piano.toggleKey(evt.note.number)
            })

            mc.addListener('controlchange', 'all', function (e) {
                console.log('CC', e.controller.number, e.value)
                if (e.controller.number === 5) {
                    reverb.value = map(e.value, 0, 127, 0, 800)
                    effect.frequency.value = map(e.value, 0, 127, 0, 800)

                }
            })

            mc.addListener('pitchbend', 'all', function (e) {
                console.log("PITCHBEND", e)
            })
        }
    })
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
}
