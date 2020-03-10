let right = 0
let left = 0
tianPeng.colorLight(0xff0000)
basic.forever(function () {
    left = Math.randomRange(-100, 100)
    right = Math.randomRange(-100, 100)
    tianPeng.setWheels(left, right)
    basic.pause(1000)
})
