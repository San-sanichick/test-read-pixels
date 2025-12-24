let SIZE = 10;
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

const fb = gl.createFramebuffer();

function makeTexture(size: number, fb: WebGLFramebuffer, oldTex?: WebGLTexture)
{
    if (oldTex)
    {
        gl.deleteTexture(oldTex);
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        size,
        size,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return tex;
}

let tex = makeTexture(SIZE, fb);


function draw()
{
    gl.clearColor(1, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.clearColor(1, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

draw();

const buf = new Uint8Array(4);

canvas.addEventListener("mousemove", e =>
{
    const x = e.clientX;
    const y = e.clientY;

    draw();

    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb);
    gl.readPixels(x, SIZE - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);

    console.log(buf[0], buf[1], buf[2], buf[3]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
});


range.value = `${SIZE}`;

range.addEventListener("change", () =>
{
    const val = parseInt(range.value);
    SIZE = val;
    sizeSpan.textContent = `${val}`;

    canvas.width = val;
    canvas.height = val;
    canvas.style.width = `${val}px`;
    canvas.style.height = `${val}px`;

    tex = makeTexture(SIZE, fb, tex);
    draw();
})
