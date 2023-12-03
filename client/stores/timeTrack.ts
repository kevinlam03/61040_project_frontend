import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { convertTime } from "../utils/convertTime";


export const useTimeStore = defineStore(
  "time",
  () => {
    const timeUsed = ref<number>(0);
    const restriction = ref(0);
    const hrRestriction = computed(() => convertTime(restriction.value).hour)
    const minRestriction = computed(() => convertTime(restriction.value).minute)

    const resetStore = () => {
      //currentUsername.value = "";
    };

    const getScreenTimeData = async (username: string, feature: string) => {
        let res;
        try {
          res = await fetchy(`/api/screenTime/${username}/${feature}`, 'GET');
        } catch {
          return;
        }
        return res;
      }

      const getFeatureRestriction = async (feature: string) => {
        let res;
        try {
          res = await fetchy(`/api/restrictions/time/${feature}`, 'GET');
      
          if (res.res === null) {
            return 86400;
          }
        } catch (e) {
          console.log(e);
        }
        return res.res.limit;
      }

      const startTimeTracking = async (username: string, feature: string) => {
        timeUsed.value = await getScreenTimeData(username, feature);
        restriction.value = (await getFeatureRestriction(feature));
      
        console.log(timeUsed.value + " " + JSON.stringify(restriction.value))
      
        const secondsDelay = 1
      
        return setInterval(() => {
          //console.log("Elapsed: " + timeUsed.value)
          timeUsed.value += secondsDelay
        }, secondsDelay * 1000);
      }

      const endTimeTracking = async (interval: any, username: string, feature: string) => {
        clearInterval(interval);
      
        try {
          console.log("Attempt to update screentime: " + timeUsed.value)
          await fetchy(`/api/screenTime/${username}/${feature}`, 'POST', { body: { time: timeUsed.value}});
        }
        catch {
          return;
        }
      }

    return {
      timeUsed,
      restriction,
      hrRestriction,
      minRestriction,
      getScreenTimeData,
      getFeatureRestriction,
      startTimeTracking,
      endTimeTracking,
    };
  },
  { persist: true },
);
