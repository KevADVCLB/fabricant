<script>

    import {questionsStore} from '$lib/store/stores.js';
    import {content, QuestionsCopy} from '$lib/_copy.js';
    import {createEventDispatcher, onMount} from 'svelte';
    import {fade} from 'svelte/transition';
    import {MathUtils} from '$lib/utils/MathUtils.js';
    import QuestionButton from '../ui/QuestionButton.svelte';
    import {Expo, gsap} from '$lib/gsap.js';
    import {SplitText} from '$lib/gsap.js'
    //-------------------------------

    export let question;
    export let index;
    export let selected;

    //----------------------------

    let otherInputValue;
    let other;
    let next;
    let buttons = [];
    let answers = {};
    let title;
    let tl;
    let canPass = false;
    let hasSelected = false;
    const dispatch = createEventDispatcher();

    //----------------------------------

    onMount(() => {

        seeAnswers();

        questionsStore.subscribe(() => {
            seeAnswers();
        });
    })

    const handleNextQuestion = () => {

        if (canPass) {
            const index = $questionsStore.answers.length;
            const results = Object.assign({}, $questionsStore);

            if (typeof otherInputValue !== 'undefined') {
                answers['other'] = otherInputValue;
            }

            results.answers[index] = answers;
            $questionsStore = results;
        } else {
            hasSelected = true;
        }
    };

    const tween = () => {

        tl = gsap.timeline({paused: true});
        const splitText = new SplitText(title, {type: 'words, chars'});
        const chars = MathUtils.shuffleArray(splitText.chars);
        tl.set(chars, {opacity: 0});

        tl.set(title, {opacity: 1});
        tl.set(other, {opacity: 0});
        tl.set(buttons, {scale: 0});
        tl.set(next, {opacity: 0, scale: 0});

        chars.forEach((char, i) => {
            tl.to(char, {opacity: 1, duration: 0.7}, i * 0.01)
        });
        tl.to(buttons, {scale: 1, duration: 1, stagger: 0.05, ease: Expo.easeOut}, '-=0.5');
        tl.to(other, {opacity: 1, duration: 0.7}, '-=0.5');
        tl.to(next, {opacity: 1, scale: 1, duration: 0.7, ease: Expo.easeOut}, '-=0.5');

        return {
            /* GSAP's duration is in seconds. Svelte's is in miliseconds */
            duration: tl.totalDuration() * 1000,
            tick: t => {
                tl.progress(t);
            }
        }
    }

    /**
     * Populate answers object..
     */
    const seeAnswers = () => {
        answers = {};
        const index = $questionsStore.answers.length;
        if (QuestionsCopy[index])
            QuestionsCopy[index].answers.map(obj => obj.key).forEach(key => answers[key] = false);
    }

    const handleSelection = (i) => {
        answers[i.key] = !answers[i.key];

        canPass = false;
        Object.keys(answers).forEach(a => {
            canPass = canPass || !!answers[a];
        });

    };

</script>
<div class="question" in:tween out:fade>
    <div class="question-container">
        <div class="question-header">
            <h2 bind:this={title}>
                {#if QuestionsCopy.length > 1}
                    <span class="span_count">0{index + 1}/02</span>
                {/if}
                {@html question.question}
                <span class="span__choose bullet" class:isVisible={!canPass}>{content.pledge_choose}</span>
            </h2>
        </div>
        <div class="question-answers">
            {#each question.answers as answer, i}

               <!-- <button class="answser" bind:this={buttons[i]} class:selected={answers[answer.key]}
                        data-key="{answer.key}"
                        on:click={(e) => handleSelection(answer)}>
                    <div>
                        <div>
                            {answer.copy}
                        </div>
                    </div>
                </button>
-->
                <QuestionButton bind:button={buttons[i]} selected={answers[answer.key]} key="{answer.key}" copy="{answer.copy}" on:click={() => handleSelection(answer)}/>
            {/each}
        </div>

        <div class="question-other" bind:this={other}>
            <div>
                OTHER?
            </div>
            <input type="text" placeholder="Start Typing" bind:value={otherInputValue}/>
        </div>

        <button class="question-next" bind:this={next} class:active={canPass} on:click={handleNextQuestion}>
            Next
        </button>

    </div>
</div>

<style lang="scss">

  @import "../../scss/theme";

  .question {
    /*  position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;*/
    overflow: auto;
    width: 100%;
    min-height: 100%;
    padding: 0;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    widtH: 100%;
    height: 100%;
    justify-content: space-between;

    @include for-tablet-landscape-up {
      display: grid;
      padding: 0;
      margin: 0 100px;
      height: unset;
      grid-template-columns: 1fr minmax(60%, 800px) 1fr;
      grid-template-rows: minmax(12vmax, auto) auto 3vmax 80px;
      width: 80vmax;
    }

    > div, > button {
      margin: 10px 0;
    }

    .question-header {

      @include for-tablet-landscape-up {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
        margin-bottom: 3vmax;
      }

      h2 {
        position: relative;
        @include font-title-pledge;
        opacity: 0;
        padding-bottom: 1em;
        @include for-tablet-landscape-up {
          padding: 0;
        }

        span.span_count {
          display: inline-block;
          width: 6em;
          font-family: Cako;
          font-style: normal;
          font-weight: normal;
          font-size: 17px;
          line-height: 125%;
          /* or 21px */
          height: 2vmax;
          vertical-align: super;
          text-transform: uppercase;
          opacity: 0.5;
        }

        span.span__choose {
          position: absolute;
          bottom: 0;
          left: 3em;
          font-family: Neue Montreal;
          font-style: normal;
          font-size: 8px;
          font-weight: normal;
          white-space: nowrap;

          @include for-tablet-landscape-up {
            right: 4em;
            left: unset;
            bottom: -2em;
            font-size: 10px;
          }

          line-height: 135%;
          /* or 11px */

          letter-spacing: 0.06em;
          text-transform: uppercase;

          color: #FFFFFF;
          opacity : 0;
          transition: opacity 500ms;

          &.isVisible {
            opacity : 1;
          }
        }

        .bullet:before{
          left: -3em;
          width: 2em;
          height: 2em;
          top: -0.5em;
          background: radial-gradient(circle, var(--s1_color) 0%, rgba(255, 255, 255, 0) 25%);
        }
      }


    }

    .question-answers {
      display: flex;
      flex-direction: column;

      width: 100%;


      @include for-tablet-landscape-up {
        flex-direction: row;
        justify-content: space-between;
      }

      grid-row: 2/3;
      grid-column: 2/3;

      @keyframes pressed {
        0% {
          transform: scale(1,1);
        }
        100%{
          transform: scale(0.95, 0.95);
        }
      }

    }

    .question-other {
      grid-row: 4/5;
      grid-column: 2/3;
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      width: 100%;
      opacity: 0;

      @include for-tablet-landscape-up {
        flex-direction: row;
        margin: 0;
        height: 100%;
      }
      align-items: center;

      > div {
        @include font-button;
        margin: 0 auto 5px;

        @include for-tablet-landscape-up {
          margin: 0 3em 0 0;
        }
      }

      input {
        width: 100%;

        @include for-tablet-landscape-up {
          flex-grow: 1;
          height: 100%;
        }
      }
    }


    .question-next {
      height: 53px;
      border-radius: 999px;
      padding: 0 4em;
      widtH: fit-content;
      border: 0;
      background-color: black;
      position: relative;
      overflow: hidden;
      opacity: 0;
      @include font-button;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background-color: rgba(0,0,0,0.3);

      &.active {
        background-color: black;
      }

      @include for-tablet-landscape-up {
        grid-row: 5/6;
        grid-column: 2/3;
        align-self: auto;
        justify-self: end;
        margin-top: 3vmax;
        height: 80px;
      }

      @include for-desktop-up {
        grid-row: 4/5;
        grid-column: 3/4;
        margin: 0 auto;
      }

    }

  }

</style>
