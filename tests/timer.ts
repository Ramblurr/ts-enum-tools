
export function Timer() {
  return {
    start: new Date().getTime(),
    elapsed: function () { new Date().getTime() - this.start }
  }
}

