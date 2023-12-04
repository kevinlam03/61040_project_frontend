<script setup lang="ts">

import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import RestrictionMessageComponent from "../components/TimeRestriction/RestrictionMessageComponent.vue";
import { useTimeStore } from "../stores/timeTrack";

const { startTimeTracking, endTimeTracking, resetStore } = useTimeStore();
const { timeUsed, restriction } = storeToRefs(useTimeStore());

const showPopup = computed(() => timeUsed.value >= restriction.value);
const closedPopup = ref(false);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

let interval: NodeJS.Timeout;

const changeWarning = (value: boolean) => {
  closedPopup.value = true;
}

onBeforeMount(async () => {
  try {
    interval = await startTimeTracking(currentUsername.value, "Home"); 
    console.log("After mount: Time: " + timeUsed.value + "Restrict: " + restriction.value)
  } catch (e) {
    console.log(e);
  }
  
});

onBeforeUnmount( async () => {
  try {
    await endTimeTracking(interval, currentUsername.value, "Home");
  } catch (e) {
    console.log(e);
  }
  
});


</script>

<template>
  <RestrictionMessageComponent v-if="showPopup && !closedPopup" @notify-monitor="changeWarning"/>
  <main v-else>
    <h1>Home Page</h1>
    <!--
      <p>{{ currentScreenTimeData["Home"] }}</p>
    -->
    
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
