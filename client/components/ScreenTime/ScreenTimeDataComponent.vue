<script setup lang="ts">

import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";


const props = defineProps(["username"]);
const screenTimeData = ref<Record<string, number>>({});
 
const getScreenTimeData = async (username: string) => {
    let res: Record<string, number> = {};

    try {
        for (const feature of ["Home", "Feed", "People"]) {
            const timeObj = await fetchy("/api/screenTime/" + username + "/" + feature, "GET", {
                query: {}
            });   
            res[feature] = timeObj.time
        }
    } catch (error) {
        return {}
    }
    screenTimeData.value = res
}

onBeforeMount(async () => {
    await getScreenTimeData(props.username);
})



</script>

<template>
    <div class="screentime-data">
        <h2> username: {{ username }}</h2>
        <section v-if="username">
            <p v-for="feature in ['Home', 'Feed', 'People']">
                {{ feature }}: {{ Math.floor(screenTimeData[feature] / 60) }} m {{ screenTimeData[feature] % 60 }} s

            </p>
        </section>
    </div>
</template>

<style scoped>

</style>