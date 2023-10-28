<script setup lang="ts">

import { fetchy } from "@/utils/fetchy"
import { ref } from "vue"


const screenTimeData = ref<Array<Record<string, string>>>([]);


// need to get data for past week or something?
const getScreenTimeData = async () => {
    let res;
    try {
        res = await fetchy("/api/screenTime", "GET")
    } catch (error) {
        return;
    }
    screenTimeData.value = res;
}

</script>

<template>
    <div class="screentime-data">
        {{ screenTimeData }}
    </div>
</template>

<style scoped>

</style>