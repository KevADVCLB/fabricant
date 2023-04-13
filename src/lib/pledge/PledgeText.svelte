<script>

    import {createEventDispatcher, onMount} from 'svelte';
    import {MathUtils} from '$lib/utils/MathUtils.js';
    import {pledgeStore} from '$lib/store/stores.js';
    import {gsap} from '$lib/gsap.js'
    import {SplitText, Expo} from '$lib/gsap.js'
    //--------------------------------

    export let copy;
    export let index;

    export const setRatio = (ratio) => {
        if (status === 'ended')
            tl.progress(1 - ratio);
    };

    //----------------------------

    let tl;
    let title;
    let chars;
    let words;
    let status = '';
    let dispatch = createEventDispatcher();

    const handleState = (state) => {
        status = state;
        dispatch('on:' + state);
    }

    const tweenOut = () => {

        const tlOut = gsap.timeline({paused: true});
       // const splitText = new SplitText(title, {type: 'words, chars'});

        console.log(words.length)
        //chars = MathUtils.shuffleArray(splitText.chars);

        tlOut.fromTo(words, { opacity : 0.5}, {opacity : 1, stagger : 0.27, duration : 0.4});

        tlOut.fromTo(title, {scale: 1}, {scale: 0.9, opacity: 0, duration: 3, ease: Expo.easeOut});

        return {
            delay: 0,
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            duration: tlOut.totalDuration() * 1000,
            tick: t => {
                tlOut.progress(1 - t);
            }
        }
    }

    const tweenIn = () => {

        const tlIn = gsap.timeline({paused: true});
        const splitText = new SplitText(title, {type: 'words, chars'});
        words = splitText.words;
        chars = MathUtils.shuffleArray(splitText.chars);

        tlIn.set(chars, {opacity: 0});
        tlIn.set(words, {opacity: 0.5});
        tlIn.set(title, {scale: 2});
        tlIn.set(title, {opacity: 1});

        const delay = $pledgeStore === 0 ? 0 : 4;

        tlIn.to(title, {scale: 1.7}, delay);
        chars.forEach((char, i) => {
            tlIn.to(char, {opacity: 0.1, duration: 0.2}, delay + i * 0.01)
        });
        return {
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            duration: tlIn.totalDuration() * 1000,
            tick: t => {
                tlIn.progress(t);
            }
        }
    }

    onMount(() => {
        tl = gsap.timeline({paused: true});
        chars.forEach((char, i) => {
            tl.to(char, {opacity: 1, duration: 1}, i * 0.01)
        });
        tl.to(title, {scale: 1, duration: 1}, 0)
    });

</script>
<div class="pledge" data-index="{index}" in:tweenIn out:tweenOut
     on:introstart="{() => handleState('started')}"
     on:outrostart="{() => handleState('started')}"
     on:introend="{() => handleState('ended')}"
     on:outroend="{() =>  handleState('ended')}">
    <h1 bind:this={title}>
        {copy}
    </h1>
</div>

<style lang="scss">

  @import "../../scss/theme";

  .pledge {
    position: absolute;
    width: 100%;
    height: 100%;
    clip-path: inset(49px 17px 17px 17px round 17px);
    @include for-tablet-landscape-up {
      clip-path: inset(60px round 60px);
    }

    h1 {
      opacity: 0.05;
      font-family: Cako;
      font-style: normal;
      font-weight: normal;
      font-size: 32px;
      line-height: 121.4%;

      @include for-tablet-landscape-up {
        font-size: 4vmax;
      }

      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
      width: 80%;
      /* or 101px */

      text-transform: uppercase;
    }

  }
</style>
