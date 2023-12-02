// convert a time in milliseconds and return an object containing the hours minutes and seconds
export const convertTime = (seconds: number) => {
    return {
        hour: seconds / 3600,
        minute: (seconds % 3600) / 60,
        second: ((seconds % 3600) % 60),
    }
}