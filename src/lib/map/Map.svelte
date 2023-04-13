<script>

    import {stateStore, pledgeStore} from '$lib/store/stores.js';
    import {
        QUESTIONS_STATE,
        SUBSCRIBE_STATE,
        LANDING_STATE,
        SHARE_STATE,
        MAP_TRANSFORM,
        GLOBALS
    } from '$lib/_globals.js';
    import MapLandingSectionMobile from './MapLandingSectionMobile.svelte';
    import MapLandingSection from './MapLandingSection.svelte';
    import MapSection from './MapSection.svelte';
    import {MapUtils} from '$lib/map/_mapUtils.js';
    import NavArrow from '../ui/NavArrow.svelte';
    import {createEventDispatcher} from 'svelte';

    //------------------------------------------

    export let textElements;
    export let imageElements;
    export let svgElements;
    export let handles;
    export let sectionCircleReference;
    export let isLoaded;
    export let device;

    let collectionCount = 0;
    let activeSection;
    let dispatch = createEventDispatcher();

    //------------------------------------------


    export const handleDraw = ({time, deltaTime}) => {

        if (!sectionCircleReference)
            return;

        const lines = MapUtils.getLines(MAP_TRANSFORM.x, MAP_TRANSFORM.y, MAP_TRANSFORM.scale, time, textElements, GLOBALS.MOBILE);

        if (lines) {
            //find line without intersection, ythis should be the currently selected one...
            const active = lines ? lines.find(obj => obj.intersection === null) : null;
            setActiveSection(active ? active.textElement : null);

            transformElements(handles);
            transformElements(svgElements);

            transformTextElements({x: MAP_TRANSFORM.x, y: MAP_TRANSFORM.y, scale: MAP_TRANSFORM.scale, lines});

            if ($stateStore.state === LANDING_STATE)
                transformImageElements({x: MAP_TRANSFORM.x, y: MAP_TRANSFORM.y, scale: MAP_TRANSFORM.scale});

        }
    }

    const getSocialLink = (name)=>{
        return "https://www.instagram.com/" + name.replace("@", '');
    }

    const transformElements = (elements) => {

        var i = elements.length;
        while (i--) {
            if (MapUtils.inView(elements[i])) {
                if (!elements[i].isVisible && elements[i].element)
                    elements[i].element.style.opacity = '1';
                elements[i].isVisible = true;
                if (elements[i].element)
                    elements[i].element.style.transform = 'translate(' + (MAP_TRANSFORM.x + elements[i].x * MAP_TRANSFORM.scale) + 'px, ' +
                        (MAP_TRANSFORM.y + elements[i].y * MAP_TRANSFORM.scale) + 'px) scale(' + MAP_TRANSFORM.scale + ',' + MAP_TRANSFORM.scale + ')';
            } else {
                if (elements[i].isVisible || elements[i].isVisible === undefined && elements[i].element)
                    elements[i].element.style.opacity = '0';
                elements[i].isVisible = false;
            }
        }
    }

    const transformTextElements = ({x, y, scale, lines}) => {

        textElements.forEach((entry, i) => {
                if (entry.section && entry.section.setPosition) {
                    entry.section.setPosition(x, y, scale);

                    if (lines) {
                        const line = lines.find(line => line.id === entry.id);

                        if (line && line.intersection) {
                            entry.navElement.style.transform = 'translate(' + line.intersection.x + 'px, ' + line.intersection.y + 'px) rotate(' + line.rotation + 'rad) ';
                        }
                    }
                }
            }
        );
    }

    //consider renaming this to somthing more generic as it would be uneccsary to loop again
    //in order to check if handles are in view
    const transformImageElements = ({x, y, scale, mW, mH}) => {

        imageElements.forEach(imageElement => {

            //assign position with center of image as origin (more intuitive and is necessary for the webglContext)
            const imageElementWidth = (imageElement.w * 0.5) * scale;
            const imageElementHeight = (imageElement.h * 0.5) * scale;

            let mapPosX = x + ((imageElement.x * scale) + imageElementWidth);
            let mapPosY = y + ((imageElement.y * scale) + imageElementHeight);

            //compute parallax
            let dirX = (mapPosX - MAP_TRANSFORM.viewportCenter.x);
            let dirY = (mapPosY - MAP_TRANSFORM.viewportCenter.y);

            let dist = Math.sqrt(dirX * dirX + dirY * dirY);
            let offsetScale = dist * MAP_TRANSFORM.parallaxScale;
            let parallaxOffset = {x: dirX * offsetScale, y: dirY * offsetScale};

            mapPosX += parallaxOffset.x;
            mapPosY += parallaxOffset.y;

            imageElement.currentPos.x = mapPosX;
            imageElement.currentPos.y = mapPosY;

            if (imageElement.socialHandle) {

                imageElement.socialHandle.setPosition({
                    x: mapPosX,
                    y: mapPosY,
                    width: imageElementWidth,
                    height: imageElementHeight
                });

                const handleInView = imageElement.socialHandle.inView({
                    parentX: mapPosX,
                    parentY: mapPosY,
                    boundsXMin: 0,
                    boundsXMax: MAP_TRANSFORM.windowSize.x,
                    boundsYMin: 0,
                    boundsYMax: MAP_TRANSFORM.windowSize.y
                });

                if (handleInView) imageElement.socialHandle.show();

            }

        });

    }

    /**
     * Sets active section, playing/stoping the element animation
     *
     * @param section : TextElement | null
     */
    const setActiveSection = (section) => {
        if (activeSection !== section) {

            const id = section && section.id;

            if (activeSection && activeSection.section) {
                activeSection.section.stop();

                if (activeSection.section.navElement)
                    activeSection.section.navElement.classList.add('visible');
            }

            activeSection = section;

            if (section && section.section) {
                section.section.start();
                section.navElement.classList.remove('visible');
            }
        }
    }

    const handleNavArrow = (index) => {
        dispatch('navigate', {index});
    }

</script>

<div class="map-container">

    {#each textElements as entry, index (entry.id)}

        {#if entry.id === "SECTION-00"}

            {#if device === "mobile"}
                <MapLandingSectionMobile entry="{entry}" bind:this={textElements[index].section}
                                         isLoaded="{isLoaded}"/>
            {:else}
                <MapLandingSection entry="{entry}" bind:this={textElements[index].section} isLoaded="{isLoaded}"/>
            {/if}

        {:else}
            <MapSection entry="{entry}" bind:this={textElements[index].section}
                        on:complete={()=> collectionCount ++}
                        isLoaded="{isLoaded}"/>
        {/if}


        <div class="nav-item"
             class:visible={$stateStore.state !== QUESTIONS_STATE && $stateStore.state !== SUBSCRIBE_STATE && $stateStore.state !== SHARE_STATE}
             bind:this={textElements[index].navElement}
             class:isLoaded
             on:click={() => handleNavArrow(index)}>
            <NavArrow id={entry.id} isActive="{$pledgeStore <= (index - 1)}"
                      showArrow="{$stateStore.state === LANDING_STATE}"/>
        </div>

    {/each}

    {#if $stateStore.state === LANDING_STATE}
        {#each svgElements as element, i}
            <div class="svg-container svg-{element.id}" style="width:{element.w}px;height:{element.h}px;"
                 bind:this={svgElements[i].element}>
                {@html element.svg}
            </div>
        {/each}


        {#each handles as handle, i}
            <a class="social-link" href={getSocialLink(handle.id)} bind:this={handles[i].element} target="_blank">
                {handle.id}</a>
        {/each}
    {/if}

    <slot/>

</div>

<style lang="scss">

  @import "../../scss/theme";

  .map-container {
    width: 100%;
    height: 100%;
    clip-path: inset(0% 0% 0% 0% round 0%);
    transition: clip-path 1200ms 800ms $expo-out;

    .nav-item {
      position: absolute;
      width: 0;
      height: 0;
      left: 0;
      top: 0;
      z-index: $nav-index;
      transform-origin: center;
      opacity: 0;
      transition: opacity 2000ms;

      &.visible {
        opacity: 1;
      }

      &:not(.isLoaded) {
        opacity: 0;
      }
    }

    .social-link {
      position: absolute;
      font-family: Cako;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      /* or 31px */
      transition: opacity 500ms;
      opacity: 0;
      margin-top:-1em;
      color: rgba(255, 255, 255, 0.7);

      &:hover{
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }

  .svg-container {

    position: absolute;
    width: fit-content;
    height: fit-content;
    opacity: 0;
    transition: opacity 500ms;

    :global(svg) {
      width: 100%;
      height: 100%;
    }

    :global(circle) {
      stroke-dasharray: 300;
      stroke-dashoffset: 300;
      animation: dash 2000ms 0s infinite alternate;
    }

    :global(path) {
      stroke-dasharray: 100;
      stroke-dashoffset: 200;
      animation: dash 1700ms 0s infinite alternate;
    }
  }

  :global(main) {
    &.questions, &.subscribe, &.share, &.pledge {
      .clip-container {

        transition: clip-path 1200ms 800ms $expo-out;
        @include clipBorder;
      }

      :global(.social-link) {
        opacity: 0;
      }
    }
  }

</style>