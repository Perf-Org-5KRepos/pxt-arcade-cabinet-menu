let admin = false;
let menuelts: string[] = [];
let cursor = 0;
let offset = 0;
let bcount = 0;
const logo = img`
    . . 3 . . . 3 3 3 . . . 3 . . . 1 . . . 1 . 1 1 1 . 1 . 1 . 1 1 1 . 1 1 1 . 1 1 1 . 1 1 . . 1 1 1
    . 3 . . . . . 3 . . . . . 3 . . 1 1 . 1 1 . 1 . 1 . 1 1 . . 1 . . . 1 . . . 1 . 1 . 1 . 1 . 1 . .
    . 3 . . 3 3 3 3 3 3 3 . . 3 . . 1 . 1 . 1 . 1 1 1 . 1 . 1 . 1 1 . . 1 . . . 1 . 1 . 1 . 1 . 1 1 .
    . 3 . . 3 3 3 3 3 3 3 . . 3 . . 1 . . . 1 . 1 . 1 . 1 . 1 . 1 1 1 . 1 1 1 . 1 1 1 . 1 1 . . 1 1 1
    . 3 . . 3 3 3 3 3 . 3 . . 3 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    3 . . . 3 3 3 3 3 . . . . . 3 . . 1 1 1 . . 1 1 1 1 . . . 1 1 1 . . . 1 1 1 . . 1 1 1 . . 1 1 1 1
    . 3 . . 3 3 3 3 3 . 3 . . 3 . . 1 . . . 1 . 1 . . . 1 . 1 . . . 1 . 1 . . . 1 . 1 . . 1 . 1 . . .
    . 3 . . 3 3 3 3 3 3 3 . . 3 . . 1 . . . 1 . 1 . . . 1 . 1 . . . . . 1 . . . 1 . 1 . . 1 . 1 . . .
    . 3 . . 3 3 3 3 3 3 3 . . 3 . . 1 1 1 1 1 . 1 1 1 1 . . 1 . . . . . 1 1 1 1 1 . 1 . . 1 . 1 1 1 .
    . 3 . . . . . . . . . . . 3 . . 1 . . . 1 . 1 . . . 1 . 1 . . . 1 . 1 . . . 1 . 1 . . 1 . 1 . . .
    . . 3 . . . . . . . . . 3 . . . 1 . . . 1 . 1 . . . 1 . . 1 1 1 . . 1 . . . 1 . 1 1 1 . . 1 1 1 1
`
function move(dx: number) {
    let nc = cursor + dx
    if (nc < 0) nc = 0
    else if (nc >= menuelts.length) nc = menuelts.length - 1
    if (nc - offset < 2) offset = nc - 2
    if (nc - offset > 5) offset = nc - 5
    if (offset < 0) offset = 0
    cursor = nc
}

function select() {
    control.runProgram(menuelts[cursor])
}

function del() {
    if (!admin) return;

    const name = menuelts[cursor];
    if (game.ask(`delete ${name}`, `are you sure?`)) {
        control.deleteProgram(name);
        menuelts.removeAt(0);
        move(0);
    }
}

function showMenu() {
    menuelts = control.programList()
    menuelts = menuelts.filter(s => s && s[0] != ".")

    cursor = 0
    offset = 0


    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        move(1)
    })
    controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
        move(1)
    })

    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        move(-1)
    })
    controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
        move(-1)
    })

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        select()
    })

    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        control.runInBackground(del)
    })

    game.onPaint(function () {
        screen.fillRect(0, 0, 160, 20, 12)
        screen.drawTransparentImage(logo, 4, 4)
        for (let i = 0; i < 9; ++i) {
            let e = menuelts[i + offset] || "";
            e = e.split('_').join(' ')
            e = e.split('-').join(' ')
            let y = 25 + i * 11
            if (i + offset == cursor) {
                screen.fillRect(0, y - 2, 160, 11, 5)
                screen.print(e, 10, y, 15)
            }
            else
                screen.print(e, 10, y, 1)
        }
    })
}

const menuBootSequence = new storyboard.BootSequence(done => {
    let phase = 0
    let lg = swarm.swarmInSprite(logo, 100, 0.5, () => {
        phase = 1
    });

    game.onUpdate(function () {
        if (!phase)
            return
        if (phase++ == 10) {
            phase = 20
            lg.vy = -100;
            lg.ay = 100;
            lg.vx = -103;
            lg.ax = 103;
        }
        if (lg.top <= 4 && done) {
            done();
            done = undefined;
        }
    })

}, 0);

scene.systemMenu.addEntry(
    () => !admin ? "SHOW ADMIN MODE" : "HIDE ADMIN MODE",
    () => admin = !admin
    , img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . c c c c c c c . . . . .
        . . . c c . . . . . c c c . . .
        . . c c . . . . . . . . c c . .
        . c c . . c c c c c . . . c . .
        . c c c c c c c c c c c c c c .
        . . c . c . c . c . c . c . . .
        . . c . c . c . c . c . c . . .
        . . c . c . c . c . c . c . . .
        . . c . c . c . c . c . c . . .
        . . c . c . c . . . c . c . . .
        . . c . . . c . . . c . c . . .
        . . c . . . . . . . . . c . . .
        . . c c c c c c c c c c c . . .
        . . . . . . . . . . . . . . . .
    `)

storyboard.microsoftBootSequence.register()
menuBootSequence.register();
storyboard.registerScene("menu", showMenu)
storyboard.start()
