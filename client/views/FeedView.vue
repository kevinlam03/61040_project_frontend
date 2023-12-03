<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import RestrictionMessageComponent from "@/components/TimeRestriction/RestrictionMessageComponent.vue";
import { useTimeStore } from "@/stores/timeTrack";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
const { startTimeTracking, endTimeTracking } = useTimeStore();
const { timeUsed, restriction } = storeToRefs(useTimeStore());

const showPopup = computed(() => timeUsed.value >= restriction.value);
const closedPopup = ref(false);

const starredFeed = ref<Array<Record<string, string>>>([]);
const notStarredFeed = ref<Array<Record<string, string>>>([]);
const feedOption = ref("starred");

const changeWarning = (value: boolean) => {
  closedPopup.value = value
}

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
var interval: NodeJS.Timeout;



onBeforeMount(async () => {
    await getStarredFeed();
    try {
        interval = await startTimeTracking(currentUsername.value, "Feed"); 
        console.log("After mount: Time: " + timeUsed.value + "Restrict: " + restriction.value)
  } catch (e) {
        console.log(e);
  }
})

onBeforeUnmount( async () => {
    try {
        await endTimeTracking(interval, currentUsername.value, "Feed")
    } catch (e) {
        console.log(e)
    }
});



</script>

<template>
    <RestrictionMessageComponent v-if="showPopup && !closedPopup" @notify-monitor="changeWarning"/>
    <div v-else>
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
    </div>
    

</template>

<style scoped>

</style>