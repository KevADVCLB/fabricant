<script>

    import {fade} from 'svelte/transition';
    import {content, PledgeCopy} from '$lib/_copy.js';
    import PledgeButton from './PledgeButton.svelte';
    import {pledgeStore} from '$lib/store/stores.js';
    import PledgeText from './PledgeText.svelte';
    import {onDestroy} from 'svelte';

    //------------------------------------

    let pledgeButton;
    // let text;
    let pledges = [];
    //  let feed;
    let windowHeight;
    let isComplete = false;
    let ratio = 0;
    let isVisible = false;


    //------------------------------------

    const handleButtonPressUpdate = (obj) => {
        if (pledges[$pledgeStore])
            pledges[$pledgeStore].setRatio(obj.detail.ratio);
    };

    const handleButtonPressComplete = (obj) => {

        isComplete = true;

        let delay = 2000;
        const delayCount = $pledgeStore === PledgeCopy.length - 1
        //    if(!delayCount){
        $pledgeStore++;
        //    }

        setTimeout(() => {
            ratio = 1;
            isComplete = false;

            if (pledgeButton && pledgeButton.reset)
                pledgeButton.reset();
        }, delay);

    };

</script>
<section in:fade="{{delay : 1400}}" out:fade="{{delay : 3000}}" class:isVisible
         on:introstart="{() => isVisible = true}"
         on:outroend="{() =>  isVisible = false}">

    <div class="container" bind:clientHeight={windowHeight}>

        <h4>{content.pledge_cta}</h4>

        {#each PledgeCopy as pledge, i}
            {#if $pledgeStore === i}
                <PledgeText bind:this={pledges[i]} index={i} copy="{pledge.pledge}"/>
            {/if}
        {/each}


        {#if $pledgeStore < PledgeCopy.length}
            <PledgeButton bind:this={pledgeButton} on:complete={handleButtonPressComplete}
                          on:update={handleButtonPressUpdate}/>
        {/if}
    </div>

</section>
<style lang="scss">

  @import "../../scss/theme";

  section {
    pointer-events: none;

    &.isVisible {
      pointer-events: all;
    }
  }

  .container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    h4 {
      position: absolute;
      left: 50%;

      top: 120px;
      @include for-tablet-landscape-up {
        top: 180px;
      }
      transform: translate(-50%, 0);
      font-family: Neue Montreal;
      font-style: normal;
      font-weight: normal;
      font-size: 11.5px;
      line-height: 125%;
      /* or 17px */

      text-align: center;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .pledge {
      position: absolute;
      width: 100%;
      height: 100%;

      h1 {
        font-family: Cako;
        font-style: normal;
        font-weight: normal;
        font-size: 46px;
        line-height: 121.4%;

        @include for-tablet-landscape-up {
          font-size: 4vmax;
        }

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        /* or 101px */

        text-transform: uppercase;
      }

      h4 {
        position: absolute;
        left: 50%;
        top: 200px;
        transform: translate(-50%, 0);
        font-family: Neue Montreal;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 125%;
        /* or 17px */

        text-align: center;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
    }

  }

</style>