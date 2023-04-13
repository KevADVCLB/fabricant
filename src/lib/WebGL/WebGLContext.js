import {Camera, Renderer, RenderTarget, Transform, Vec2} from 'ogl';
import {BasisTextureLoader} from './ogl-basis-texture-loader/index.js';

BasisTextureLoader.setTranscoderPath('/js/basis-transcoder');

import DomQuadManager from './DomQuads/DomQuadManager.js';
import Background from './background/Background.js';
import Particles from './particles/Particles.js';
import PostProcessing from './post/PostProcessing.js';

import {GLOBALS} from '$lib/_globals.js';

export default class WebGLContext {

    constructor({el}) {

        this.renderer = new Renderer({
            canvas: el,
            width: el.clientWidth,
            height: el.clientHeight,
            dpr: GLOBALS.MOBILE ? window.devicePixelRatio : Math.min(window.devicePixelRatio, 1.5),
            antialias: false,
            alpha: false,
            premultipliedAlpha: false,
            powerPreference: 'high-performance'
        });

        this.gl = this.renderer.gl;
        this.gl.clearColor(0.0,0.0,0.0,1.0);
        this.previousSize = new Vec2(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);

        this.gl.basisLoader = new BasisTextureLoader(this.gl);

        this.camera = new Camera(this.gl, {
            fov: 45,
            aspect: this.gl.canvas.clientWidth/this.gl.canvas.clientHeight
        });
        this.camera.position.set(0,0,1);

        this.scene = new Transform();

        this.initMapTransform();
        this.initParticles();
        this.initDomQuadManager();
        this.initPostPass();

    }

    initMapTransform() {

        this.mapTransform = {
            currentPosition: new Vec2(0, 0),
            prevPosition: new Vec2(0, 0),
            delta: new Vec2(0,0),
            offset: new Vec2(0.0, 0.0),
            scale: 1.0,
            firstTick: true,
            update: ({x, y, scale}) => {

                if(this.mapTransform.firstTick) {
                    this.mapTransform.prevPosition.set(x, y);
                    this.mapTransform.currentPosition.set(x, y);
                    this.mapTransform.firstTick = false;
                }

                this.mapTransform.currentPosition.set(x, y);

                this.mapTransform.delta.x = (this.mapTransform.currentPosition.x - this.mapTransform.prevPosition.x);
                this.mapTransform.delta.y = (this.mapTransform.currentPosition.y - this.mapTransform.prevPosition.y);

                this.mapTransform.offset.x += this.mapTransform.delta.x;
                this.mapTransform.offset.y += this.mapTransform.delta.y;

                this.mapTransform.prevPosition.copy(this.mapTransform.currentPosition);

            },

            resetOffset: () =>  {

                this.mapTransform.offset.x = 0.0;
                this.mapTransform.offset.y = 0.0;

            }

        }

    }

    initBackground({circleAnchorPoints}) {

        this.background = new Background(this.gl, {camera: this.camera, circleAnchorPoints});
        this.background.setParent(this.scene);
    }

    initParticles() {

        this.particles = new Particles(this.gl, {count: 300});
        this.particles.setParent(this.scene);

    }

    initDomQuadManager() {

        this.domQuadManager = new DomQuadManager(this.gl, {
            camera: this.camera
        });

        this.domQuadManager.setParent(this.scene);

    }

    initPostPass() {

        this.basePass = new RenderTarget(this.gl, {
            width: this.gl.canvas.clientWidth,
            height: this.gl.canvas.clientHeight,
        });

        this.post = new PostProcessing(this.gl);

    }

    renderWBlur({time, phase}) {

        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
            target: this.basePass,
        });

        this.post.render({scene: this.basePass, time, phase});

    }

    render() {

        this.renderer.render({scene: this.scene, camera: this.camera})

    }

    update({time, deltaTime, mapTransform, imageElements}) {

        const {x, y, scale} = mapTransform;

        this.mapTransform.update({x, y, scale});

        if(this.background)this.background.update({time, mapTransform, inputDelta: this.mapTransform.delta});

        this.particles.update({time, mapTransform: this.mapTransform});

        this.domQuadManager.update({time, mapTransform, delta: this.mapTransform.delta, imageElements});

    }

    onResize({width, height}) {

        this.renderer.setSize(width, height);
        this.camera.perspective({aspect: this.gl.canvas.clientWidth / this.gl.canvas.clientHeight});
        this.background.onResize({width, height});
        this.domQuadManager.onResize();
        this.post.onResize({width, height});

    }

}
