import { fetchy } from "@/utils/fetchy";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";

const features = [
    "People",
    "Feed",
    "Home",
]

export const useScreenTimeStore = defineStore(
    "screenTime", 
    () => {
        // map each feature we're tracking to the timeUsed for that day,
        // since the last update to the doc
        const screenTimeData = ref<Record<string, number>>({});
        const currentScreenTimeData = ref<Record<string, number>>({
            "People": 0, 
            "Feed": 0,
            "Home": 0
        });
        
        /*
            Periodically update the current data store
        */
        const updateCurrentScreenTimeData = (username: string, feature: string, time: number) => {
            currentScreenTimeData.value[feature] += time
        } 

        // get today's screentime data for certain feature
        const requestScreenTimeData = async (username: string, feature: string) => {
            const date = new Date();
            const [day, month, year] = [
                date.getDate().toString(), 
                (date.getMonth()+1).toString(), 
                date.getFullYear().toString()
            ];

            const res = await fetchy("/api/screenTime/" + username + "/" + feature, "GET", {
                query: {day, month, year}
            });

            screenTimeData.value[feature] = res.time
            currentScreenTimeData.value[feature] = 0
        }

        /*
            Push current accumulated store data to the backend. Reset accumulated store data.
            Doesn't work at midnight, maybe fix later...
        */
        const updateScreenTimeData = async (username: string) => {
            const date = new Date();
            const [day, month, year] = [
                date.getDate().toString(), 
                (date.getMonth()+1).toString(), 
                date.getFullYear().toString()
            ];

            // update all features
            for (const feature of features) {
                const newTimeUsed = screenTimeData.value[feature] + currentScreenTimeData.value[feature];

                await fetchy("/api/screenTime/" + username + "/" + feature, "POST", {
                    query: {day, month, year, time: newTimeUsed.toString()}
                });

                // get new screentime data
                await requestScreenTimeData(username, feature);
            }
        }

        return {
            currentScreenTimeData,
            updateCurrentScreenTimeData,
            requestScreenTimeData,
            updateScreenTimeData,

        };
    },
    { persist: true }
);