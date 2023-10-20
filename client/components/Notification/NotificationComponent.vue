<script setup lang="ts">

const props = defineProps(['notification']);
//const emit = defineEmits(['refreshNotifications'])


</script>


<template>
    <article>
        <p>{{ notification.message }}</p>
    </article>


</template>

<style>


</style>