import { useScreenTimeStore } from "@/stores/screentime";
import { storeToRefs } from "pinia";

const timeStore = useScreenTimeStore();
const { currentScreenTimeData } = storeToRefs(timeStore);
var clearIntervalReference: NodeJS.Timeout;

/*
  Before entering a page, we need to start tracking the screenTime for this feature
*/
export const initializeScreenTimeTracking = async (feature: string) => {
  await timeStore.requestScreenTimeData(feature);

  // save so we can stop updating data when we exit later
  clearIntervalReference = setInterval(async () => {
    await timeStore.updateCurrentScreenTimeData(feature, currentScreenTimeData.value[feature] + 60000)
  });
}


/*
  Before exiting a page, we need to send updates to the api, and stop tracking time
  for this feature.
*/
export const endScreenTimeTracking = async () => {
  clearInterval(clearIntervalReference);
  await timeStore.updateScreenTimeData();
  

}