<script setup lang="ts">

import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { useScreenTimeStore } from "@/stores/screentime";
import { storeToRefs } from "pinia";
import { onUnmounted, onMounted, toRefs, onBeforeMount } from "vue";
import { fetchy } from "@/utils/fetchy"

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
    await timeStore.updateCurrentScreenTimeData(username, feature, currentScreenTimeData.value[feature] + 60000)
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

onMounted(async () => {
  await initializeScreenTimeTracking(currentUsername.value, "Home");
});

onUnmounted( async () => {
  await endScreenTimeTracking(currentUsername.value);
});


</script>

<template>
  <main>
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
