<script>

    import {fade, fly} from 'svelte/transition';
    import {content} from '$lib/_copy.js';
    import CloseButton from '../ui/CloseButton.svelte';
    import OpenButton from '../ui/OpenButton.svelte';
    import CopyClick from './CopyClick.svelte';
    import ButtonBorder from '../ui/ButtonBorder.svelte';
    import {createEventDispatcher, tick} from 'svelte';
    import {MathUtils} from '$lib/utils/MathUtils.js';
    import {gsap} from '$lib/gsap.js'
    import {SplitText} from '$lib/gsap.js'
    //---------------------------------

    let ctaVisible = false;
    let title;
    let ctaDesktop;
    let ctaMobile;
    let enter;
    let linkCopied = false;

    const dispatch = createEventDispatcher();

    const tween = (node, {delay}) => {

        delay = delay || 0;

        const tl = gsap.timeline({paused: true});
        const splitText = new SplitText(title, {type: 'words, chars'});
        const chars = MathUtils.shuffleArray(splitText.chars);
        tl.set(chars, {opacity: 0});
        tl.set(ctaMobile, {opacity: 0});
        tl.set(ctaDesktop, {opacity: 0});
        tl.set(enter, {opacity: 0});
        tl.set(title, {opacity: 1});

        chars.forEach((char, i) => {
            tl.to(char, {opacity: 1, duration: 0.7}, i * 0.01)
        });

        tl.to([ctaMobile, ctaDesktop], {opacity: 1, duration: 0.7});
        tl.to(enter, {opacity: 1, duration: 0.7}, '-=0.4');

        /* splitPara = new SplitText(paragraph, {type: 'words'});
         tl.set(splitPara.words, {opacity: 0});

         tl.to(splitPara.words, {opacity: 1, stagger: 0.05, duration: 1}, '>-1');*/
        return {
            delay,
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            duration: tl.totalDuration() * 1000,
            tick: t => {
                tl.progress(t);
            }
        }
    }

    const handleCopy = async () => {
        const url = content.share_link || window.location.href;
        const app = new CopyClick({
            target: document.getElementById('clipboard'),
            props: {name: url},
        });
        app.$destroy();

        linkCopied = true;

        await tick();

        linkCopied = false;
    }

    const toggleCTA = (e) => {
        ctaVisible = !ctaVisible;

        if (ctaVisible)
            dispatch('cta-visible');
        else
            dispatch('cta-hidden');
    }

    const handleShare = (type) => {
        let url = '';

        switch (type) {
            case 'discord':
                url = content.discord_url;
                break;
            case 'twitter':
                url = content.twitter_url;
                break;
            case 'insta' :
                url = content.insta_url;
                break;
            case 'twitch' :
                url = content.twitch_url;
                break;
        }

        window.open(url, '_blank');
    }
</script>

<section in:tween={{delay : 1000}} out:fade>

    <div class="share">

        <h2 bind:this={title}>
            <span></span> {@html content.signup_end_title}
        </h2>

        <div class="share-cta__mobile" bind:this={ctaMobile} on:touchstart={toggleCTA}>
            <h3>
                {content.share_title}
            </h3>
            <div>{content.share_manifesto}</div>
        </div>

        {#if ctaVisible}
            <div class="share-cta share-cta-overlay__mobile" transition:fly="{{ x: -300, duration: 200 }}">

                <div class="cta-text">
                    <div class="bullet">{content.share_download}</div>

                    <div class="cta-text__buttons">
                        <button>
                            <svg width="37" height="57" viewBox="0 0 37 57" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="35.8824" height="56" rx="3.5" fill="white" stroke="white"/>
                                <path d="M15.3094 25.0104L21.3535 28.5L15.3094 31.9896L15.3094 25.0104Z"
                                      stroke="black"/>
                            </svg>

                            <div>
                                {content.share_story}
                            </div>
                        </button>
                        <button>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="34.7647" height="34.7647" rx="3.5" fill="white"
                                      stroke="white"/>
                                <path d="M15.3094 14.9516L21.3535 18.4412L15.3094 21.9307L15.3094 14.9516Z"
                                      stroke="black"/>
                            </svg>

                            <div>
                                {content.share_feed}
                            </div>

                        </button>

                    </div>

                    <div class="share-cta__link bullet" on:click={handleCopy}>{content.share_copy}</div>
                    {#if linkCopied}
                        <div class="share-cta__feedback" out:fade={{delay:2000, duration : 4000}}>Link copied to your clipboard</div>
                    {/if}
                </div>

                <CloseButton on:close={toggleCTA}/>

            </div>
        {/if}

        <div class="share-cta share-cta__desktop" bind:this={ctaDesktop} class:hidden={!ctaVisible}>
            {#if !ctaVisible}
                <div class="cta-container">
                    <h3>
                        {content.share_title}
                    </h3>
                    <div class="cta-message">
                        <div>{content.share_manifesto}</div>
                        <img src="images/share/poster1x.png"/>
                    </div>

                    <OpenButton on:open={toggleCTA}/>

                </div>
            {/if}
            <div class="cta-image">
                <h2>{content.share_manifesto_message}</h2>
            </div>
            <div class="cta-text">
                <div class="bullet">{content.share_download}</div>

                <div class="cta-text__buttons">
                    <a href="/share/Manifesto_share_STORY.mp4" download="Manifesto_share_STORY.mp4">
                        <button>
                            <svg width="37" height="57" viewBox="0 0 37 57" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="35.8824" height="56" rx="3.5" fill="white" stroke="white"/>
                                <path d="M15.3094 25.0104L21.3535 28.5L15.3094 31.9896L15.3094 25.0104Z"
                                      stroke="black"/>
                            </svg>

                            <div>
                                {content.share_story}
                            </div>
                        </button>
                    </a>
                    <a href="/share/Manifesto_share_FEED.mp4" download="Manifesto_share_FEED.mp4">
                        <button>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="34.7647" height="34.7647" rx="3.5" fill="white"
                                      stroke="white"/>
                                <path d="M15.3094 14.9516L21.3535 18.4412L15.3094 21.9307L15.3094 14.9516Z"
                                      stroke="black"/>
                            </svg>

                            <div>
                                {content.share_feed}
                            </div>

                        </button>
                    </a>

                </div>

                <div class="bullet share-cta__link" on:click={handleCopy}>{content.share_copy}</div>
                {#if linkCopied}
                    <div class="share-cta__feedback" out:fade={{delay:2000, dutation:4000}}>Link copied to your clipboard</div>
                {/if}
            </div>
            <CloseButton on:close={toggleCTA}/>
        </div>

        <div class="share-enter" bind:this={enter}>

            <h3>
                {content.share_join}
            </h3>

            <div class="share-discord__mobile">
                <span>{content.share_discord}</span>
                <ButtonBorder on:clicked={()=>handleShare('discord')}>
                    <svg width="78" height="104" viewBox="0 0 78 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M46.789 44.34C45.4296 43.714 43.9761 43.2591 42.4565 43C42.2699 43.3321 42.0519 43.7788 41.9016 44.1341C40.2862 43.895 38.6857 43.895 37.1 44.1341C36.9497 43.7788 36.7267 43.3321 36.5384 43C35.0172 43.2591 33.562 43.7157 32.2027 44.3433C29.4608 48.4214 28.7175 52.3981 29.0892 56.3184C30.9077 57.655 32.6701 58.467 34.4028 58.9984C34.8306 58.4189 35.2121 57.8028 35.5408 57.1536C34.9148 56.9195 34.3152 56.6306 33.7487 56.2952C33.899 56.1856 34.046 56.071 34.188 55.9531C37.6434 57.5438 41.3978 57.5438 44.8119 55.9531C44.9556 56.071 45.1026 56.1856 45.2512 56.2952C44.683 56.6322 44.0818 56.9211 43.4558 57.1553C43.7845 57.8028 44.1644 58.4205 44.5939 59C46.3282 58.4687 48.0922 57.6567 49.9107 56.3184C50.3468 51.7738 49.1658 47.8336 46.789 44.34ZM36.0115 53.9075C34.9743 53.9075 34.1236 52.9543 34.1236 51.7937C34.1236 50.6331 34.9561 49.6783 36.0115 49.6783C37.067 49.6783 37.9176 50.6314 37.8995 51.7937C37.9011 52.9543 37.067 53.9075 36.0115 53.9075ZM42.9884 53.9075C41.9511 53.9075 41.1005 52.9543 41.1005 51.7937C41.1005 50.6331 41.9329 49.6783 42.9884 49.6783C44.0438 49.6783 44.8945 50.6314 44.8763 51.7937C44.8763 52.9543 44.0438 53.9075 42.9884 53.9075Z"
                              fill="white"/>
                    </svg>
                </ButtonBorder>
            </div>

            <ButtonBorder className={"share-discord__desktop"} on:clicked={()=>handleShare('discord')}>
                <span class="button-text" style="margin-left:20px">{content.share_discord}</span>
                <svg style="z-index:1" width="78" height="104" viewBox="0 0 78 104" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M46.789 44.34C45.4296 43.714 43.9761 43.2591 42.4565 43C42.2699 43.3321 42.0519 43.7788 41.9016 44.1341C40.2862 43.895 38.6857 43.895 37.1 44.1341C36.9497 43.7788 36.7267 43.3321 36.5384 43C35.0172 43.2591 33.562 43.7157 32.2027 44.3433C29.4608 48.4214 28.7175 52.3981 29.0892 56.3184C30.9077 57.655 32.6701 58.467 34.4028 58.9984C34.8306 58.4189 35.2121 57.8028 35.5408 57.1536C34.9148 56.9195 34.3152 56.6306 33.7487 56.2952C33.899 56.1856 34.046 56.071 34.188 55.9531C37.6434 57.5438 41.3978 57.5438 44.8119 55.9531C44.9556 56.071 45.1026 56.1856 45.2512 56.2952C44.683 56.6322 44.0818 56.9211 43.4558 57.1553C43.7845 57.8028 44.1644 58.4205 44.5939 59C46.3282 58.4687 48.0922 57.6567 49.9107 56.3184C50.3468 51.7738 49.1658 47.8336 46.789 44.34ZM36.0115 53.9075C34.9743 53.9075 34.1236 52.9543 34.1236 51.7937C34.1236 50.6331 34.9561 49.6783 36.0115 49.6783C37.067 49.6783 37.9176 50.6314 37.8995 51.7937C37.9011 52.9543 37.067 53.9075 36.0115 53.9075ZM42.9884 53.9075C41.9511 53.9075 41.1005 52.9543 41.1005 51.7937C41.1005 50.6331 41.9329 49.6783 42.9884 49.6783C44.0438 49.6783 44.8945 50.6314 44.8763 51.7937C44.8763 52.9543 44.0438 53.9075 42.9884 53.9075Z"
                          fill="white"/>
                </svg>
            </ButtonBorder>

            <div class="enter-other">
                <div>{content.share_other}</div>
                <div>
                    <button on:click={()=>handleShare('insta')} class="button-insta">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0)">
                                <path d="M9 1.62225C11.403 1.62225 11.688 1.63125 12.6375 1.67475C15.0765 1.78575 16.2157 2.943 16.3267 5.364C16.3702 6.31275 16.3785 6.59775 16.3785 9.00075C16.3785 11.4045 16.3695 11.6888 16.3267 12.6375C16.215 15.0563 15.0788 16.2157 12.6375 16.3267C11.688 16.3702 11.4045 16.3792 9 16.3792C6.597 16.3792 6.312 16.3702 5.36325 16.3267C2.91825 16.215 1.785 15.0525 1.674 12.6368C1.6305 11.688 1.6215 11.4037 1.6215 9C1.6215 6.597 1.63125 6.31275 1.674 5.36325C1.78575 2.943 2.922 1.785 5.36325 1.674C6.31275 1.63125 6.597 1.62225 9 1.62225ZM9 0C6.55575 0 6.24975 0.0105 5.28975 0.054C2.02125 0.204 0.20475 2.0175 0.05475 5.289C0.0105 6.24975 0 6.55575 0 9C0 11.4443 0.0105 11.751 0.054 12.711C0.204 15.9795 2.0175 17.796 5.289 17.946C6.24975 17.9895 6.55575 18 9 18C11.4443 18 11.751 17.9895 12.711 17.946C15.9765 17.796 17.7975 15.9825 17.9452 12.711C17.9895 11.751 18 11.4443 18 9C18 6.55575 17.9895 6.24975 17.946 5.28975C17.799 2.02425 15.9832 0.20475 12.7118 0.05475C11.751 0.0105 11.4443 0 9 0V0ZM9 4.3785C6.44775 4.3785 4.3785 6.44775 4.3785 9C4.3785 11.5522 6.44775 13.6222 9 13.6222C11.5522 13.6222 13.6215 11.553 13.6215 9C13.6215 6.44775 11.5522 4.3785 9 4.3785ZM9 12C7.34325 12 6 10.6575 6 9C6 7.34325 7.34325 6 9 6C10.6567 6 12 7.34325 12 9C12 10.6575 10.6567 12 9 12ZM13.8045 3.11625C13.2075 3.11625 12.7238 3.6 12.7238 4.19625C12.7238 4.7925 13.2075 5.27625 13.8045 5.27625C14.4008 5.27625 14.8837 4.7925 14.8837 4.19625C14.8837 3.6 14.4008 3.11625 13.8045 3.11625Z"
                                      fill="white"/>
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="18" height="18" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <button on:click={()=>handleShare('twitter')} class="button-twitter">
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 1.6574C16.3745 1.93878 15.7023 2.12828 14.9968 2.2137C15.7172 1.77656 16.2704 1.08388 16.5304 0.258409C15.8567 0.663249 15.1102 0.957547 14.3154 1.11618C13.68 0.429245 12.7727 0 11.7697 0C9.51787 0 7.86321 2.129 8.37179 4.33911C5.474 4.19196 2.90417 2.78507 1.18362 0.646739C0.269875 2.23523 0.70975 4.31327 2.26242 5.36556C1.6915 5.3469 1.15317 5.18827 0.683542 4.9234C0.645292 6.5607 1.80342 8.09249 3.48075 8.43345C2.98987 8.56839 2.45225 8.59998 1.90542 8.49374C2.34883 9.89776 3.63658 10.9192 5.16375 10.9479C3.6975 12.1129 1.85017 12.6333 0 12.4122C1.54346 13.415 3.37733 14 5.3465 14C11.8221 14 15.4806 8.45785 15.2596 3.48708C15.941 2.98821 16.5325 2.36587 17 1.6574Z"
                                  fill="white"/>
                        </svg>

                    </button>
                    <button on:click={()=>handleShare('twitch')} class="button-twitch">
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M1.19532 0L0 3.08925V15.7163H4.24963V18H6.64028L8.8982 15.7163H12.3514L17 11.0145V0H1.19532V0ZM15.4057 10.209L12.7496 12.8955H8.5L6.24208 15.1793V12.8955H2.65611V1.61175H15.4057V10.209ZM12.7496 4.70175V9.39825H11.1561V4.70175H12.7496ZM8.5 4.70175V9.39825H6.90648V4.70175H8.5Z"
                                  fill="white"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    </div>
    <div id="clipboard"></div>
</section>

<style lang="scss">

  @import "../../scss/theme";

  section {
    @include pageSection;

    .share {

      display: flex;
      flex-direction: column;

      width: 100%;
      min-height: 100%;
      padding: 53px 0 0;
      justify-content: center;
      align-items: center;
      position: relative;

      @include for-tablet-landscape-up {
        height: unset;
        display: grid;
        min-height: unset;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 43% 20% 1fr;
      }

      @include for-tablet-landscape-up {
        padding: 0;
        height: unset;
        width: 60vw;
      }

      > h2, > div {
        margin: 20px 0;
      }

      h2 {
        opacity: 0;
        @include font-title-pledge;

        @include for-tablet-landscape-up {
          grid-row: 1 / 2;
          grid-column: 1 / 4;
          margin-bottom: 1.5em;
        }

        span {
          display: inline-block;
          width: 2em;
          @include for-tablet-landscape-up {
            width: 3em;
          }
        }
      }

      .share-enter {
        opacity: 0;
        width: 100%;
        padding: 0 20px;
        margin: 32px 0 41px;

        @include for-tablet-landscape-up {
          grid-column: 3/4;
          grid-row: 2 /3;
          width: 250px;
          padding: 0;
          margin: 0;
        }

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        h3 {
          margin-bottom: 1em;
        }

        > div {
          width: 100%;
        }

        .share-discord__mobile {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          span {
            @include font-button;
            text-align: left;
          }

          @include for-tablet-landscape-up {
            display: none;
          }
        }

        .enter-discord {
          border-radius: 999px;
          background-color: black;
          position: relative;

          overflow: hidden;
          opacity: 0.5;
          pointer-events: none;

          border: 0.5px solid white;

          width: 100%;
          margin: 0 10%;
          height: 53px;
          display: flex;
          flex-direction: row;
          align-items: center;
          @include font-button;
          margin-bottom: 1em;
          justify-content: space-between;
        }

        .enter-other {
          margin-top: 1.5em;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          @include font-button;
          width: 135px;

          > div:first-of-type {
            font-size: 12px;
            margin-bottom: 1.5em;
          }

          > div:last-of-type {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            button {
              outline: none;
              background: none;
              border: none;
              cursor: pointer;
              transition: opacity 200ms;

              &:hover {
                opacity: 0.7;
              }
            }

            .button-insta {
              width: 18px;
              height: 18px;
            }

            .button-twitter {
              width: 17px;
              height: 14px;
            }

            .button-twitch {
              width: 17px;
              height: 18px;
            }

          }
        }

        :global(.button-text) {
          font-size: 12px;
        }
      }

      .share-cta__mobile {
        opacity: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
        border-radius: 20px;
        padding: 20px 36px;
        @include for-tablet-landscape-up {
          display: none;
        }

        h3 {
          margin-bottom: 1em;
        }

        > div {
          @include font-button;
          text-align: left;
        }

      }

      .share-cta-overlay__mobile {
        z-index: $overlay-index;
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        widtH: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background-color: black;

        @include for-tablet-landscape-up {
          display: none;
        }
      }

      .cta-text {

        height: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position:relative;

        @include for-tablet-landscape-up {
          padding-left: 15%;
          width: 60%;
        }

        div {
          font-family: $font-neue-montreal;
          font-size: 12px;
          line-height: 137.4%;
          /* or 15px */
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        //copy link
        .share-cta__link {
          cursor: pointer;
        }

        .share-cta__feedback {
          margin-top: 1em;
          color: #6AC755;
          position:absolute;
          bottom:-3em;
        }

        .cta-text__buttons {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          padding: 2em 0 3em;

          a {
            margin: 0 2em;
          }

          a:last-of-type {
            margin-right: 0;
          }

          a:first-of-type {
            margin-left: 0;
          }

          button {

            background: none;
            outline: none;
            border: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            @include for-tablet-landscape-up {
              opacity: 0.7;
              transition: opacity 200ms;
            }

            &:hover {
              opacity: 1;
            }

            > div {
              margin: 1.5em 0 0;
              border: solid 1px white;
              border-radius: 999px;
              padding: 1em 2em;
              background: rgba(255, 255, 255, 0.05);
            }
          }

        }

        .bullet {
          max-width: 15em;

          &:before {
            left: -3em;
            width: 2em;
            height: 2em;
            top: -0.5em;
            background: radial-gradient(circle, var(--s1_color) 0%, rgba(255, 255, 255, 0) 25%);
          }
        }
      }

      .share-cta__desktop {
        opacity: 0;
        display: none;

        @include for-tablet-landscape-up {
          margin: 0;
          z-index: 2;
          background: black;
          box-sizing: border-box;
          transition: opacity 700ms, clip-path 500ms $expo-out;
          border-radius: 40px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          align-items: center;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          clip-path: inset(0% 0% 0% 0% round 40px);
        }

        h3 {
          margin-bottom: 2em;
        }

        .cta-container {
          width: 43%;
          height: 50%;
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 61px 31px;
          transition: opacity 200ms;
          opacity: 0;

          .cta-message {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            @include font-button;
            width: 120%;

            > div {
              font-size: 12px;
            }

            img {
              width: 50%;
            }

          }
        }

        .cta-image {
          width: 40%;
          height: 100%;
          transform: translate(0, 0);
          transition: transform 700ms 150ms $expo-out;
          background-image: url(/images/share/poster2x.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-radius: 40px;

          h2 {
            opacity: 1;
            text-align: center;
            margin: 0;
          }

        }

        &.hidden {

          clip-path: inset(49px 17px 17px round 17px);

          .cta-container {
            opacity: 1;
          }

          @include for-tablet-landscape-up {
            clip-path: inset(50% 57% 0% 0% round 40px);

            .cta-image {
              transition: transform 300ms $expo-out;
              transform: translate(-100%, 0);
            }
          }
        }
      }
    }

  }
</style>

