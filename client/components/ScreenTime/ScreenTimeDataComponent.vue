<script setup lang="ts">

import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { convertTime } from "../../utils/convertTime";

const props = defineProps(["username"]);
const screenTimeData = ref<Record<string, number>>({});

const getScreenTimeData = async (username: string) => {
    let res: Record<string, number> = {};

    try {
        for (const feature of ["Home", "Feed", "People"]) {
            const time = await fetchy("/api/screenTime/" + username + "/" + feature, "GET");   
            res[feature] = time
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
                {{ feature }}: {{ convertTime(Number(screenTimeData[feature])).hour }} hr {{ convertTime(Number(screenTimeData[feature])).minute }} m
            </p>
        </section>
    </div>
</template>

<style scoped>

</style>