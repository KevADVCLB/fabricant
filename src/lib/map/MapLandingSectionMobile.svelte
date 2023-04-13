<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {stateStore} from '$lib/store/stores.js';
    import {content} from '$lib/_copy.js';
    import {LANDING_STATE} from '$lib/_globals.js';
    import {MathUtils} from '$lib/utils/MathUtils.js';
    import {gsap} from '$lib/gsap.js'
    import {SplitText} from '$lib/gsap.js'
    //-------------------------------------

    export let entry;
    export let element;
    export let isLoaded;

    //--------------------------------------

    let title1;
    let title2;
    let title3;
    let title4;
    let title5;

    let image1;
    let image2;

    let scale = 1;
    let position = {x: 0, y: 0};
    let splitText;
    let tl;
    let container;
    const dispatch = createEventDispatcher();


    //----------------------------------------

    const tween = () => {

        const splitText1 = new SplitText(title1, {type: 'words, lines, chars'});
        const splitText2 = new SplitText(title2, {type: 'words, lines, chars'});
        const splitText3 = new SplitText(title3, {type: 'words, lines, chars'});
        const splitText4 = new SplitText(title4, {type: 'words, lines, chars'});
        const splitText5 = new SplitText(title5, {type: 'words, lines, chars'});

        tl = gsap.timeline();

        const chars = MathUtils.shuffleArray([...splitText1.chars, ...splitText2.chars, ...splitText3.chars, ...splitText4.chars, ...splitText5.chars]);
        tl.set(chars, {opacity : 0});
        tl.set([image1, image2], {opacity : 0,scale :0});
        tl.set(container, {scale: 3});

        tl.to(container, {scale: 1, ease: Expo.easeOut, duration: 1.5});
        chars.forEach((char, i) => {
            tl.to(char, {opacity: 1, duration: 0.7}, i * 0.01)
        })
        tl.to([image1, image2], {opacity : 1, scale : 1, duration: 1, ease:Quint.easeOut}, 0.5);

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
            element.style.transform = 'translate(' + (x + entry.circle.x * scale) + 'px, ' + (y + entry.circle.y * scale) + 'px)';
        }
    }

    export const start = () => {
    }

    export const stop = () => {
    }

    export const show = () => {
    };

    const handleState = (state)=>{
        console.log("on:" + state);
    }
    //----------------------------------------

</script>

{#if $stateStore.state === LANDING_STATE}
    <div id={entry.id} bind:this={element} transition:tween class="page page__mobile" class:isLoaded
         on:introstart="{() => handleState('started')}"
         on:outrostart="{() => handleState('started')}"
         on:introend="{() => handleState('ended')}"
         on:outroend="{() =>  handleState('ended')}">

        <div class="page-content" bind:this={container}>
            <div class="landing-image landing-image_1" bind:this={image1}></div>
            <h1 bind:this={title1}>{@html content.landing_title_mobile_1}</h1>
            <h1 bind:this={title2}>{@html content.landing_title_mobile_2}</h1>
            <h1 bind:this={title3}>{@html content.landing_title_mobile_3}</h1>
            <h1 bind:this={title4}>{@html content.landing_title_mobile_4}</h1>
            <h1 bind:this={title5}>{@html content.landing_title_mobile_5}</h1>
            <div class="landing-image landing-image_2" bind:this={image2}></div>
        </div>
    </div>
{/if}
<style lang="scss">
  @import "../../scss/theme";

  .page {
    position: absolute;
    transform-origin: center;
    margin-top:-2vh;

    > div {
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      @include for-tablet-landscape-up {
        width: 80vmin;
      }
      transform: translate(-50%, -50%);

      h1 {

        &.hidden {
          opacity: 0;
        }

        @include font-title;
        white-space: nowrap;

        font-size: 9vw;
        @include for-tablet-landscape-up {
          font-size: 3vw;
        }

        text-transform: uppercase;
        text-align: center;
        opacity: 0.8;

        &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(5) {
          opacity: 1;
        }

        :global(em) {
          font-style: italic;
        }

        :global(span) {
          position: relative;
        }
      }

      .landing-image{
        opacity : 0;
        background-size: contain;
        width: 25vw;
        height: 25vw;
        border-radius: 50%;
        border: 0.5px white solid;
        margin:10vw 0;
      }

      .landing-image_1 {
        background-image: url(/images/landing/renaissance2.png);
      }

      .landing-image_2 {
        background-image: url('/images/landing/Fullteaser-3 1.png');
      }

      div {
        @include font-title;
      }

    }

    &.isLoaded {
      opacity: 1;

      > div {
        p {
          opacity: 1;
        }
      }
    }

  }

</style>
