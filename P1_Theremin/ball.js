const w = window.innerWidth
const h = window.innerHeight
let lastBallId = 1

class Ball {

	constructor(x, y, r=50, vx=0, vy=0) {
		this.r = r
		this.id = lastBallId++
		this.velocity = { x: vx, y: vy }
		this.position = { x: x, y: y }
		this.init()
	}

	init() {

		this.elem = document.createElement("div")
		this.elem.id = this.id
		this.elem.className = 'ball'
		document.body.appendChild(this.elem)

		this.elem.style.left = `${(w/2)-this.r}px`
		this.elem.style.top = `${(h/2)-this.r}px`
		this.elem.style.width = `${this.r*2}px`
		this.elem.style.height = `${this.r*2}px`

		if (window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", event => {
				this.velocity.x = Math.round(event.gamma)
				this.velocity.y = Math.round(event.beta)
			})
		}
		else {
			alert("Sorry, your browser doesn't support Device Orientation")
		}

		this.update()

		// Update position on click
		document.onmousemove = e => {
			this.position.x = e.clientX - this.r
			this.position.y = e.clientY - this.r
			var mx = e.clientX
			var my = e.clientY
			// osc.frequency.value = mx
			var novaAmp = Utils.map(my, 0, window.innerHeight, 0, 1)
			amp.gain.value = novaAmp
			var novaPan = Utils.map(mx, 0, window.innerWidth, 1, -1)
			panner.pan.value = novaPan
		}

	}

	update() {

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Detect colisions with edges of screen

		if (this.position.x > (w - 2*this.r) && this.velocity.x > 0) {
			this.position.x = w - 2*this.r
		}

		if (this.position.x < 0 && this.velocity.x < 0) {
			this.position.x = 0
		}

		if (this.position.y > (h - 2*this.r) && this.velocity.y > 0) {
			this.position.y = h - 2*this.r
		}

		if (this.position.y < 0 && this.velocity.y < 0) {
			this.position.y = 0
		}

		// Updates dimensions
		this.elem.style.top = `${this.position.y}px`
		this.elem.style.left = `${this.position.x}px`

		window.requestAnimationFrame(this.update.bind(this))

	}

}

// Might be useful for something later?
class Utils {
	static map(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
	}
}

window.onload = function() {
	new Ball(0, 0, 25)
}
