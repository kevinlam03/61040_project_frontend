<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import EditTimeRestrictionFormComponent from "./EditTimeRestrictionFormComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const features = ["Home", "Feed", "People"];
</script>

<template>
  <main>
    <h1>Restrictions</h1>

    <EditTimeRestrictionFormComponent v-for="feature in features" :feature="feature"/>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
