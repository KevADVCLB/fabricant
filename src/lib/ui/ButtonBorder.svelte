<script>

    import {createEventDispatcher} from 'svelte';
    import {fly} from 'svelte/transition';
    import {expoOut} from 'svelte/easing';

    //------------------------------

    export let className = '';

    let clientHeight;
    let clientWidth;
    let isOver = false;

    const dispatcher = createEventDispatcher();

    const handleClick = () => {
        dispatcher('clicked');
    }

    const fade = (node, {duration}) => {
        return {
            duration,
            css: t => {
                const eased = expoOut(t);

                return `
					transform: scale(${eased * 0.1 + 0.9});
                    opacity : ${eased}
                    `
            }
        };
    }
</script>

<button class="{className}" on:click={handleClick} transition:fade="{{ duration: 500 }}"
        bind:clientHeight={clientHeight} bind:clientWidth={clientWidth}
        class:pressed={isOver}
        on:mousedown={()=>isOver = true}
        on:mouseup={()=>isOver= false}
        on:mouseout={()=>isOver=false}
        on:tap={()=>isOver=false}>
    <slot/>
</button>

<style lang="scss">

  @import "../../scss/theme";

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes dash-array {
    to {
      stroke-dasharray: 96;
    }
  }

  button {
    position: relative;
    appearance: none;
    outline: none;
    border: 0.5px solid white;
    cursor: pointer;
    transform-origin: center;
    height: 50px;
    padding: 1em 2em;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 999px;
    pointer-events: all;

    @include for-tablet-landscape-up {
      min-width: 213px;
      height: 80px;
      padding: 0;
    }

    display: flex;;
    justify-content: center;
    align-items: center;


    &.pressed {
      //.answer-background {
        transition: transform 200ms;
        transform: scale(0.95, 0.95);
    //  }
    }


    &:hover {
      /*svg {
        rect {
          fill-opacity: 0.4;
          !* stroke-dashoffset: 473;
           stroke-dasharray: 206;
           //stroke-dasharray: 300;
           animation: dash 2000ms 0s infinite alternate-reverse*!
        }

      }*/
      background-color: rgba(255, 255, 255, 0.4);
    }

    /*svg {
      overflow: visible;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;

      rect {
        fill: black;
        stroke-dasharray: 590;
        transition: fill-opacity 0.2s, stroke-dasharray 1000ms;
      }

    }*/
  }

  .share-discord__desktop {
    display: none;
    @include for-tablet-landscape-up {
      display: flex;
      :global(.button-text) {
        font-size: 12px;
      }
      svg:last-of-type {
        position: relative;
        z-index: 2;
      }
    }
  }

  :global(.landing) {
    button {
      top: unset;
      position: absolute;
      z-index: 100;
    }
  }

  :global(.share) {
    button {
      width: 74px;
      height: 43px;
      padding: 0;
      @include for-tablet-landscape-up {
        width: 246px;
        height: 82px;
      }

      svg {
        width: 100%;
      }
    }
  }

</style>