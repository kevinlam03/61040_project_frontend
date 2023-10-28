<script setup lang="ts">

import { fetchy } from "@/utils/fetchy"
import { onBeforeMount, onMounted, ref } from "vue"

const props = defineProps(["username"])
const screenTimeData = ref<Record<string, number>>({});

const getScreenTimeData = async (username: string) => {
    let res: Record<string, number> = {};
    const date = new Date();
    const [day, month, year] = [
        date.getDate().toString(), 
        (date.getMonth()+1).toString(), 
        date.getFullYear().toString()
    ];

    try {
        for (const feature of ["Home", "Feed", "People"]) {
            const timeObj = await fetchy("/api/screenTime/" + username + "/" + feature, "GET", {
                query: {day, month, year}
            });   
            res[feature] = timeObj.time
        }
    } catch (error) {
        return {"Home": 69, "Feed": 69, "People": 69};
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
                {{ feature }}: {{ screenTimeData[feature] / 60000 }}
            </p>
        </section>
    </div>
</template>

<style scoped>

</style>