<script>
    import {fade} from 'svelte/transition';
    import {questionsStore} from '$lib/store/stores.js';
    import {QuestionsCopy} from '$lib/_copy.js';

    import Question from './Question.svelte';

</script>
<section in:fade={{delay:0}}>

    {#each QuestionsCopy as question, index (question.key)}

        {#if $questionsStore.answers.length === index}
            <Question question="{question}" index="{index}"/>
        {/if}

    {/each}

</section>

<style lang="scss">

  @import "../../scss/theme";

  section {
    @include pageSection;
  }

</style>