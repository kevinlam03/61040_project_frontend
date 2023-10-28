<script setup lang="ts">

import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { useScreenTimeStore } from "@/stores/screentime";
import { storeToRefs } from "pinia";
import { initializeScreenTimeTracking, endScreenTimeTracking } from "@/utils/timeTrack";
import { onUnmounted, onMounted } from "vue";

console.log(useScreenTimeStore().currentScreenTimeData);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
//const { currentScreenTimeData } = storeToRefs(useScreenTimeStore());



onMounted(async () => {
  //await initializeScreenTimeTracking("Home");
});

onUnmounted( async () => {
  //await endScreenTimeTracking();
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
