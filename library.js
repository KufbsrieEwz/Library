let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
c.imageSmoothingEnabled = false
class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(that) {
        return new Vector2(this.x + that.x, this.y + that.y)
    }
    multiply(that) {
        return new Vector2(this.x * that, this.y * that)
    }
    toPolar() {
        return {
            a: Math.atan2(this.y, this.x),
            r: Math.sqrt(this.x ** 2 + this.y ** 2)
        }
    }
    normalize() {
        return Vector2.polar(this.toPolar().a, 1)
    }
    inBoundsRect(thatMin, thatMax) {
        let relativeThis = this.add(thatMin.multiply(-1))
        return (
            (
                0 < relativeThis.x
                &&
                relativeThis.x < thatMax.x
            )
            &&
            (
                0 < relativeThis.y
                &&
                relativeThis.y < thatMax.y
            )
        )
    }
    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y))
    }
    ceil() {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y))
    }
    copy() {
        return new Vector2(this.x, this.y)
    }
}
Vector2.unit = new Vector2(1, 1)
Vector2.zero = new Vector2(0, 0)
Vector2.polar = (a, r) => {
    return new Vector2(Math.cos(a), Math.sin(a)).multiply(r)
}
Vector2.random = () => {
    return new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1)
}
class Colour {
    constructor(r, g, b, a) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
}
Colour.white = new Colour(255, 255, 255, 1)
Colour.black = new Colour(0, 0, 0, 1)
Colour.red = new Colour(255, 0, 0, 1)
Colour.green = new Colour(0, 255, 0, 1)
Colour.blue = new Colour(0, 0, 255, 1)
Colour.yellow = new Colour(255, 255, 0, 1)
Colour.cyan = new Colour(0, 255, 255, 1)
Colour.magenta = new Colour(255, 0, 255, 1)
Colour.orange = new Colour(255, 165, 0, 1)
Colour.purple = new Colour(128, 0, 128, 1)
Colour.pink = new Colour(255, 192, 203, 1)
Colour.brown = new Colour(165, 42, 42, 1)
Colour.gray = new Colour(128, 128, 128, 1)
Colour.lime = new Colour(0, 255, 0, 1)
Colour.teal = new Colour(0, 128, 128, 1)
Colour.navy = new Colour(0, 0, 128, 1)
Colour.maroon = new Colour(128, 0, 0, 1)
Colour.olive = new Colour(128, 128, 0, 1)
Colour.aqua = new Colour(0, 255, 255, 1)
Colour.forest = new Colour(0, 128, 0, 1)
Colour.random = () => {
    return new Colour(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1)
}
Colour.blend = (colour, otherColour, ratio = 0.5) => {
    let r = Math.round(colour.r * ratio + otherColour.r * (1 - ratio))
    let g = Math.round(colour.g * ratio + otherColour.g * (1 - ratio))
    let b = Math.round(colour.b * ratio + otherColour.b * (1 - ratio))
    let a = Math.round(colour.a * ratio + otherColour.a * (1 - ratio))
    return new Colour(r, g, b, a)
}
function drawRect(pos, dim, colour) {
    c.fillStyle = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
    c.fillRect(pos.x, pos.y, dim.x, dim.y)
}
function drawLine(list, colour) {
    c.strokeStyle = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
}
function drawPoly(list, colour) {
    c.strokeStyle = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
    c.fill()
}
function drawArc(pos, rad, sa, ea, clock, colour) {
    c.strokeStyle = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
    c.fillStyle = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
    c.beginPath()
    c.arc(pos.x, pos.y, rad, sa, ea, !clock)
    c.stroke()
    c.fill()
}
function drawImg(img, cropPos, cropDim, pos, dim) {
    c.drawImage(img, cropPos.x, cropPos.y, cropDim.x, cropDim.y, pos.x, pos.y, dim.x, dim.y)
}
function write(text, pos, colour) {
    c.font = '20px Arial'
    c.fillStyle = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
    c.fillText(text, pos.x, pos.y)
}
function clear() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
}
class Scene {
    constructor(tilemap) {
        this.tilemap = tilemap
        this.objects = {}
        this.uis = {}
        this.time = 0
        this.deltaTime = 0
        this.frame = 0
    }
    add(thing) {
        if (scene.objects[thing.id] != undefined) {
            console.error(`An object already exists with ID ${thing.id}\nIf you would like to set the object please use scene.set()`)
        } else {
            scene.objects[thing.id] = thing
            return thing.id
        }
    }
    addUI(thing) {
        if (scene.uis[thing.id] != undefined) {
            console.error(`A UI object already exists with ID ${thing.id}\nIf you would like to set the object please use scene.set()`)
        } else {
            scene.uis[thing.id] = thing
            return thing.id
        }
    }
    set(thing) {
        scene.objects[thing.id] = thing
    }
    setUI(thing) {
        scene.uis[thing.id] = thing
    }
    tilemapAt(pos) {
        return this.tilemap[Math.floor(pos.y / 250)][Math.floor(pos.x / 250)]
    }
}
class SceneObject {
    constructor(value, id = Math.random()) {
        this.value = value
        this.id = id
    }
}
