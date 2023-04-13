export const GLOBALS = {
    MOBILE: 0,
    CanvasWidth: -1,
    CanvasHeight: -1,
    dpr : 1,
    device : ""
};

export const MAP_TRANSFORM = {
    x: 0.0,
    y: 0.0,
    width: 2.0,
    height: 2.0,
    scale: 1.0,
    mapWidth : 0,
    mapHeight : 0,
    parallaxScale : 0.00003,
    viewportCenter : {x : 0.5, y : 0.5},
    windowSize : {width: 1, height: 1},
    sectionCircleReference : {
        radius : -1
    },
    getScale : ()=>{
        var scale = Math.max(GLOBALS.CanvasWidth, GLOBALS.CanvasHeight) / (MAP_TRANSFORM.sectionCircleReference.radius * 2);
        return scale;
    }
}

export const SHARE_STATE = "share";
export const SUBSCRIBE_STATE = "subscribe";
export const LANDING_STATE = "landing";
export const QUESTIONS_STATE = "questions";
export const PLEDGE_STATE = "pledge";
export const SECTION_0 = 'SECTION-00';

export const QUAD_TYPE = {
    image: 'image',
    imageSequence: 'imageSequence'
}

export const BACKGORUND_GRADIENT_SRC = "images/webgl/gradient-fab12.jpg";
export const FLOWMAP_TEXTURE_SRC = "images/webgl/flowmap.png";

export const SEQUENCE_MAP = {

    'image1': {
        path: 'images/headSequence/head_',
        frameCount: 64,
        format: '.basis'
    },
    'image19': {
        path: 'images/turntableSequence/Look_Assets_TF_Final_Version_',
        frameCount: 128,
        format: '.basis'
    },
    // 'image10': {
    //     path: 'images/corsetSequence/Look_Assets_TF_v6_',
    //     frameCount: 64,
    //     format: '.basis'
    // },

};

export const HIDDEN_IMAGES = [
    'image27', 'image11', 'image13', 'image12'
];

export const IMAGE_HANDLES = {

    'image14': {
        text: '@thediigitals',
        url: 'about:blank',
        alignment: 'bottom left'
    },
    'image22': {
        text: '@ruby9100m',
        url: 'about:blank',
        alignment: 'top center'
    },
    'image4': {
        text: '@sgicreator',
        url: 'about:blank',
        alignment: 'bottom center'
    },

    'image5': {
        text: '@veletagram',
        url: 'about:blank',
        alignment: 'bottom left'
    },
    'image3': {
        text: '@maisontaskin',
        url: 'about:blank',
        alignment: 'bottom left'
    },
    'image8': {
        text: '@ruby9100m',
        url: 'about:blank',
        alignment: 'bottom left'
    },

    'image7': {
        text: '@rita_louro',
        url: 'about:blank',
        alignment: 'bottom right'
    },
    'image6': {
        text: '@alexa_sirbu',
        url: 'about:blank',
        alignment: 'bottom center'
    },
    'image9': {
        text: '@rtfktstudios',
        url: 'about:blank',
        alignment: 'bottom center'
    },
    'image15': {
        text: '@trs.mnz',
        url: 'about:blank',
        alignment: 'bottom center'
    },
    'image24': {
        text: '@trs.mnz',
        url: 'about:blank',
        alignment: 'bottom left'
    },

}