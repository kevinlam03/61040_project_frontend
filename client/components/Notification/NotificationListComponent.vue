<script lang="ts" setup>

import NotificationComponent from "@/components/Notification/NotificationComponent.vue"
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue"

let notifications = ref<Array<Record<string, string>>>([]);
let loaded = ref(false);
// Get notifications for this user
async function getNotifications() {
  let notificationResults;
  try {
    notificationResults = await fetchy("/api/notifications", "GET", { });
  } catch (_) {
    return;
  }
  notifications.value = notificationResults;
}


onBeforeMount(async () => {
  await getNotifications();
  loaded.value = true;
});

</script>

<template>

<section class="notifications" v-if="loaded && notifications.length !== 0">
    <article v-for="noti in notifications" :key="noti._id">
      <NotificationComponent :notification="noti" @refreshNotifications="getNotifications" />
    </article>
  </section>

</template>