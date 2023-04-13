import {stateStore} from '$lib/store/stores.js';
import {MathUtils} from '$lib/utils/MathUtils.js';
import {expoOut} from 'svelte/easing';
import {get} from 'svelte/store';
import {HIDDEN_IMAGES, LANDING_STATE, GLOBALS, SECTION_0, MAP_TRANSFORM} from '$lib/_globals.js';

/**
 *
 * General utilities for the map section
 *
 */
export const MapUtils = {

    /**
     * Returns lines (and intersections) projected from center of viewport
     * to each textElement
     *
     * @param x
     * @param y
     * @param scale
     * @param time
     * @param textElements
     * @return {[]}
     */
    getLines: (x, y, scale, time, textElements, mobile) => {

        switch (get(stateStore).state) {
            case LANDING_STATE:
                return MapUtils.getLinesLanding(x, y, scale, textElements, mobile);
            default:
                return MapUtils.getLinesPledge(x, y, scale, time, textElements, mobile);

        }
    },

    getLinesLanding: (x, y, scale, textElements, mobile) => {

        x *= -1;
        y *= -1;
        const lines = [];

        textElements.forEach(element => {

            if (element.circle && element.id !== 'SECTION-00') {
                const vectors = [{
                    x: GLOBALS.CanvasWidth / 2,
                    y: GLOBALS.CanvasHeight / 2
                }, {
                    x: (element.circle.x * scale - x),
                    y: (element.circle.y * scale - y)
                }];

                const rotation = Math.atan2(vectors[0].y - vectors[1].y, vectors[0].x - vectors[1].x);
                const offset = GLOBALS.MOBILE ? 25 : 50;

                let intersection = null;
                try {
                    intersection = MathUtils.pointOnRect(vectors[1].x, vectors[1].y, offset, offset, GLOBALS.CanvasWidth - offset, GLOBALS.CanvasHeight - offset, true);
                    lines.push({
                        textElement: element,
                        id: element.id,
                        color: element.id === 'SECTION-00' ? '#00f' : '#0f0',
                        vectors,
                        rotation,
                        intersection
                    });
                } catch (e) {
                    lines.push({
                        textElement: element,
                        id: element.id,
                        color: element.id === 'SECTION-00' ? '#00f' : '#0f0',
                        vectors,
                        rotation,
                        intersection: null
                    });
                }

            }
        });

        return lines;
    },

    getLinesPledge: (x, y, scale, time, textElements, mobile) => {

        let ratio = (time - get(stateStore).start) / 3000;

        if(ratio > 1)
            return null;

        ratio = expoOut(Math.min(1,ratio));

        const offset = GLOBALS.MOBILE ? 25 : 50;
        const destOffset = GLOBALS.MOBILE ? 75 : 100;

        x *= -1;
        y *= -1;
        const lines = [];
        let border = offset + (destOffset - offset) * ratio;

        textElements.forEach((element, i) => {

            if (element.circle && element.id !== SECTION_0) {

                const startPos = {
                    x: (element.circle.x * scale - x),
                    y: (element.circle.y * scale - y)
                };

                //center elements in top..
                //todo get values from css...
                const destPos = {
                    x: GLOBALS.CanvasWidth / 2 - 100 + 50 * (i - 1) + 25,
                    y: 0
                };

                const vectors = [{
                    x: GLOBALS.CanvasWidth / 2,
                    y: GLOBALS.CanvasHeight / 2
                }, {
                    x: startPos.x + (destPos.x - startPos.x) * ratio,
                    y: startPos.y + (destPos.y - startPos.y) * ratio
                }];

                const rotation = Math.atan2(vectors[0].y - vectors[1].y, vectors[0].x - vectors[1].x);

                //projects lines past text elements, ensuring we've an intersection throguh the view rect...
                let intersection = MathUtils.pointOnRect(vectors[1].x, vectors[1].y, border, border, GLOBALS.CanvasWidth - border, GLOBALS.CanvasHeight - border);

                lines.push({
                    textElement: element,
                    id: element.id,
                    color: element.id === SECTION_0 ? '#00f' : '#0f0',
                    vectors,
                    rotation,
                    intersection
                });
            }
        });

        return lines;
    },

    seeChildren: (children, shapes) => {

        children.forEach(child => {

            const type = child.tagName;
            let id = child.properties && child.properties.id ? child.properties.id : type;
            id = id ? id.toString().replace(' ', '-') : null;

            let x, y, w, h, stroke, fill, properties = child.properties || {};
            const children = child.children || [];

            switch (type) {
                case 'svg':
                    shapes.push({id, type, width: properties.width, height: properties.height});
                    break;
                case 'circle':
                    x = properties.cx;
                    y = properties.cy;
                    const radius = properties.r;
                    stroke = properties.stroke;
                    const strokeWidth = properties['stroke-width'] || '';

                    let strokeDash = properties['stroke-dasharray'] || '';
                    strokeDash = strokeDash.split(' ');

                    fill = properties['fill'];
                    if (x && y && radius && (stroke || fill)) {
                        let obj = {id, type, x, y, radius, stroke, strokeWidth, fill, strokeDash}
                        shapes.push(obj);
                    }
                    break;
                case 'rect':
                    x = properties.x;
                    y = properties.y;
                    w = properties.width;
                    h = properties.height;
                    fill = properties.fill;
                    fill = fill && fill.indexOf('url') === -1 ? fill : null;
                    stroke = properties.stroke;
                    if (x && y && w && h && (fill || stroke)) {
                        shapes.push({id, type, fill, stroke, x, y, w, h});
                    }
                    break;
                case 'image' :

                    x = properties.x;
                    y = properties.y;
                    w = properties.width;
                    h = properties.height;

                    const fileName = properties.fileName;
                    if (!fileName)
                        console.error('No file name for image:  ' + properties.id);

                    if (HIDDEN_IMAGES.indexOf(properties.id) === -1) {
                        if (w && h && x && y) {
                            shapes.push({id, fileName, type, w, h, x, y});
                        }
                    } else {
                        //hide image
                    }
                    break;
                case 'pattern' :
                    break;
                case 'text':

                    if(id.indexOf("@") !== -1) {

                        const tspan = child.children[0];
                        properties = tspan.properties;
                        x = properties.x;
                        y = properties.y;

                        shapes.push({id, type, w, h, x, y});
                    }
                    break;
            }

            MapUtils.seeChildren(children, shapes);
        })
    },

    seeJSON: (map) => {

        const shapes = [];
        const children = map.children;
        MapUtils.seeChildren(children, shapes);
        return {
            shapes
        }

    },

    inView : (obj) => {
        const imageElementWidth = (obj.w || 0) * 0.5 * MAP_TRANSFORM.scale;
        const imageElementHeight = (obj.h || 0) * 0.5 * MAP_TRANSFORM.scale;

        let mapPosX = MAP_TRANSFORM.x + ((obj.x * MAP_TRANSFORM.scale) + imageElementWidth);
        let mapPosY = MAP_TRANSFORM.y + ((obj.y * MAP_TRANSFORM.scale) + imageElementHeight);

        const inBoundsX = mapPosX > -300 && mapPosX < MAP_TRANSFORM.windowSize.x + 300;
        const inBoundsY = mapPosY > -300 && mapPosY < MAP_TRANSFORM.windowSize.y + 300;

        return inBoundsX && inBoundsY;

    },

    getHandleAlignment : (alignment, bounds)=>{

        const [ver, hor] = alignment.split(" ")
        let alignmentDirection = {x: 0, y: 0, offsetX: 0, offsetY: 0};

        switch(ver) {
            case "top" : {
                alignmentDirection.y = -1.0;
                alignmentDirection.offsetY = -bounds.height;
            }
                break;

            case "bottom" : {
                alignmentDirection.y = 1.0;
            }
                break;

            case "center" : {
                alignmentDirection.y = 0.0;
                alignmentDirection.offsetY = -bounds.height * 0.5;
            }
                break;
        }

        switch(hor) {
            case "right" : {
                alignmentDirection.x = 1.0;
                alignmentDirection.offsetX = -bounds.width;
            }
                break;

            case "left" : {
                alignmentDirection.x = -1.0;
            }
                break;

            case "center" : {
                alignmentDirection.x = 0.0;
                alignmentDirection.offsetX = -bounds.width * 0.5;
            }
                break;
        }

        return alignmentDirection;
    }


}