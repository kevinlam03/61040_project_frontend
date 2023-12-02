import { fetchy } from "./fetchy";

// tracking timeUsed for this feature
var timeUsed = 0;

export const getTimeUsed = () => {
    return timeUsed;
}

export const getScreenTimeData = async (username: string, feature: string) => {
    let res;
    try {
      res = await fetchy(`api/screenTime/${username}/${feature}`, 'GET');
    } catch {
      return;
    }
    return res;
}

/* 
Start a timer and add to it on delay.
Returns an object that can be used to stop the execution of the callback.
*/
export const startTimeTracking = async (username: string, feature: string) => {
    timeUsed = await getScreenTimeData(username, feature);

    const secondsDelay = 1
    return setInterval(() => {
        timeUsed += secondsDelay
    }, secondsDelay * 1000);
}

/*
Uses the argument to stop execution of the callback, update the database screenTime
*/
export const endTimeTracking = async (interval: any, username: string, feature: string) => {
    clearInterval(interval);

    try {
        await fetchy(`api/screenTime/${username}/${feature}`, 'POST');
    }
    catch {
        return;
    }
}



