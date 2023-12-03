<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import router from "../../router";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const emit = defineEmits(["notifyMonitor"]);

const handleRedirect = () => {
    void router.push({ name: "ScreenTime" });
}

const notifyMonitors = async () => {
    try {

    } catch (e) {
        
    }
    emit('notifyMonitor', false);
}
</script>

<template>
  <main>
    <p>
        You've exceeded today's restriction!
    </p>
    <button @click="handleRedirect()">
        Go to ScreenTime
    </button>
    <button @click="notifyMonitors">
        Notify monitors
    </button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
