<script>

    import {onMount} from 'svelte';
    import {LANDING_STATE, QUAD_TYPE, SEQUENCE_MAP} from '$lib/_globals.js';
    import {stateStore} from '$lib/store/stores.js';

    import WebGLContext from '$lib/WebGL/WebGLContext.js';

    import {gsap} from '$lib/gsap.js'

    //---------------------------------

    export let className;
    export let imageElements;
    export let textElements;

    let isInitialized = false;

    let canvas;
    export let container;

    let webglContext;
    let domQuadManager;
    let t = 0;
    let prevT = 0;
    let blurTransitionParams = {phase: 0};

    onMount(() => {

        stateStore.subscribe(() => {

            if ($stateStore.state === LANDING_STATE) {
                revealQuads();
                applyBlurTransition(0);
            } else {
                hideQuads();
                applyBlurTransition(1);
            }

        });

    });

    export const init = () => {

        webglContext = new WebGLContext({el: canvas})
        domQuadManager = webglContext.domQuadManager;
        initBackground();
        initDomGLQuads();

        handleResize();

        isInitialized = true;
    }

    export const initDomGLQuads = () => {

        setTimeout(() => {

            imageElements.forEach(element => {

                if (!SEQUENCE_MAP[element.id]) {
                    domQuadManager.createQuad({
                        id: element.id,
                        type: QUAD_TYPE.image,
                        domElement: {
                            src: `images/map-v2/${element.fileName}`,
                            width: element.w,
                            height: element.h,
                            x: element.x,
                            y: element.y
                        },
                    })
                } else {
                    domQuadManager.createQuad({
                        id: element.id,
                        type: QUAD_TYPE.imageSequence,
                        domElement: {
                            src: SEQUENCE_MAP[element.id],
                            width: element.w,
                            height: element.h,
                            x: element.x,
                            y: element.y
                        },
                    })

                }
            });

        }, 300);

    }

    export const initBackground = () => {

        const circleAnchorPoints = [];

        textElements.forEach(element => {

            const anchorPoint = {x: element.circle.x, y: element.circle.y}
            circleAnchorPoints.push(anchorPoint);

        });

        webglContext.initBackground({circleAnchorPoints});

    }

    export const applyBlurTransition = (targetVal) => {

        gsap.to(blurTransitionParams, {
            duration: 2.0,
            phase: targetVal,
            onUpdate: () => {
                renderWBlur(blurTransitionParams.phase);
            }
        })

    }

    export const update = ({x, y, scale, imageElements}) => {

        let time = performance.now();
        let dt = (time - prevT) * 0.001;
        prevT = time;

        if(!isInitialized)
            return;

        t += dt;

        const mapTransform = {
            x: x,
            y: y,
            scale: scale
        }

        if (webglContext)
            webglContext.update({time: t, deltaTime: t, mapTransform, imageElements});
    };

    export const render = () => {

        if (webglContext)
            webglContext.render();

    };

    export const hideQuads = () => {

        if(domQuadManager)
        domQuadManager.hideQuads();

    }

    export const revealQuads = () => {
        if(domQuadManager)
        domQuadManager.revealQuads();
    }

    export const renderWBlur = (phase) => {

        if (webglContext)
            webglContext.renderWBlur({time: t, phase});

    };

    export const handleResize = () => {

        canvas.style.width = container.clientWidth + 'px';
        canvas.style.height = container.clientHeight + 'px';
        if (webglContext)
            webglContext.onResize({width:container.clientWidth, height:container.clientHeight});

    };

</script>

<canvas class="{className}" bind:this={canvas}></canvas>

<style lang="scss">

  .webgl-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 0px;
    z-index: 0;
    overflow: hidden;
  }

</style>
