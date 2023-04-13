<script context="module">
    let displayCount = 0;
</script>
<script>
    import {gsap, Expo, Quint} from '$lib/gsap.js'
    import {SplitText} from '$lib/gsap.js'

    import {createEventDispatcher, onMount, tick} from 'svelte';
    import {stateStore} from '$lib/store/stores.js';
    import {content} from '$lib/_copy.js';
    import {LANDING_STATE} from '$lib/_globals.js';
    import {MathUtils} from '$lib/utils/MathUtils.js';


    //-------------------------------------

    export let entry;
    export let isLoaded;

    let title1;
    let title2;
    let title3;
    let title4;
    let scale = 1;
    let position = {x: 0, y: 0};
    let tl;
    let container;
    let element;
    let isResized = true;
    let directionTween;
    const dispatch = createEventDispatcher();

    //----------------------------------------

    const tween = (node, {direction}) => {

        const splitText1 = new SplitText(title1, {type: 'words, lines, chars'});
        const splitText2 = new SplitText(title2, {type: 'words, lines, chars'});
        const splitText3 = new SplitText(title3, {type: 'words, lines, chars'});
        const splitText4 = new SplitText(title4, {type: 'words, lines, chars'});

        tl = gsap.timeline();

        const chars = MathUtils.shuffleArray([...splitText1.chars, ...splitText2.chars, ...splitText3.chars, ...splitText4.chars]);
        tl.set(chars, {opacity: 0});
        tl.set(element, {opacity: 1});

        tl.set(container, {scale: direction > 0 ? 3 : 0});

        const image1 = title1.querySelector('span');
        const image2 = title3.querySelector('span');
        const image3 = title4.querySelector('span');

        tl.set([image1, image2, image3], {scale: 0});

        tl.to(container, {scale: 1, ease: Expo.easeOut, duration: 1.5});
        chars.forEach((char, i) => {
            tl.to(char, {opacity: 1, duration: 0.7}, i * 0.01)
        })

        //match units to view port / font sizes
        const unit = window.innerWidth * 0.03;
        const delay = 0.9;
        const duration = 1;
        tl.to(splitText1.words.slice(0, 2), {x: -1.5 * unit, ease: Quint.easeOut, duration}, delay);
        tl.to(splitText1.words.slice(2), {x: 1.5 * unit, ease: Quint.easeOut, duration}, delay);
        //  tl.to(splitText2.words, {x: 1 * unit, ease: Quint.easeOut, duration}, delay);
        tl.to(splitText3.words, {x: -1 * unit, ease: Quint.easeOut, duration}, delay);
        tl.to(splitText4.words, {x: 1.5 * unit, ease: Quint.easeOut, duration}, delay);
        tl.to([image1, image2, image3], {scale: 1, ease: Expo.easeOut, duration: 0.7}, delay);

        return {
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            duration: tl.totalDuration() * 1000,
            tick: t => {
                tl.progress(t);
            }
        }
    }

    export const setPosition = (x, y, scale) => {
        position.x = x;
        position.y = y;
        scale = scale;
        if (element) {
            element.style.transform = 'translate3d(' + (x + entry.circle.x * scale) + 'px, ' + (y + entry.circle.y * scale) + 'px, 0px)';
        }
    }

    export const start = () => {
    }

    export const stop = () => {
    }

    export const show = () => {
    };

    const handleResize = async () => {

        tl.restart();
    }

    //----------------------------------------

</script>

<svelte:window on:resize={handleResize}/>

{#if $stateStore.state === LANDING_STATE}
    <div id={entry.id} bind:this={element} transition:tween="{{direction : displayCount > 0 ? -1 : 1}}" class="page"
         class:isLoaded
         on:introend="{() => {
         displayCount ++;
         }
         }">

        <div class="page-content" bind:this={container}>
            <h1 bind:this={title1}>{@html content.landing_title_1}</h1>
            <h1 bind:this={title2}>{@html content.landing_title_2}</h1>
            <h1 bind:this={title3}>{@html content.landing_title_3}</h1>
            <h1 bind:this={title4}>{@html content.landing_title_4}</h1>
        </div>
    </div>
{/if}

<style lang="scss">
  @import "../../scss/theme";

  .page {
    position: absolute;
    transform-origin: center;

    > div {
      text-align: center;
      width: 100%;
      transform: translate(-50%, -50%);

      @include for-tablet-landscape-up {
        width: 80vmin;
        margin: 0;
      }


      h1 {

        &.hidden {
          opacity: 0;
        }

        @include font-title;
        white-space: nowrap;

        font-size: 6.5vw;
        @include for-tablet-landscape-up {
          font-size: 3vw;
        }

        text-transform: uppercase;
        text-align: center;
        opacity: 0.8;

        &:nth-of-type(2) {
          font-style: italic;
          opacity: 1;
        }

        &:nth-of-type(4) {
          opacity: 1;
        }

        :global(span) {
          position: relative;
        }
      }


      h1:nth-of-type(1) {

        :global(span) {
          position: absolute;
          display: inline-block;
          background-image: url(/images/landing/renaissance2.png);
          background-size: cover;
          width: 2.5em;
          height: 2.5em;
          transform: translate(-1.25em, -1.4em);
          border-radius: 50%;
          border: 0.5px white solid;

        }

      }

      h1:nth-of-type(3) {
        :global(span) {
          display: inline-block;
          position: absolute;
          background-image: url(/images/landing/fabric.png);
          background-size: cover;
          background-repeat: no-repeat;
          width: 4em;
          height: 1em;
          top: 50%;
          transform: translate(-0.5em, -50%);
          border-radius: 999px;
          border: 0.5px white solid;
        }
      }

      h1:nth-of-type(4) {
        :global(span) {
          display: inline-block;
          position: absolute;
          background-image: url('/images/landing/Fullteaser-3 1.png');
          background-size: cover;
          background-repeat: no-repeat;
          width: 2.5em;
          height: 2.5em;
          top: 0.2em;
          transform: translate(-200%, 0);
          border-radius: 999px;
          border: 0.5px white solid;
        }
      }

      div {
        @include font-title;
      }

    }

    &.isLoaded {

      > div {
        p {
          opacity: 1;
        }
      }
    }

  }

</style>
