<script>
    import {createEventDispatcher} from 'svelte';
    import {stateStore} from '$lib/store/stores.js';
    import {GLOBALS, LANDING_STATE} from '$lib/_globals.js';
    import {MathUtils} from '$lib/utils/MathUtils.js';
    import {gsap} from '$lib/gsap.js'
    import {SplitText} from '$lib/gsap.js'
    //------------------------------
    export let entry;
    export let isLoaded;

    //------------------------------------

    const dispatch = createEventDispatcher();
    let element;
    let scale = 1;
    let position = {x: 0, y: 0};
    let title;
    let paragraph;
    let tl;
    let chars;
    let splitPara;
    let isVisible = false;

    //------------------------------------

    const tween = () => {
        tl = gsap.timeline();

        if (GLOBALS.device === 'mobile' || GLOBALS.device === 'tablet') {
            tl.to(element, {opacity: 1, duration: 2});
        } else {

            const splitText = new SplitText(title, {type: 'words, chars'});
            chars = MathUtils.shuffleArray(splitText.chars);
            tl.set(chars, {opacity: 0});
            tl.set(element, {opacity: 1});

            splitPara = new SplitText(paragraph, {type: 'words'});
            tl.set(splitPara.words, {opacity: 0});
            chars.forEach((char, i) => {
                tl.to(char, {opacity: 1, duration: 0.7}, i * 0.01)
            });
            tl.to(splitPara.words, {opacity: 1, stagger: 0.05, duration: 1}, '>-1');

        }

        return {
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            duration: tl.totalDuration() * 1000,
            tick: t => {
                tl.progress(t);
            }
        }
    }

    //------------------------------------

    export const setPosition = (x, y, scale) => {
        position.x = x;
        position.y = y;
        scale = scale;
        if (element)
            element.style.transform = 'translate3d(' + (x + entry.circle.x * scale) + 'px, ' + (y + entry.circle.y * scale) + 'px, 0)';
    }

    export const start = () => {
        isVisible = true;
    }

    export const stop = () => {
        //  collectionEntry.stop();
    }


</script>
{#if $stateStore.state === LANDING_STATE && isVisible}
    <div id={entry.id} class="page" transition:tween bind:this={element} class:isLoaded>
        <div class="page-content">
            <!--        <CollectItem bind:this={collectionEntry} on:complete={handleCollection}/>-->
            <h2 bind:this={title}><span><div class="bullet">{entry.chapter}</div></span>{@html entry.title}</h2>
            <p bind:this={paragraph}>{entry.paragraph}</p>
        </div>
    </div>
{/if}
<style lang="scss">
  @import "../../scss/theme";

  .page {
    position: absolute;
    transform-origin: center;
    opacity: 0;


    .page-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      padding: 10px;
      overflow: hidden;

      @include for-tablet-landscape-down {
        max-width: 600px;
        width: 80vmin;
      }

      transform: translate(-50%, -30%);

      h2 {
        @include font-title;


        width: 80vw;
        font-size: 3.5vmax;
        @include for-tablet-landscape-up {
          //width: 56vmax;
          font-size: 2.8vmax;
          width: 17em;
        }

        span {
          display: inline-block;
          width: 4em;
          position: relative;
          height: 0.85em;
          margin-right: 0.2em;

          div {
            opacity: 50%;
            font-family: Cako;
            font-style: italic;
            font-weight: normal;
            font-size: 1.3vmax;
            line-height: 125%;
            /* or 30px */
            position: absolute;
            right: 0;
            text-transform: uppercase;
            text-align: right;
          }
        }
      }

      p {
        margin-top: 3em;
        @include font-paragraph;

        width: 70vw;

        @include for-tablet-landscape-up {
          font-size: 0.8vmax;
          width: 40em;
          margin-left: 15em;
          //margin-right: 8em;
        }
      }
    }

    &.isLoaded {
      //  opacity: 1;

      > div {
        p {
          //  opacity: 1;
        }
      }
    }

    &#SECTION-01 {

      @include for-tablet-landscape-down {
        margin-top: 6vh;
      }

      .bullet:before {
        background: radial-gradient(circle, var(--s1_color) 0%, rgba(255, 255, 255, 0) 25%);
      }
    }

    &#SECTION-02 {
      > div {
        padding-bottom: 30%;
      }

      .bullet:before {
        background: radial-gradient(circle, var(--s2_color) 0%, rgba(255, 255, 255, 0) 25%);
      }
    }

    &#SECTION-03 {
      > div {
      }

      .bullet:before {
        background: radial-gradient(circle, var(--s3_color) 0%, rgba(255, 255, 255, 0) 25%);
      }
    }

    &#SECTION-04 {
      > div {
      }

      .bullet:before {
        background: radial-gradient(circle, var(--s4_color) 0%, rgba(255, 255, 255, 0) 25%);
      }
    }
  }


</style>
