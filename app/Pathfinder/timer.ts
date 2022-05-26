/**
 * Timer builder utility
 * @returns Timer
 */
export default function () {
  const start = Date.now()
  let time: number | null = null

  function stop() {
    time = Date.now() - start
  }
  function getTime() {
    if (time === null) {
      stop()
    }
    return time as number
  }

  return {
    stop,
    getTime,
  }
}
