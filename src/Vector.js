//Vector utility
export default class Vector extends Array {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z)
    }
    get x() {
        return this[0]
    }
    get y() {
        return this[1]
    }
    get z() {
        return this[2]
    }
    set x(value = 0) {
        this[0] = value
    }
    set y(value = 0) {
        this[1] = value
    }
    set z(value = 0) {
        this[2] = value
    }
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    sub(v = null) {
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
        return this
    }
    mult(v = 0) {
        this.x *= v
        this.y *= v
        this.z *= v
        return this
    }
    copy(v = null) {
        this.x = v.x
        this.y = v.y
        this.z = v.z
        return this
    }
    set(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
        return this
    }
    normalize() {
        let l = 1 / this.getLength();
        return this.mult(l)
    }
    static cross(u = null, v = null) {
        return new Vector(
            (u.y * v.z) - (u.z * v.y),
            (u.z * v.x) - (u.x * v.z),
            (u.x * v.y) - (u.y * v.x)
        )
    }
}
