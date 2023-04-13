<script>

    import {createEventDispatcher} from 'svelte';
    import {expoOut} from 'svelte/easing';

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
        dispatch('open')
    };

</script>
<button in:fade={{duration : 500, delay:500}} out:fade={{duration: 300, delay: 0}} on:click={handleClick}>
    <div>
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.0234 13.0233H22.4209V22.0121" stroke="white" stroke-width="1"/>
            <line x1="22.2723" y1="13.3359" x2="13.2834" y2="20.8266" stroke="white" stroke-width="1"/>
            <rect x="0.406977" y="0.406977" width="34.186" height="34.186" rx="17.093" stroke="white" stroke-width="1"/>
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
    position: absolute;
    right: 15px;
    top: 15px;
    width: 40px;
    height: 40px;
    outline: none;
    border:none;
    background:none;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      width: 35px;
      height: 35px;
      pointer-events: none;
    }

    z-index: $logo-index + 1;
    cursor: pointer;

    svg {
      pointer-events: none;
      width:100%;
      height:100%;

      rect{
        transform-origin: center;
      }
    }

    &:hover {
      svg{
        line, path{
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: dash 500ms 0s infinite alternate;
        }

        rect {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: dash 2000ms 0s infinite alternate-reverse, rotate 1500ms 0s infinite;
        }
      }
    }
  }

</style>
