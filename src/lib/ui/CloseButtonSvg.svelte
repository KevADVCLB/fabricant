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

    const handleClick = () => {
        dispatch('close')
    };

</script>
<div in:fade={{duration : 500, delay:2000}} out:fade={{duration: 300, delay: 0}} on:click={handleClick}>
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1.35355" y1="0.646447" x2="13.3536" y2="12.6464" stroke="white"/>
        <line x1="0.646447" y1="12.6464" x2="12.6464" y2="0.646447" stroke="white"/>
    </svg>
</div>

<style lang="scss">

  @import "../../scss/theme";

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  div {
    position: absolute;
    right: 60px;
    width: 12px;
    height: 12px;
    top: 60px;
    z-index: $logo-index + 1;
    cursor: pointer;

    &:hover{
      svg{
        line{
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 1s ease-in infinite;
        }

        line:last-of-type{
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 1s 0.2s ease-in infinite;
        }
      }
    }
  }

</style>
