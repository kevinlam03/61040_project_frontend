<script setup lang="ts">

import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import { endTimeTracking, startTimeTracking } from "../utils/trackTime";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let interval: NodeJS.Timeout;

onMounted(async () => {
  interval = await startTimeTracking(currentUsername.value, "Home");  
});

onUnmounted( async () => {
  await endTimeTracking(interval, currentUsername.value, "Home");
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
