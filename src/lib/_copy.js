import copy from '$lib/data/copy---teaser.json';

export const content = copy['en-uk'];

export const ManifestoCopy = [{
    id: 'SECTION-00',
    title: copy['en-uk'].landing_title,
    paragraph: copy['en-uk'].landing_subtitle,
    section: null
}, {
    id: 'SECTION-01',
    chapter: '01',
    title: copy['en-uk'].manifesto_2_paragraph,
    paragraph: copy['en-uk'].manifesto_2_sub_p,
    section: null
}, {
    id: 'SECTION-02',
    chapter: '02',
    title: copy['en-uk'].manifesto_1_paragraph,
    paragraph: copy['en-uk'].manifesto_1_sub_p,
    section: null
}, {
    id: 'SECTION-03',
    chapter: '03',
    title: copy['en-uk'].manifesto_3_paragraph,
    paragraph: copy['en-uk'].manifesto_3_sub_p,
    section: null
}, {
    id: 'SECTION-04',
    chapter: '04',
    title: copy['en-uk'].manifesto_4_paragraph,
    paragraph: copy['en-uk'].manifesto_4_sub_p,
    section: null
}
];

export const PledgeCopy = [
    {
        pledge: copy['en-uk'].pledge_1_step,
    }, {
        pledge: copy['en-uk'].pledge_2_step,
    }, {
        pledge: copy['en-uk'].pledge_3_step,
    }, {
        pledge: copy['en-uk'].pledge_4_step,
    },
]


export const QuestionsCopy = [
    {
        key : "interests",
        question : copy['en-uk'].pledge_1_question,
        answers : [
            {
                copy: copy['en-uk'].pledge_2_answer_1,
                key : 'fashion'
            },
            {
                copy : copy['en-uk'].pledge_2_answer_2,
                key : 'gaming'
            },
            {
                copy : copy['en-uk'].pledge_2_answer_3,
                key : 'blockchain'
            }
        ],
        other : copy['en-uk'].pledge_1_answer_other
    }/*,
    {
        key : "identity",
        question : copy['en-uk'].pledge_2_question,
        answers : [
            {
                copy: copy['en-uk'].pledge_2_answer_1,
                key : 'creator'
            },
            {
                copy : copy['en-uk'].pledge_2_answer_2,
                key : 'curator'
            },
            {
                copy : copy['en-uk'].pledge_2_answer_3,
                key : 'retailer'
            }
        ],
        other : copy['en-uk'].pledge_2_answer_other
    }*/

]
