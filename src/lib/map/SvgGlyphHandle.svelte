<script>

    import {onMount} from 'svelte';
    import {MapUtils} from '$lib/map/_mapUtils.js';

    //-----------------------------------------

    //position is relative to map's transform.
    //(0,0) top-left corner, (mapWidth, mapHeight) bottom-right corner
    export let alignment;

    let position = {x: 0, y: 0};
    let alignmentOffsetDirection = {x: 0, y: 0, offsetX: 0, offsetY: 0};
    let offsetScale = {x: 1.0, y: 1.0}; //used in place for CSS margin

    let element;
    let revealed = false;
    let targetOpacity = 1.0;

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
    export const inView = ({boundsXMin, boundsXMax, boundsYMin, boundsYMax}) => {

        const inBoundsX = (position.x > boundsXMin) && (position.x < boundsXMax);
        const inBoundsY = (position.y > boundsYMin) && (position.y < boundsYMax);
        return inBoundsX && inBoundsY;

    }

    export const show = () => {

        if (revealed === false) {
            revealed = true;
            gsap.to(element, {
                duration: 1.0,
                opacity: targetOpacity,
            });
        }

    }

    const handleResize = () => {
        bounds = {width: element.clientWidth, height: element.clientHeight};
        alignmentOffsetDirection = MapUtils.getHandleAlignment(alignment, bounds);
    }

    onMount(() => {

        setTimeout(() => {
            bounds = {width: element.clientWidth, height: element.clientHeight};
            alignmentOffsetDirection = MapUtils.getHandleAlignment(alignment, bounds);
        }, 100);

        gsap.set(element, {
            opacity: 0
        });

    });

</script>

<svelte:window on:resize={handleResize}></svelte:window>

<div class="svg-glyph-handle" bind:this={element}>
    <slot></slot>
</div>

<style lang="scss">

  @import "../../scss/theme";

  .svg-glyph-handle {

    position: absolute;
    pointer-events: none;
    margin: 0;
    padding: 0;

  }

</style>