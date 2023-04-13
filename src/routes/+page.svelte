
<script>
    import {
        GLOBALS,
        LANDING_STATE,
        MAP_TRANSFORM,
        PLEDGE_STATE,
        QUESTIONS_STATE,
        SHARE_STATE,
        SUBSCRIBE_STATE
    } from '$lib/_globals.js';
    import {SVG_ELEMENTS} from '$lib/svg/_svgMap.js';
    import {fade} from 'svelte/transition';
    import {onMount, tick} from 'svelte';
    import {pledgeStore, questionsStore, shapesStore, stateStore, subscribeStore} from '$lib/store/stores.js';
    import mapJson from '../svg/map-svg.json';
    import Loader from '../lib/Loader.svelte';
    import WebGLCanvas from '../lib/WebGLCanvas.svelte';
    import RenderUtils from '$lib/utils/RenderUtils.js';
    import {MapUtils} from '$lib/map/_mapUtils.js';
    import {content, ManifestoCopy, PledgeCopy, QuestionsCopy} from '$lib/_copy.js';
    import ButtonBorder from '../lib/ui/ButtonBorder.svelte';
    import Pledge from '../lib/pledge/Pledge.svelte';
    import FabLogo from '../lib/ui/FabLogo.svelte';
    import Questions from '../lib/questions/Questions.svelte';
    import Subscribe from '../lib/subscribe/Subscribe.svelte';
    import CloseButton from '../lib/ui/CloseButton.svelte';
    import Share from '../lib/share/Share.svelte';
    import Map from '../lib/map/Map.svelte';
    import {TimeUtils} from '$lib/utils/TimeUtils.js';

    //----------------------------------

    let lastUpdate = -1;
    let isResized = true;
    let container;
    let webglCanvas;
    let downPosition = null;
    let startPosition = {x: 0.5, y: 0.5};
    let destPosition = {x: 0, y: 0};
    let position = {
        x: 0,
        y: 0
    };
    let device;
    let isLoaded;
    let isReady = false;
    let map;
    let svgElements = [];
    let imageElements = [];
    let textElements = ManifestoCopy.concat();
    let handles = [];

    let sectionCircleReference;

    let shareImage = content.meta_image || 'https://digital.fashion/The-fabricant-share-img.png';

    //-----------------------------------

    onMount(async () => {

        //prevent zoom ios..
        document.addEventListener('gesturestart', e => {
            e.preventDefault()
        });

        // const uaParser = new ();
        // device = uaParser.getResult().device['type'];
        GLOBALS.device = ''//device'';

        loadShapes();

        //trigger resize to initialize positions...
        handleResize();

        isReady = true;

        //initialize position in center..
        position.x = destPosition.x = 0.5;
        position.y = destPosition.y = 0.5;

        //show landing section...
        textElements[0].section.show();

        //initialize state
        if (window.location.href.match('localhost'))
            setState(LANDING_STATE)
        else
            setState(LANDING_STATE);

        const frame = RenderUtils.CreateLoop(handleDraw);

        await TimeUtils.timeout(2000);
        isLoaded = true;
        webglCanvas.init();

        return () => cancelAnimationFrame(frame);
    });

    subscribeStore.subscribe(() => {
        if ($subscribeStore) {

            if (window.location.href.match('digital.fashion')) {
                var expires = '';
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                var expires = '; expires=' + date.toUTCString();
                document.cookie = 'subscribed=true' + expires + '; path=/';
            }

            setState(SHARE_STATE);

        }
    });

    questionsStore.subscribe(value => {
        if (value.answers.length === QuestionsCopy.length) {
            setState(SUBSCRIBE_STATE);
        }
    })

    pledgeStore.subscribe(value => {
        if (value === PledgeCopy.length) {
            //wait for last pledge transition...
            setTimeout(() => {
                $questionsStore.answers = [];
                setState(QUESTIONS_STATE);
            }, 3000);
        }
    });

    stateStore.subscribe(value => {

        switch (value.state) {
            case LANDING_STATE:
                //reset position in center..
                position.x = destPosition.x = 0.5;
                position.y = destPosition.y = 0.5;
                break;
        }
    });

    const hasSubscribed = () => {
        if (window.location.href.match('digital.fashion')) {
            var dc = document.cookie;
            var prefix = 'subscribed=';
            var begin = dc.indexOf('; ' + prefix);
            if (begin == -1) {
                begin = dc.indexOf(prefix);
                if (begin != 0) return false;
            }
            return true;
        }
        return false;

    }

    const getNextState = () => {
        //todo can we encapsulate this in the stores?
        if (hasSubscribed())
            return SHARE_STATE
        else {
            if ($pledgeStore < PledgeCopy.length) {
                return PLEDGE_STATE;
            } else {
                if ($questionsStore.answers.length < QuestionsCopy.length) {
                    return QUESTIONS_STATE;
                } else {
                    if (!$subscribeStore) {
                        return SUBSCRIBE_STATE;
                    } else
                        return SHARE_STATE;
                }
            }
        }
    }

    const handleNext = () => {
        if (window.location.href.match('localhost')) {

            const nextInviteState = getNextState();
            if (nextInviteState)
                setState(nextInviteState);
        } else {
            const nextInviteState = getNextState();
            if (nextInviteState)
                setState(nextInviteState);
        }

    }

    const setState = (s) => {
        const startTime = $stateStore.state === LANDING_STATE ? lastUpdate : $stateStore.start;
        stateStore.set({state: s, start: startTime});
    };

    const updateWebGLContext = ({x, y, scale, imageElements}) => {

        if (webglCanvas) {
            webglCanvas.update({x, y, scale, imageElements});
            webglCanvas.render();
        }
    }

    /**
     *
     * @param time : Number
     * @param deltaTime : Number
     */
    const handleDraw = ({time, deltaTime}) => {

        lastUpdate = time;

        updateMapTransform();

        if (map)
            map.handleDraw({time, deltaTime});

        if ($stateStore.state === LANDING_STATE) {
            updateWebGLContext({x: MAP_TRANSFORM.x, y: MAP_TRANSFORM.y, scale: MAP_TRANSFORM.scale, imageElements});
        }

    };

    async function handleResize() {

        isResized = false;

        await tick();

        isResized = true;

        if (window.getComputedStyle) {
            GLOBALS.MOBILE = getComputedStyle(container).getPropertyValue('--mobile') === '1';
        }

        GLOBALS.dpr = window.devicePixelRatio;

        MAP_TRANSFORM.windowSize.x = window.innerWidth;
        MAP_TRANSFORM.windowSize.y = window.innerHeight;

        MAP_TRANSFORM.viewportCenter.x = MAP_TRANSFORM.windowSize.x * 0.5;
        MAP_TRANSFORM.viewportCenter.y = MAP_TRANSFORM.windowSize.y * 0.5;

        updateMapTransform();

        if (webglCanvas) {
            webglCanvas.handleResize();
        }
    }

    const updateMapTransform = () => {

        var scale = MAP_TRANSFORM.getScale();

        var mW = MAP_TRANSFORM.mapWidth * scale;
        var mH = MAP_TRANSFORM.mapHeight * scale;

        const dampening = GLOBALS.MOBILE ? 0.1 : 0.05;
        let x = position.x += (destPosition.x - position.x) * dampening;
        //todo replace with canvasWidth...
        x = (mW - GLOBALS.CanvasWidth) * -x;

        let y = position.y += (destPosition.y - position.y) * dampening;
        y = (mH - GLOBALS.CanvasHeight) * -y;

        MAP_TRANSFORM.x = x;
        MAP_TRANSFORM.y = y;
        MAP_TRANSFORM.width = mW;
        MAP_TRANSFORM.height = mH;
        MAP_TRANSFORM.scale = scale;

    }
    const handleMouseDown = (e) => {

        if ($stateStore.state === LANDING_STATE) {
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;

            downPosition = {
                x: clientX,
                y: clientY
            };
            startPosition = Object.assign({}, position);
        }
    };

    const handleMouseLeave = () => {
        downPosition = null;
    }

    const handleWheel = (e) => {

        e.preventDefault();

        if ($stateStore.state === LANDING_STATE) {
            const clientX = e.deltaX * 0.001 / GLOBALS.dpr;
            const clientY = e.deltaY * 0.001 / GLOBALS.dpr;
            destPosition.x = Math.min(1, Math.max(0, destPosition.x + clientX));
            destPosition.y = Math.min(1, Math.max(0, destPosition.y + clientY));
        }
    };

    const handleMouseMove = (e) => {
        if ($stateStore.state === LANDING_STATE) {
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;

            if (downPosition) {
                let x = (downPosition.x - clientX) / (GLOBALS.CanvasWidth * window.devicePixelRatio);
                let y = (downPosition.y - clientY) / (GLOBALS.CanvasWidth * window.devicePixelRatio);
                destPosition.x = Math.max(0, Math.min(1, startPosition.x + x));//0.5 - x;
                destPosition.y = Math.max(0, Math.min(1, startPosition.y + y));//0.5 - y;
            }
        }
    }

    const handleMapNavigate = (evt) => {
        const index = evt.detail.index;
        const textElement = textElements[index];
        if (textElement) {
            let x = textElement.circle.x;
            x = (x - GLOBALS.CanvasWidth / 2) / (MAP_TRANSFORM.mapWidth - GLOBALS.CanvasWidth);

            let y = textElement.circle.y;
            y = (y - GLOBALS.CanvasHeight / 2) / (MAP_TRANSFORM.mapHeight - GLOBALS.CanvasHeight);
            destPosition = {x, y};
        }
    }

    /**
     * Load shapes and positions from elements from svg/json
     */
    const loadShapes = () => {

        const {shapes} = MapUtils.seeJSON(mapJson);

        const rootElement = shapes.find(element => element.type === 'svg');
        MAP_TRANSFORM.mapWidth = rootElement.width;
        MAP_TRANSFORM.mapHeight = rootElement.height;

        shapes.filter(element => element.type === 'circle').forEach(element => {
            if (sectionCircleReference) {
                if (sectionCircleReference.radius <= element.radius)
                    sectionCircleReference = element;
            } else
                sectionCircleReference = element;
        });
        MAP_TRANSFORM.sectionCircleReference = sectionCircleReference;

        imageElements = shapes.filter(element => element.type === 'image');

        svgElements = imageElements.map(element => {
            return {
                ...SVG_ELEMENTS[element.id],
                ...element
            }
        }).filter(element => !!element.svg);

        imageElements = imageElements.filter(element => !SVG_ELEMENTS[element.id]);

        handles = shapes.filter(element => element.type === 'text');

        //add property that will contain the transformed position
        imageElements.forEach((imageElement, i) => {
            imageElement.currentPos = {x: imageElement.x, y: imageElement.y}
            imageElement.socialHandle = null;
        });

        //set anchor positions for the text containers...
        textElements.forEach(entry => {
            //landing/center section doesn't have a circle..
            const anchor = shapes.find(shape => shape.id === entry.id);
            entry.circle = anchor || {x: MAP_TRANSFORM.mapWidth / 2, y: MAP_TRANSFORM.mapHeight / 2};
        });

        shapesStore.set({shapes});

    };

</script>

<svelte:window on:resize={handleResize}></svelte:window>

<svelte:head>
    <title>{content.meta_title}</title>
    <meta property="description" content="{content.meta_description}">
    <meta property="og:title" content="{content.meta_title}">
    <meta property="og:description" content="{content.meta_description}">
    <meta property="og:image"
          content='{shareImage}'>
    <meta property="og:type" content='website'>
    <meta property="twitter:title" content="{content.meta_title}">
    <meta property="twitter:description" content="{content.meta_description}">
    <meta property="twitter:image"
          content='{shareImage}'>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">

    <link rel="icon" type="image/x-icon"
          href="https://images.squarespace-cdn.com/content/v1/5a6ba105f14aa1d81bd5b971/1517312223251-M60LV0B0DRBF6VG7M87L/ke17ZwdGBToddI8pDm48kFGbdAAi3Th4NssaNgenDvSoCXeSvxnTEQmG4uwOsdIceAoHiyRoc52GMN5_2H8Wp2Ly4DdxYU4Gfwh-cx98r6h8mOR3UyhLgZsvKIj4m3FS4P5ZyBMx3dwz08ADYBaY1Q/favicon.ico">
    <link rel="shortcut icon" type="image/x-icon"
          href="https://images.squarespace-cdn.com/content/v1/5a6ba105f14aa1d81bd5b971/1517312223251-M60LV0B0DRBF6VG7M87L/ke17ZwdGBToddI8pDm48kFGbdAAi3Th4NssaNgenDvSoCXeSvxnTEQmG4uwOsdIceAoHiyRoc52GMN5_2H8Wp2Ly4DdxYU4Gfwh-cx98r6h8mOR3UyhLgZsvKIj4m3FS4P5ZyBMx3dwz08ADYBaY1Q/favicon.ico">

</svelte:head>

<main class:isLoaded class="{$stateStore.state} {device}"
      bind:clientWidth={GLOBALS.CanvasWidth} bind:clientHeight={GLOBALS.CanvasHeight} bind:this={container}
      on:touchstart={handleMouseDown} on:touchend={handleMouseLeave}
      on:wheel={handleWheel}
      on:touchmove={handleMouseMove}
      on:mousedown={handleMouseDown} on:mouseleave={handleMouseLeave}
      on:mouseup={handleMouseLeave} on:mousemove={handleMouseMove}>

    <Loader isLoaded="{isReady}">
        {@html SVG_ELEMENTS['image23'].svg}
    </Loader>

    {#if isReady}
        <FabLogo on:clicked={()=> setState(LANDING_STATE)}/>
    {/if}

    <div class="clip-container">
        <!--    <MapCanvas/>-->
        <WebGLCanvas className={"webgl-canvas"} bind:this={webglCanvas} container={container}
                     imageElements={imageElements}
                     textElements={textElements}></WebGLCanvas>

        <Map bind:this={map} {isLoaded} {device} {sectionCircleReference} {handles}
             {textElements} {imageElements} {svgElements}
             on:navigate={handleMapNavigate}>

            <div class="overlay">
                <div class="dark"></div>
                <div class="light"></div>
            </div>
        </Map>

    </div>

    {#if $stateStore.state === LANDING_STATE}
        <div class="invite" transition:fade={{delay:2000}}>
            <ButtonBorder on:clicked={handleNext}>
                <span class="button-text">Request an Invite</span>
            </ButtonBorder>
        </div>
    {/if}

    {#if $stateStore.state === PLEDGE_STATE}
        <Pledge/>
    {/if}

    {#if $stateStore.state === QUESTIONS_STATE}
        <Questions/>
    {/if}

    {#if $stateStore.state === SUBSCRIBE_STATE}
        <Subscribe/>
    {/if}

    {#if $stateStore.state === SHARE_STATE}
        <Share/>
    {/if}

    {#if $stateStore.state && $stateStore.state !== LANDING_STATE}
        <CloseButton on:close={()=> setState(LANDING_STATE)}/>
    {/if}

</main>

<style lang="scss">

  @import "../scss/theme";

  main {

    --s1_color: #3BFB42;
    --s2_color: #C4E577;
    --s3_color: #FF3385;
    --s4_color: #3E8AFF;
    --mobile: 1;

    position: fixed;
    width: 100%;
    height: 100%;
    background-color: black;

    @include for-tablet-landscape-up {
      --mobile: 0;
      overflow-x: visible;
    }

    &.isLoaded {
      background: conic-gradient(from 179.5deg at 50% 50%, #030303 0deg, #183547 93.75deg, #422E2E 221.25deg, #030303 360deg);
    }

    .clip-container {
      width: 100%;
      height: 100%;
      clip-path: inset(0% 0% 0% 0% round 0%);
      transition: clip-path 1000ms $expo-out;
    }

    .overlay {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      > div {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      .light {
        background-color: rgba(255, 255, 255);
        opacity: 0;
        transition: opacity 1000ms;
      }

      .dark {
        background-color: rgba(0, 0, 0);
        opacity: 0;
        transition: opacity 1000ms;
      }
    }


    &.pledge {
      .overlay {

        .dark {
          transition: opacity 1000ms 1500ms;
          opacity: 0.7;
        }

        .light {
          opacity: 0;
        }
      }
    }

    &.landing {
      .overlay {
        opacity: 0;

        .dark {
          opacity: 0
        }

        .light {
          opacity: 0;
        }
      }
    }

    &.questions, &.subscribe, &.share {
      .overlay {

        .dark {
          opacity: 0;
        }

        .light {
          opacity: 0.3;
        }
      }
    }


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

  :global(.img_1) {
    position: absolute;
    left: -400px;
    top: 100px;
  }

  .invite {
    height: 80px;
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    pointer-events: none;
    @include for-tablet-landscape-up {
      bottom: 2vmax;
    }
  }


</style>
