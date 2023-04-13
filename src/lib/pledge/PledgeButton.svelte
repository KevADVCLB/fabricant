<script>
    import {content} from '$lib/_copy.js';
    import RenderUtils from '$lib/utils/RenderUtils.js';
    import {createEventDispatcher, onMount} from 'svelte';
    import {gsap} from '$lib/gsap.js'
    import {fade} from 'svelte/transition';
    import {Sine, Expo} from 'gsap'
    //---------------------------------------

    let dispatcher = createEventDispatcher();

    let isDown = null;
    let lastTime = -1;
    let cta;
    let buttonBackground;
    let buttonHeight;
    let gradient;
    let button;

    let isComplete;

    let ratio = 1;
    const duration = 2000;

    const pressTL = gsap.timeline({
        paused: true
    });

    //---------------------------------------

    onMount(() => {

        reset();

        pressTL.fromTo(buttonBackground, {y: buttonHeight + 10}, {y: 0, duration: 1, ease: Sine.easeOut}, 0);
        pressTL.fromTo(gradient, {scale: 1.5, opacity: 1}, {scale: 0, opacity: 0, duration: 1, ease: Expo.easeIn}, 0);
        pressTL.fromTo(button, {scale: 1}, {scale: 0.8, duration: 1, ease: Sine.easeOut}, 0);

        const frame = RenderUtils.CreateLoop(handleDraw);
        return () => {
            cancelAnimationFrame(frame);
        }
    });

    export const reset = () => {
        isDown = null;

        let tl = gsap.timeline({
            onComplete: () => {
                ratio = 1;
                isComplete = false;
            }
        });
        tl.set(cta, {opacity: 0});

        const delay = 1;
        // tl.set(buttonBackground, {y : buttonHeight + 10});

        tl.to(gradient, {scale: 1.5, opacity: 1, duration: 0.5, ease: Sine.easeOut},delay);
        tl.to(button, {scale: 1, opacity: 1, duration: 0.5, ease: Sine.easeOut},delay);
        tl.fromTo(buttonBackground, {y: (ratio * buttonHeight)}, {
            y: buttonHeight + 10,
            duration: 0.4,
            ease: Expo.easeIn
        }, delay);
        tl.to(cta, {opacity: 1, duration: 0.7, ease: Sine.easeOut},delay + 0.4);
        tl.play()

        //  buttonBackground.style.setProperty('transform', 'translate(0px,' + (ratio * buttonHeight) + 'px)');////style.transform = "translate(0px,100px);";
    }

    const handleMouseDown = () => {

        if (!isComplete) {
            const elapsed = duration * (1 - ratio);
            isDown = lastTime - elapsed;
        }
    };

    const handleMouseOut = () => {
        isDown = null;
    };

    const setRatio = (r) => {
        if (ratio !== r) {

            ratio = r;

            dispatcher('update', {
                ratio
            });

            if (ratio === 0) {
                isComplete = true;

                let tl = gsap.timeline({});
                tl.to(button, {opacity: 0.3, duration: 1.5, ease: Quint.easeOut}, 0);
                tl.play();

                dispatcher('complete');
            }

            if (!isComplete) {
                pressTL.progress(1 - ratio);
            }
        }
    }

    const handleDraw = ({time, deltaTime}) => {

        lastTime = time;

        let r;

        if (isDown) {
            const elapsed = (time - isDown);
            r = 1 - Math.min(1, (time - isDown) / duration);
        } else if (!isComplete) {
            r = ratio + (1 - ratio) * 0.05;
        } else {
            r = 0;
        }

        setRatio(r);
    };

</script>
<div class="pledge-button" class:inactive={isComplete} transition:fade>
    <div class="button-gradient" bind:this={gradient}></div>
    <button on:mousedown={handleMouseDown} on:mouseup={handleMouseOut} on:touchstart={handleMouseDown}
            on:touchend={handleMouseOut} bind:this={button}>
        <div bind:this={buttonBackground} bind:clientHeight={buttonHeight}></div>
        <div class="button-cta" bind:this={cta}>
            {content.interaction_description}
        </div>
    </button>

</div>
<style lang="scss">

  @import "../../scss/theme";

  .pledge-button {

    position: absolute;
    width: 100%;
    height: 40%;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .button-gradient {
      position: absolute;
      pointer-events: none;
      width: 500px;
      height: 367px;

      transform: scale(0, 0);
      background: url('/images/pledge/gradient-CTA.png') no-repeat;
      background-size: contain;
    }

    button {

      cursor: pointer;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;

      width: 167px;
      height: 215px;
      background-color: #000;
      border: 0.5px solid #BEF25F;
      border-radius: 83px;
      position: relative;
      overflow: hidden;

      > div {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }

      > div:first-of-type {
        position: absolute;
        background-color: white;
        transform: translate(0, calc(100% + 20px));
        z-index: 1;
      }

      .button-cta {
        font-family: Neue Montreal;
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 148.44%;
        text-transform: uppercase;
        padding: 3em;
        /* or 16px */

        text-align: center;
        letter-spacing: 0.06em;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        height: auto;
        position: relative;

        &:before {
          position: absolute;
          left: 50%;
          top: 0.5em;
          background: radial-gradient(circle, #3BFB42 0%, rgba(255, 255, 255, 0) 100%);
          content: "";
          width: 6px;
          height: 6px;
        }

      }
    }

    &.inactive {
      button {
        cursor: unset;
      }
    }
  }
</style>
