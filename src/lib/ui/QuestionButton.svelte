<script>

    export let button;
    export let selected;
    export let key;
    export let copy;

    let isOver = false;

</script>

<button class="answser" bind:this={button}
        class:pressed={isOver}
        class:selected={selected}
        data-key="{key}"
        on:mousedown={()=>isOver = true}
        on:mouseup={()=>isOver= false}
        on:mouseout={()=>isOver=false}
        on:tap={()=>isOver=false}
        on:click>

    <div class="answer-text">
        <div class="answer-background"></div>
        <div>
            {copy}
        </div>

    </div>
</button>

<style lang="scss">

  @import "../../scss/theme";

  .answser {


    cursor: pointer;
    color: white;
    margin-bottom: 12px;
    transform: scale(0, 0);
    position: relative;

    @include for-tablet-landscape-up {
      margin-bottom: unset;
      flex-basis: 26%;
    }

    .answer-text {
      width: 100%;
      height: 53px;

      @include for-tablet-landscape-up {
        height: unset;
        padding-top: 128%;
      }

      position: relative;

      > div {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      div:last-of-type {

        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: Neue Montreal;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 128.4%;
        /* or 21px */
        text-transform: uppercase;
        text-align: center;
        letter-spacing: 0.03em;
      }

      .answer-background {
        border-radius: 99999px;
        position: absolute;
        widtH: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(255, 255, 255, 0.2);
        border: 0.5px solid rgba(255, 255, 255, 0.7);
      }
    }

    &.pressed {
      .answer-background {
        transition: transform 200ms;
        transform: scale(0.95, 0.95);
      }
    }

    &.selected {
      .answer-background {
        background: #FFFFFF;
        border: 0.5px solid rgba(255, 255, 255, 0.7);
      }

      .answer-text {
        div {
          color: black;
        }
      }
    }
  }

</style>