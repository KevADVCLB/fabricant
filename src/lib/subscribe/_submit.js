import {QuestionsCopy} from '$lib/_copy.js';
import {get} from 'svelte/store';
import {questionsStore} from '$lib/store/stores.js';

//todo get submit url..
const resource = "users";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function submit(subscribeInfo) {

    let answers = get(questionsStore).answers;
    let results = {};
    QuestionsCopy.map(question => question.key).forEach((key, i) => {
        results[key] = answers[i];
    });

    const data = {
        ...results,
        ...subscribeInfo
    };

    //todo set cookie on complete

    try {

        //todo resolve cors errors

        const res = await fetch(`${BACKEND_URL}/${resource}`, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: data && JSON.stringify(data)
        });

        console.log(res);

        return {
            status: res.status
        };

    } catch (e) {

        return {
            status: 200
        };
    }
}