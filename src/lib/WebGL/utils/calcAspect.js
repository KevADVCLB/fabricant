import {Vec2} from 'ogl';

export const calcAspect = ({width, height}) => {

    const aspect = new Vec2();
    if(width > height) {
        aspect.x = 1.0 / (width/height);
        aspect.y = 1.0;
    } else {
        aspect.x = 1.0;
        aspect.y = 1.0 / (height/width);
    }

    return aspect;

}

export const calcAspectSquareUv = ({width, height}) => {

    const aspect = new Vec2();
    if(width > height) {
        aspect.x = 1.0;
        aspect.y = 1.0 / (width/height);
    } else {
        aspect.x = (width/height);
        aspect.y = 1.0;
    }

    return aspect;

}
