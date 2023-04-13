<script>

    import {createEventDispatcher, onMount} from 'svelte';
    import RenderUtils from '$lib/utils/RenderUtils.js';
    import {CanvasUtils} from '$lib/utils/CanvasUtils.js';

    let canvas;
    let buffer;

    let startTime = -1;
    let duration = 5000;
    let isComplete = false;

    const dispatch = createEventDispatcher();

    export const start = () => {
        console.log("start");
        startTime = Date.now();
    }

    export const stop = () => {
        startTime = -1;
    }

    const handleDraw = ({time}) => {

        const ratio = startTime > -1 ? (Date.now() - startTime) / duration : 0;

        if (buffer.width > 0) {

            buffer.clear();
            const ctx = buffer.ctx;

            if (ratio > 0)

                if (ratio > 1) {

                    if (!isComplete) {
                        isComplete = true;
                        dispatch("complete");
                        console.log('complete!');
                    }

                }

            const angle = Math.PI * 2 * Math.min(1, ratio);

            ctx.beginPath();
            ctx.strokeStyle = '#aaaaaa';
            ctx.lineWidth= 3;
            ctx.ellipse(buffer.width >> 1, buffer.height >> 1, buffer.width / 2- 3, buffer.width / 2- 3, 0, 0, angle);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = '#aaaaaa';
            ctx.ellipse(buffer.width >> 1, buffer.height >> 1, buffer.width / 2- 25, buffer.width / 2- 25, 0, 0, Math.PI * 2);
            ctx.fill();
        }

    }

    const handleResize = () => {
        if (buffer)
            buffer.resizeToDisplaySize()
    }

    onMount(() => {
        buffer = CanvasUtils.CreateBuffer(canvas);
        const frame = RenderUtils.CreateLoop(handleDraw);
        handleResize();
        return () => cancelAnimationFrame(frame);
    });

</script>

<svelte:window on:resize={handleResize }/>

<div>
    <canvas bind:this={canvas}></canvas>
</div>

<style lang="scss">

  div {
    position: absolute;
    top: -125px;
    left: 0;

    canvas {
      width: 100px;
      height: 100px;
    }
  }

</style>