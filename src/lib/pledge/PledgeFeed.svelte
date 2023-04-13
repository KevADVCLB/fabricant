<script>
    import {onMount} from 'svelte';
    import {cubicInOut} from 'svelte/easing';
    import {gsap} from '$lib/gsap.js'
    import {SplitText} from '$lib/gsap.js'

    export const setRatio = (ratio) => {
        if (feed) {
           // ratio = 0.5;
            //feed.style.opacity = 1 - obj.detail.ratio;
            tl.progress(1 - ratio);
            feed.style.transform = 'translate(0,' + (cubicInOut(ratio) * (feedHeight) - feedHeight + windowHeight * 0.5) + 'px)';
        }
    }

    export let text;

    let windowHeight;
    let feed;
    let feedHeight;
    let tl;

    //--------------------------------


    onMount(() => {

        windowHeight = window.innerHeight;

        tl = gsap.timeline({paused: true});
        const splitText = new SplitText(feed, {type: 'lines'});
        const lines = splitText.lines;
        tl.set(feed, {opacity: 1});
        tl.set(lines, {opacity: 0, y: 100, ease: Expo.easeIn});
        tl.to(lines, {opacity: 0.1, y: 0, duration: 1, stagger: 1 / lines.length});
        tl.to(lines, {opacity: 0, y: -10, duration: 1, stagger: 1 / lines.length, ease: Expo.easeOut});

    });

    const handleResize = () => {
        windowHeight = window.innerHeight;
    }

</script>
<svelte:window on:resize={handleResize}/>
<div class="pledge-feed" bind:this={feed} bind:clientHeight={feedHeight}>
    {text}
</div>
<style lang="scss">

  @import "../../scss/theme";

  .pledge-feed {
    opacity: 0;
    position: absolute;
    widtH: auto;

    @include font-title;
    padding: 50px;
    text-align: center;

    @include for-tablet-landscape-up {
      padding: 100px;
    }
    text-transform: uppercase;
    font-size: 20vw;
  }
</style>
