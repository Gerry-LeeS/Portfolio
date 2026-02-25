const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let mouse = { x: -1000, y: -1000 };
const COUNT = 160;
let shootingStars = [];
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
document.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});
class Star {
	constructor() {
		this.reset();
	}
	reset() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.size = Math.random() * 1.6 + 0.2;
		this.twinkleSpeed = Math.random() * 0.015 + 0.003;
		this.twinklePhase = Math.random() * Math.PI * 2;
		this.baseOpacity = Math.random() * 0.7 + 0.15;
		this.vx = (Math.random() - 0.5) * 0.04;
		this.vy = (Math.random() - 0.5) * 0.04;
		const temp = Math.random();
		if (temp < 0.7) {
			this.r = 220 + Math.random() * 35;
			this.g = 225 + Math.random() * 30;
			this.b = 235 + Math.random() * 20;
		} else if (temp < 0.9) {
			this.r = 240 + Math.random() * 15;
			this.g = 220 + Math.random() * 20;
			this.b = 200 + Math.random() * 20;
		} else {
			this.r = 200 + Math.random() * 20;
			this.g = 210 + Math.random() * 20;
			this.b = 245 + Math.random() * 10;
		}
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.twinklePhase += this.twinkleSpeed;
		const dx = this.x - mouse.x,
			dy = this.y - mouse.y,
			d = Math.sqrt(dx * dx + dy * dy);
		if (d < 140) {
			const f = (140 - d) / 140;
			this.x += (dx / d) * f * 0.4;
			this.y += (dy / d) * f * 0.4;
		}
		if (this.x < -10) this.x = canvas.width + 10;
		if (this.x > canvas.width + 10) this.x = -10;
		if (this.y < -10) this.y = canvas.height + 10;
		if (this.y > canvas.height + 10) this.y = -10;
	}
	draw() {
		const twinkle = 0.4 + Math.sin(this.twinklePhase) * 0.6,
			op = this.baseOpacity * twinkle;
		if (this.size > 1.1) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${this.r | 0},${this.g | 0},${this.b | 0},${op * 0.04})`;
			ctx.fill();
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(${this.r | 0},${this.g | 0},${this.b | 0},${op})`;
		ctx.fill();
	}
}
class ShootingStar {
	constructor() {
		this.reset();
	}
	reset() {
		this.active = false;
		this.trail = [];
	}
	launch() {
		this.active = true;
		this.x = Math.random() * canvas.width * 0.8;
		this.y = Math.random() * canvas.height * 0.3;
		const a = Math.PI * 0.12 + Math.random() * 0.35,
			s = 7 + Math.random() * 5;
		this.vx = Math.cos(a) * s;
		this.vy = Math.sin(a) * s;
		this.life = 0;
		this.maxLife = 35 + Math.random() * 25;
		this.trail = [];
	}
	update() {
		if (!this.active) return;
		this.x += this.vx;
		this.y += this.vy;
		this.life++;
		this.trail.push({ x: this.x, y: this.y });
		if (this.trail.length > 18) this.trail.shift();
		if (this.life > this.maxLife) this.reset();
	}
	draw() {
		if (!this.active || this.trail.length < 2) return;
		const p = this.life / this.maxLife;
		for (let i = 1; i < this.trail.length; i++) {
			const t = i / this.trail.length;
			ctx.beginPath();
			ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
			ctx.lineTo(this.trail[i].x, this.trail[i].y);
			ctx.strokeStyle = `rgba(230,235,255,${t * (1 - p) * 0.5})`;
			ctx.lineWidth = t * 1.8;
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(255,255,255,${(1 - p) * 0.7})`;
		ctx.fill();
	}
}
for (let i = 0; i < COUNT; i++) stars.push(new Star());
for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());
setInterval(() => {
	const s = shootingStars.find((s) => !s.active);
	if (s && Math.random() < 0.35) s.launch();
}, 3500);
function drawConstellations() {
	const bright = stars.filter((s) => s.baseOpacity > 0.5 && s.size > 0.7);
	for (let i = 0; i < bright.length; i++) {
		for (let j = i + 1; j < bright.length; j++) {
			const dx = bright[i].x - bright[j].x,
				dy = bright[i].y - bright[j].y,
				d = Math.sqrt(dx * dx + dy * dy);
			if (d < 130) {
				ctx.beginPath();
				ctx.moveTo(bright[i].x, bright[i].y);
				ctx.lineTo(bright[j].x, bright[j].y);
				ctx.strokeStyle = `rgba(220,225,240,${0.08 * (1 - d / 130)})`;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			}
		}
	}
}
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	stars.forEach((s) => {
		s.update();
		s.draw();
	});
	drawConstellations();
	shootingStars.forEach((s) => {
		s.update();
		s.draw();
	});
	requestAnimationFrame(animate);
}
animate();
