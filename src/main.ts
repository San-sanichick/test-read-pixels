const SIZE = 10;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const range = document.querySelector<HTMLInputElement>("#range")!;
const sizeSpan = document.querySelector<HTMLSpanElement>("#canvas-size")!;
sizeSpan.textContent = `${SIZE}`;

canvas.width = SIZE;
canvas.height = SIZE;
canvas.style.width = `${SIZE}px`;
canvas.style.height = `${SIZE}px`;

const gl = canvas?.getContext("webgl2")!;

if (!gl) throw new Error("No context");

function draw()
{
    gl.clearColor(1, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // requestAnimationFrame(draw);
}

draw();

const buf = new Uint8Array(4);

canvas.addEventListener("mousemove", e =>
{
    const x = e.clientX;
    const y = e.clientY;

    // gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    draw();
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    // console.log(x, SIZE - y);
    console.log(buf[0], buf[1], buf[2], buf[3]);
});


range.value = `${SIZE}`;

range.addEventListener("change", () =>
{
    const val = parseInt(range.value);
    sizeSpan.textContent = `${val}`;

    canvas.width = val;
    canvas.height = val;
    canvas.style.width = `${val}px`;
    canvas.style.height = `${val}px`;
    draw();
})
