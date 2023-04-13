<script>

    export let isLoaded = false;

</script>

<div class="loader" class:isLoaded>
    <slot/>
</div>

<style lang="scss">

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }

  .loader {
    position: absolute;
    top: calc(50vh - 70px);
    left: calc(50vw - 5em);
    pointer-events: none;
    transition: opacity 200ms;
  }

  .loader {
    :global(svg) {
      width: 100%;
      height: 100%;
    }

    :global(circle) {
      stroke-dasharray: 100;
      stroke-dashoffset: 200;
      animation: dash 1500ms 0s infinite alternate;
    }

  }

  .loader.isLoaded {
    opacity : 0;
  }


</style>