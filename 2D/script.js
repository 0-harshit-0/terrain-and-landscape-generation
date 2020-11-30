let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let s = new Shapes(ctx);

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', function(e) {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});
let xOff = 0.01;
let yOff = 0.01;
class Points {
	constructor(x, y) {
		this.pos = new Vector2D(x, y);
	}
	draw() {
		//s.line(this.pos.x, this.pos.y+canvas.height/2);
		s.circle(this.pos.x, this.pos.y+canvas.height/2, 2);
		s.fill('black');
	}
}
let temp = new Array();
let inc = canvas.width;
function animate() {
	inc += 2;
	temp.push(new Points(inc, perlin(xOff, yOff)*200));
	xOff+= 0.01;
	yOff += 0.01;
	//requestAnimationFrame(animate);
}

function animation() {
	animate();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.translate();
	temp.forEach(z => {
		if (z.pos.x < 0) {
			temp.splice(temp.indexOf(z), 1);
		}
		z.pos.x-= 1;
		z.draw();
	});
	requestAnimationFrame(animation);
}
animation();
