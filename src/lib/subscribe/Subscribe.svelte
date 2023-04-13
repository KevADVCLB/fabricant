<script>

    import {fade} from 'svelte/transition';
    import {content} from '$lib/_copy.js';
    import {submit} from '$lib/subscribe/_submit.js';
    import {subscribeStore} from '$lib/store/stores.js';
    import {GLOBALS} from '$lib/_globals.js';
    import {MathUtils} from '$lib/utils/MathUtils.js';
    import {Expo, gsap} from '$lib/gsap.js';
    import {SplitText} from '$lib/gsap.js'
    //--------------------------

    let email;
    let title;
    let input;
    let button;
    let instructions;
    let tl;
    let privacy;
    let marketingAllowed = false;
    let isNotAllowed = false;

    const tween = () => {

        tl = gsap.timeline({paused: true});
        const splitText = new SplitText(title, {type: 'words, chars'});
        const chars = MathUtils.shuffleArray(splitText.chars);
        tl.set(chars, {opacity: 0});
        tl.set(privacy, {opacity: 0});
        tl.set(title, {opacity: 1});
        tl.set(button, {scale: 0});

        if (!GLOBALS.MOBILE)
            tl.set(input, {x: '100%', opacity: 0});
        else
            tl.set(input, {scale: 0, x: 0, opacity: 0});

        tl.set(instructions, {opacity: 0})

        chars.forEach((char, i) => {
            tl.to(char, {opacity: 1, duration: 0.7}, i * 0.01)
        });
        tl.to(instructions, {opacity: 1, duration: 0.4}, '-=0.5');

        if (GLOBALS.MOBILE) {
            tl.to(input, {scale: 1, opacity: 1, duration: 0.5, ease: Expo.easeOut}, '-=0.7');
            tl.to(button, {scale: 1, duration: 1, ease: Expo.easeOut}, '-=0.5');
        } else {
            tl.to(button, {scale: 1, duration: 1, ease: Expo.easeOut}, '-=0.5');
            tl.to(input, {x: 0, opacity: 1, duration: 0.5, ease: Expo.easeOut}, '-=0.7');
        }

        tl.to(privacy, {x: 0, opacity: 1, duration: 1, ease: Expo.easeOut});

        return {
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            delay: 1000,
            duration: tl.totalDuration() * 1000,
            tick: t => {
                tl.progress(t);
            }
        }
    }

    const handleKeyDown = (e) => {

        if (e.which === 13)
            handleSubmit();
    }

    const handleSubmit = async () => {
        if (marketingAllowed) {
            const result = await submit({
                marketingAllowed,
                email
            });

            if (result.status === 200) {
                $subscribeStore = email;
            }else{
                console.log(result);
            }
        } else {
            isNotAllowed = true;
        }
    }

    const handleMarketingAllowed = () => {
        marketingAllowed = !marketingAllowed;

        isNotAllowed = !marketingAllowed
    }
</script>
<section in:tween out:fade>

    <div class="subscribe">

        <h2 bind:this={title}>
            <span></span> {@html content.pledge_result}
        </h2>

        <div class="subscribe-form">

            <p class="bullet__form bullet" bind:this={instructions}>{content.pledge_email_title}</p>

            <div class="input">
                <input type="email" bind:this={input} bind:value={email} on:keydown={handleKeyDown}
                       placeholder="{content.pledge_email_placeholder}">

            </div>

            <button bind:this={button} on:click={handleSubmit} class:active={!!email}>

                <div>
                    {content.pledge_email_cta}
                </div>

            </button>
        </div>
        <p class="subscribe-privacy" bind:this={privacy} class:isNotAllowed class:selected={marketingAllowed}
           on:click={handleMarketingAllowed}>
            {content.pledge_privacy}
        </p>
    </div>
</section>
<style lang="scss">

  @import "../../scss/theme";

  section {
    @include pageSection;

    .subscribe {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100%;
      padding: 51px 0 0;
      justify-content: center;

      @include for-tablet-landscape-up {
        justify-content: center;
        padding: 0;
        height: unset;
        width: 60vw;
      }

      h2 {
        @include font-title-pledge;
        opacity: 0;

        span {
          display: inline-block;
          width: 2em;
          @include for-tablet-landscape-up {
            width: 3em;
          }
        }
      }

      .subscribe-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 10% 0;
        justify-content: space-between;

        @include for-tablet-landscape-up {
          height: 100%;
          flex-direction: row;
          padding: 12% 0 5%;
        }

        .bullet__form {
          opacity: 0;
          font-size: 10px;
          line-height: 150%;
          /* or 15px */
          letter-spacing: 0.06em;
          font-family: Neue Montreal;
          font-style: normal;
          font-weight: normal;
          margin: 2em 0;
          text-transform: uppercase;
          color: #FFFFFF;
          width: 100%;

          @include for-tablet-landscape-up {
            margin: 0;
            font-size: 12px;
            line-height: 150%;
            /* or 18px */
            letter-spacing: 0.06em;
            padding-right: 10%;
            width: 40%;
          }
        }

        .input {
          width: 100%;
          overflow: hidden;
          margin: 2em 0;

          @include for-tablet-landscape-up {
            transform: translate(20px, 0);
            height: 80px;
            width: 45%;
            flex-grow: 1;
            margin: 0;
          }

          input {

            widtH: 100%;
            opacity: 0;
            background: rgba(255, 255, 255, 0.2);
            border: 0.5px solid rgba(255, 255, 255, 0.7);

            @include for-tablet-landscape-up {
              height: 100%;
              transform: translate(100%, 0);
            }

            @include for-tablet-landscape-up {
              border-radius: unset;
              border-bottom-left-radius: 9999px;
              border-top-left-radius: 9999px;
              border-right: 0;
            }


            &::placeholder {
              color: rgba(255, 255, 255, 0.2);
            }

            &:focus {
              background-color: rgba(255, 255, 255, 0.7);
            }

            &:invalid {
              border: 0.5px solid rgba(255, 0, 0, 1);
            }

            &:valid {
              // border: 0.5px solid rgba(0, 0, 255, 1);
            }

            &:valid, &:focus, &:invalid {
              @include for-tablet-landscape-up {
                border-right: 0;
              }
            }
          }

          input:valid ~ button {
            pointer-events: all;
            cursor: pointer;
            opacity: 1;
          }

          p {
            opacity: 1;
          }
        }

        button {
          transform: scale(0, 0);
          width: 100%;
          margin: 1em 10%;
          height: 53px;

          @include for-tablet-landscape-up {
            width: 148px;
            height: 204px;
            margin: 0;
          }

          border-radius: 999px;
          background-color: #4f4f4f;
          position: relative;

          overflow: hidden;
          opacity: 1;
          pointer-events: none;

          border: 0.5px solid white;

          div {
            opacity: 0.5;
            white-space: nowrap;
            font-size: 12px;
            line-height: 128.4%;

            font-family: $font-neue-montreal;
            font-style: normal;
            font-weight: normal;

            padding: 0 10%;
            /* or 19px */
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            color: #FFFFFF;

            @include for-tablet-landscape-up {
              white-space: unset;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              font-size: 15px;
            }

          }

          &.active {

            background-color: black;

            > div {
              opacity: 1;
            }

            pointer-events: all;
          }
        }
      }

      .subscribe-privacy {

        @include font-button;
        text-align: left;
        text-transform: unset;
        position: relative;
        overflow: visible;
        cursor: pointer;
        opacity: 0;
        width: 80%;
        margin: 0 auto;

        @include for-tablet-landscape-up {
          width: 45%;
          margin-left: calc(40% + 30px);
        }

        &:before {
          position: absolute;
          left: -30px;
          top: 5px;
          content: "";
          width: 10px;
          height: 10px;
          background-color: black;
          border: 1px solid white;
          border-radius: 50%;
        }

        &.selected {
          &:before {
            background-color: white;
          }
        }

        &.isNotAllowed {

          &:before {
            border: 1px solid red;
          }
        }
      }
    }


  }

</style>
