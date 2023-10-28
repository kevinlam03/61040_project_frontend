<script setup lang="ts">
import { ref, onBeforeMount, onUnmounted, onMounted } from "vue"
import { fetchy } from "@/utils/fetchy";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { useScreenTimeStore } from "@/stores/screentime";
import { storeToRefs } from "pinia";

const starredFeed = ref<Array<Record<string, string>>>([]);
const notStarredFeed = ref<Array<Record<string, string>>>([]);
const feedOption = ref("starred");

const getStarredFeed = async () => {
    let res;
    try {
        res = await fetchy("/api/feed/starredFeed", 'GET')
    } catch(_) {
        return;
    }
    starredFeed.value = res
    feedOption.value = "starred"
}

const getNotStarredFeed = async () => {
    let res;
    try {
        res = await fetchy("/api/feed/notStarredFeed", 'GET')
    } catch(_) {
        return;
    }
    notStarredFeed.value = res
    feedOption.value = "notStarred"
}


const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { currentScreenTimeData } = storeToRefs(useScreenTimeStore());
const timeStore = useScreenTimeStore();
var clearIntervalReference: NodeJS.Timeout;

/*
  Before entering a page, we need to start tracking the screenTime for this feature
*/
const initializeScreenTimeTracking = async (username: string, feature: string) => {
    await timeStore.requestScreenTimeData(username, feature);

    // save so we can stop updating data when we exit later
    clearIntervalReference = setInterval(async () => {
        await timeStore.updateCurrentScreenTimeData(username, feature, currentScreenTimeData.value[feature] + 20000)
    }, 20000);
}

/*
  Before exiting a page, we need to send updates to the api, and stop tracking time
  for this feature.
*/
const endScreenTimeTracking = async (username: string) => {
    clearInterval(clearIntervalReference);
    await timeStore.updateScreenTimeData(username);
}


onBeforeMount(async () => {
    await getStarredFeed();
})

onMounted(async () => {
    await initializeScreenTimeTracking(currentUsername.value, "Feed");
});

onUnmounted( async () => {
    await endScreenTimeTracking(currentUsername.value);
});









</script>

<template>
    <button @click="getStarredFeed()">
        Starred Feed
    </button>
    <button @click="getNotStarredFeed()">
        Not Starred Feed
    </button>

    <main>
        <article v-if="feedOption==='starred'" v-for="post in starredFeed">
            <PostComponent :post="post"/>
        </article>
        <article v-else v-for="post in notStarredFeed">
            <PostComponent :post="post"/>
        </article>
    </main>

</template>

<style scoped>

</style>