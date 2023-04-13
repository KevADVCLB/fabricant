
export const TimeUtils = {
    sleep: async (fn, ...args) => {
        await TimeUtils.timeout(3000);
        return fn(...args);
    },
    timeout : (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}