<script>

    import {onMount} from 'svelte';
    import {MapUtils} from '$lib/map/_mapUtils.js';
    import {gsap} from '$lib/gsap.js'
    //-----------------------------------------

    //position is relative to map's transform.
    //(0,0) top-left corner, (mapWidth, mapHeight) bottom-right corner
    export let alignment;

    let position = {x: 0, y: 0};
    let alignmentOffsetDirection = {x: 0, y: 0, offsetX: 0, offsetY: 0};
    let offsetScale = {x: 1.0, y: 1.08}; //used in place for CSS margin

    let element;
    let revealed = false;
    let hovered = false;

    let targetOpacity = 0.5;
    let hoveredOpacity = 0.62;
    let bounds;


    /**
     *
     * @param x map position along x
     * @param y map position along y
     * @param width offset from center along x
     * @param height offset from center along y
     *
     */
    export const setPosition = ({x, y, width, height}) => {

        position.x = x + (width * alignmentOffsetDirection.x * offsetScale.x) + alignmentOffsetDirection.offsetX;
        position.y = y + (height * alignmentOffsetDirection.y * offsetScale.y) + alignmentOffsetDirection.offsetY;

        if (element) element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0px)`;

    }

    //check if element is in view to perform fancy animations or
    //other desired actions

    /**
     * @param boundsXMin Minimum bounds of map width
     * @param boundsXMax Maximum bounds of map width
     * @param boundsYMin Minimum bounds of map height
     * @param boundsYMax Maximum bounds of map height
     */
    export const inView = ({parentX, parentY, boundsXMin, boundsXMax, boundsYMin, boundsYMax}) => {

        const inBoundsX = (parentX > boundsXMin) && (parentX < boundsXMax);
        const inBoundsY = (parentY > boundsYMin) && (parentY < boundsYMax);
        return inBoundsX && inBoundsY;

    }

    export const show = () => {

        if (revealed === false) {
            revealed = true;
            gsap.to(element, {
                duration: 1.0,
                opacity: targetOpacity,
                delay: 0.35
            });
        }

    }

    const onHover = () => {

        hovered = !hovered;
        gsap.to(element, {
            duration: 0.2,
            opacity: hovered ? hoveredOpacity : targetOpacity
        });
    }

    const onLeave = () => {

        hovered = !hovered;
        gsap.to(element, {
            duration: 0.2,
            opacity: hovered ? hoveredOpacity : targetOpacity
        });
    }

    onMount(() => {

        gsap.set(element, {
            opacity: 0
        });

        setTimeout(() => {
            bounds = {width: element.clientWidth, height: element.clientHeight};
            alignmentOffsetDirection = MapUtils.getHandleAlignment(alignment, bounds);
        }, 300)

    });

    const handleResize = () => {

        bounds = {width: element.clientWidth, height: element.clientHeight};
        alignmentOffsetDirection = MapUtils.getHandleAlignment(alignment, bounds);
    }

</script>

<svelte:window on:resize={handleResize}></svelte:window>

<div class={revealed ? "social-handle revealed" : "social-handle"} bind:this={element} on:mouseenter={onHover}
     on:mouseleave={onLeave}>
    <slot></slot>
</div>

<style lang="scss">

  @import "../../scss/theme";

  .social-handle {

    position: absolute;
    display: inline-block;
    font-family: Cako;
    font-weight: normal;
    margin: 0;
    z-index: 1;
    pointer-events: none;
  }

  .revealed {
    pointer-events: auto;
  }

</style>
