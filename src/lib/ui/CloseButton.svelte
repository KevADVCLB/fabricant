<script>

    import {createEventDispatcher} from 'svelte';
    import {expoOut} from 'svelte/easing';
    import {GLOBALS} from '$lib/_globals.js';

    const fade = (node, {delay, duration}) => {
        return {
            delay,
            duration,
            css: t => {
                const eased = expoOut(t);

                return `
                    transform: scale(${eased});
                    opacity : ${eased}
				`
            }
        };
    }
    const dispatch = createEventDispatcher();

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch('close')
    };

</script>
<button in:fade={{duration : 500, delay:GLOBALS.MOBILE ? 0 : 2000}} out:fade={{duration: 300, delay: 0}} on:click={handleClick}>
    <div>
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="11.3536" y1="10.6464" x2="24.3536" y2="23.6464" stroke="white"/>
            <line x1="10.6464" y1="23.6464" x2="23.6464" y2="10.6464" stroke="white"/>
            <rect x="0.406977" y="0.406977" width="34.186" height="34.186" rx="17.093" stroke="white" stroke-width="0.813954"/>
        </svg>
    </div>
</button>

<style lang="scss">

  @import "../../scss/theme";

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes rotate {
    to{
      transform: rotate(360deg);
    }
  }

  button {

    display:none;

    @include for-tablet-landscape-up{
      display: flex;
    }
    position: absolute;
    right: 46px;
    top: 46px;
    width: 40px;
    height: 40px;
    outline: none;
    border:none;
    background:none;
    align-items: center;
    justify-content: center;

    > div {
      width: 30px;
      height: 30px;
      pointer-events: none;
    }

    z-index: $logo-index + 1;
    cursor: pointer;

    svg {
      overflow: visible;
      pointer-events: none;
      width:100%;
      height:100%;
      rect{
        display: none;
        transform-origin: center;
      }
    }

    &:hover {
      svg{
        line{
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: dash 500ms 0s infinite alternate;
        }

        line:last-of-type{
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: dash 500ms 0.1s infinite alternate;
        }

        rect {

          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: dash 2000ms 0s infinite alternate-reverse, rotate 1500ms 0s infinite;
        }
      }
    }
  }

  :global(.share-cta) {
    button {
      display:flex;
      right:23px;
      top:53px;

      @include for-tablet-landscape-up {
        right: 30px;
        top: 30px;

        > div {
          width: 35px;
          height: 35px;
        }

        rect{
          display:block;
        }
      }


    }
  }

</style>
