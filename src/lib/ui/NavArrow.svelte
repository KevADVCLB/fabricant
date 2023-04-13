<script>

    import {gsap} from '$lib/gsap.js'

    export let isActive;
    export let id;
    export let showArrow = false;

    let circle;
    let _prevActive;
    $ : {
        if (_prevActive !== isActive) {
            if (!isActive && circle) {

                const tl = gsap.timeline();
                tl.to(circle, {scale: 1.5, duration: 0.4});
                tl.to(circle, {scale: 1, duration: 1.5});
                tl.play();
            }
            _prevActive = isActive;
        }
    }
    let container;
    let svg;

</script>

<div bind:this={container} class="nav-arrow {id}" class:isActive={isActive} class:showArrow={showArrow}>
    <div class="circle" bind:this={circle}></div>
    <svg bind:this={svg} width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.05889 15.3055C2.4772 13.7309 1.52047 13.1483 0.993074 13.1483L4.42114 11.8299L12.1741 7.68624L15.4596 5.35955L13.3868 9.72029L12.8594 13.412C12.9473 14.5547 14.1779 18.0004 14.1779 18.4223C14.1779 18.8442 14.9792 20.338 15.6824 21.3928L12.5957 18.9497C11.7168 18.4223 9.17284 16.6745 6.05889 15.3055Z"
              fill="white"/>
    </svg>
</div>

<style lang="scss">

  @import "../../scss/theme.scss";

  div {
    position: relative;
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%) scale(0.9, 0.9);

    @include for-tablet-landscape-up {
      transform: translate(-50%, -50%);
    }

    > div {
      transition: opacity 1000ms;
      position: absolute;
      width: 10px;
      height: 10px;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      border: 1px solid white;
      background-color: white;
    }

    &.isActive {
      > div {
        background-color: transparent;
      }
    }

    &.showArrow {

      pointer-events: all;
      cursor: pointer;

      &.SECTION-01 {
        background: radial-gradient(circle, var(--s1_color) 0%, rgba(255, 255, 255, 0) 15%);
      }

      &.SECTION-02 {
        background: radial-gradient(circle, var(--s2_color) 0%, rgba(255, 255, 255, 0) 15%);
      }

      &.SECTION-03 {
        background: radial-gradient(circle, var(--s3_color) 0%, rgba(255, 255, 255, 0) 15%);
      }

      &.SECTION-04 {
        background: radial-gradient(circle, var(--s4_color) 0%, rgba(255, 255, 255, 0) 15%);
      }

      > div {
        opacity: 0;
      }

      svg {
        opacity: 1;
      }


    }


  }

  svg {
    transition: opacity 1000ms;
    opacity: 0;
    position: absolute;
    width: 30px;
    height: 30px;
    left: calc(50% - 22px);
    top: calc(50% - 15px);
    // transform: translate(-50%, -50%);
  }

</style>
