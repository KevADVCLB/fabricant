const RenderUtils = {

    /**
     *
     * @param handleDraw : function
     * @param frameRate : Number
     * @return {*}
     * @constructor
     */
    CreateLoop: (handleDraw, frameRate) => {

        let frame;
        const targetFrameRate = frameRate || 60;
        let lastFrameTime = 0;

        const draw = () => {
            var time = window.performance.now();
            const time_since_last = time - lastFrameTime;
            const target_time_between_frames = 1000 / targetFrameRate;

            const epsilon = 5;
            if (
                time_since_last >= target_time_between_frames - epsilon
            ) {
                const deltaTime = (time - lastFrameTime) * 0.001;
                handleDraw({time, deltaTime});
                lastFrameTime = time;
            }

            frame = window.requestAnimationFrame(draw);
        }

        draw();

        return frame;

    }
};
export default RenderUtils;