function Timer() {
    return {
        start: new Date().getTime(),
        elapsed: function () { new Date().getTime() - this.start; }
    };
}
exports.Timer = Timer;
