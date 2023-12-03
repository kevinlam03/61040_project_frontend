// convert a time in seconds and return an object containing the hours minutes and seconds
export const convertTime = (seconds: number) => {
    var sec = seconds;
    const hr = Math.floor(sec / 3600);
    sec = sec % 3600
    const min = Math.floor(sec / 60);
    sec = sec % 60
    return {
        hour: hr,
        minute: min,
        second: sec,
    }
}