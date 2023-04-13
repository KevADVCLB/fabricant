<script>

    import {createEventDispatcher} from 'svelte';
    import {fade} from 'svelte/transition';

    //------------------------------------

    const dispatch = createEventDispatcher();

    const handleClick = ()=>{
        dispatch("clicked");
    };

</script>

<div on:click={handleClick} transition:fade>
    <svg width="120" height="31" viewBox="0 0 120 31" fill="none" xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect x="10" width="99" height="30.3243" fill="url(#pattern0)"/>
        <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0" transform="translate(0 -0.0483685) scale(0.00390625 0.0127528)"/>
            </pattern>
            <image id="image0" width="256" height="86"
                   xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABWCAYAAAAg0kg4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkNBNjFEM0ZBQjVEMTFFQkIyQ0NDQjgzMENCM0UxQTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkNBNjFENDBBQjVEMTFFQkIyQ0NDQjgzMENCM0UxQTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RTI5QTg2MEFBNzAxMUVCQjJDQ0NCODMwQ0IzRTFBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2Q0E2MUQzRUFCNUQxMUVCQjJDQ0NCODMwQ0IzRTFBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqYmHtEAAAsDSURBVHja7J1N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"/>
        </defs>
    </svg>
</div>
<style lang="scss">

  @import "../../scss/theme.scss";

  div {
    position:absolute;
    width:120px;
    left: calc(50% - 60px);
    top: 11px;
    @include for-tablet-landscape-up {
      top: 17px;
    }
    opacity: 1;
    cursor: pointer;
    z-index : $logo-index;
    transition: opacity 200ms;

    &:hover{
      opacity: 0.7;
    }
  }

  svg {
    width: 100%;
    height: 100%;
  }

</style>