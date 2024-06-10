<template>
    <div class="character-draw">
        <div class="canvas" @mousedown="drawStart" @mousemove="draw" @mouseup="drawEnd">
            <canvas ref="canvas" />
        </div>
        <div class="mini">
            <canvas ref="mini" />
        </div>

        <div class="buttons">
            <button class="sm" @click="clear">Clear</button>
            <button
                :class="['sm', { autoclearOn: autoClear, autoclearOff: !autoClear }]"
                @click="autoClear = !autoClear"
            >
                <svg width="11" height="9">
                    <path
                        stroke="currentColor"
                        stroke-width="1.5"
                        d="m.536 5.023 2.812 2.812 7-7"
                        fill="none"
                        fill-rule="evenodd"
                    />
                </svg>
                <span> Auto Clear </span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'character-draw',
    data() {
        return {
            autoClear: true,
            clearOnNext: true
        };
    },
    mounted() {
        this.initCanvas();
    },
    methods: {
        initCanvas() {
            this.canvas = this.$refs.canvas;
            this.canvas.willReadFrequently = true;

            this.context = this.canvas.getContext('2d');
            this.context.imageSmoothingEnabled = true;
            this.context.imageSmoothingQuality = 'high';

            this.canvasSize = this.canvas.clientWidth;
            this.canvas.width = this.canvasSize;
            this.canvas.height = this.canvasSize;

            this.context.strokeStyle = 'white';
            this.context.lineWidth = this.canvasSize / 15;

            this.mini = this.$refs.mini;
            this.mini.width = this.mini.clientWidth;
            this.mini.height = this.mini.clientHeight;
            this.miniContext = this.mini.getContext('2d');

            if (this.mini.width !== 28 || this.mini.height !== 28) {
                console.error('Mini canvas must be 28x28 pixels');
            }
        },

        clear() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.miniContext.clearRect(0, 0, this.mini.width, this.mini.height);
        },

        drawStart(e) {
            if (this.clearOnNext) {
                this.clear();
            }

            this.drawing = true;
            this.context.beginPath();
            this.draw(e);
        },

        draw(e) {
            if (!this.drawing) {
                return;
            }

            this.clearOnNext = false;

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            this.context.lineCap = 'round';

            this.context.strokeStyle = 'rgba(255, 255, 255, 1)';
            this.context.lineWidth = this.canvasSize / 15;
            this.context.lineTo(x, y);
            this.context.stroke();

            const { top, left, right, bottom } = this.getPixelBounds(this.context);

            let w = right - left;
            let h = bottom - top;
            let l = left;
            let t = top;

            // wider than tall`
            if (w > h) {
                t -= (w - h) / 2;
                h = w;
            }

            // taller than wide
            else {
                l -= (h - w) / 2;
                w = h;
            }

            // update the mini canvas
            this.miniContext.clearRect(0, 0, this.mini.width, this.mini.height);
            this.miniContext.drawImage(this.canvas, l, t, w, h, 4, 3, 22, 22);
        },

        getPixelBounds(ctx) {
            const width = this.canvas.width;
            const height = this.canvas.height;
            const imageData = ctx.getImageData(0, 0, width, height).data;

            let top = height,
                left = width,
                right = 0,
                bottom = 0;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = imageData[index];
                    const g = imageData[index + 1];
                    const b = imageData[index + 2];

                    // Check if the pixel is not black
                    if (!(r === 0 && g === 0 && b === 0)) {
                        if (x < left) left = x;
                        if (x > right) right = x;
                        if (y < top) top = y;
                        if (y > bottom) bottom = y;
                    }
                }
            }

            return { top, left, right, bottom };
        },

        imageChanged() {
            // extract the pixel data from the mini (this returns a flat array of RGBA values,
            // where every pixel is represented by 4 consecutive values in the array)
            const imageData = this.miniContext.getImageData(
                0,
                0,
                this.mini.width,
                this.mini.height
            ).data;

            // collapse the pixel data into a single channel (greyscale) by averaging the RGB values
            const grayscale = new Array(28 * 28).fill(0);

            for (let i = 0; i < grayscale.length; i++) {
                const pixelStart = i * 4;
                const r = pixelStart;
                const g = pixelStart + 1;
                const b = pixelStart + 2;
                const a = pixelStart + 3;

                // amount of white as a value between 0 and 255
                const white = (imageData[r] + imageData[g] + imageData[b]) / 3;
                const alphaFloat = imageData[a] / 255;
                const whiteAlpha = white * alphaFloat;

                grayscale[i] = whiteAlpha;
            }

            this.$emit('changed', grayscale);
        },

        drawEnd() {
            this.drawing = false;
            this.imageChanged();

            if (this.autoClear) {
                setTimeout(() => {
                    this.clearOnNext = true;
                }, 1000);
            }
        },

        getMiniContext() {
            return this.miniContext;
        }
    }
};
</script>

<style lang="scss">
.character-draw {
    width: 280px;
    height: 280px;
    position: relative;

    canvas {
        width: 100%;
        height: 100%;
        background-color: black;
    }

    .canvas {
        width: 280px;
        height: 280px;
    }

    .mini {
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 28px;
        height: 28px;
        // border: 1px solid white;
        // width: 30px;
        // height: 30px;
    }

    .buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        justify-content: center;
    }

    .autoclearOn,
    .autoclearOff {
        padding-left: 1.5em;
        padding-right: 1.5em;
        svg {
            margin-right: 0.25em;
        }
    }
    .autoclearOn {
        svg {
            margin-left: -0.75em;
        }
        span {
            margin-right: -0.25em;
        }
    }
    .autoclearOff {
        span {
            margin-left: -1em;
        }
        svg {
            opacity: 0;
        }
    }
}
</style>
