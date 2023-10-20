<script lang="ts" setup>

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