let players
var sequencer

Nexus.context = Tone.context

window.onload = function() {

    sequencer = new Nexus.Sequencer('#sequencer', {
        size: [400, 200],
        mode: 'toggle',
        rows: 4,
        columns: 8
    })

    sequencer.start(20000/120.0)

    players = new Tone.Players([
        "../sounds/kick.wav",
        "../sounds/clap.wav",
        "../sounds/hihat.wav",
        "../sounds/snare.wav"
    ], function () {
        console.log("All sounds loaded")
    }).toMaster()

    sequencer.on('step', function (colValues) {
        for (var i = 0; i < colValues.length; i++) {
            if (colValues[i] === 1) players.get(i).start()
        }
    })

    var number = new Nexus.Number('#bpm', {
        'size': [60, 30],
        'value': 120,
        'min': 40,
        'max': 220,
        'step': 10
    })
    document.getElementById("bpm").style.marginTop = "10px"
    number.value = 120

    number.on('change', function (v) {
        console.log("changed number")
        sequencer.interval.ms(20000.0/v)
    })

    var meter = new Nexus.Meter('#meter', {
        size: [50, 200]
    })
    meter.connect(Tone.Master)

    var c1 = 'rgb(200, 200, 200)'
    var c2 = 'rgb(100, 100, 100)'

    meter.colorize('accent', c2)
    meter.colorize('fill', c1)
    sequencer.colorize('accent', c1)

    var presets = new Nexus.Select('#presets', {
        'size': [100, 30],
        'options': [
            '',
            'rock',
            'house',
            'queen',
        ]
    })
    document.getElementById("presets").style.marginBottom = "20px"

    presets.on('change', function(v) {
        if (v.value === 'rock') {
            sequencer.matrix.set.all([
                [0,0,0,0,1,0,0,0],
                [1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
            ])
        }
        else if (v.value === 'house') {
            sequencer.matrix.set.all([
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,1,0],
                [0,0,0,0,1,0,0,0],
                [1,0,0,0,1,0,0,0],
            ])
        }
        else if (v.value === 'queen') {
            sequencer.matrix.set.all([
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,1,0,0,0],
                [1,0,1,0,0,0,0,0],
            ])
        }
    })

}
