<script lang="ts" setup>

import { defineProps } from 'vue';


let props = defineProps(["relation", "following"]);


</script>

<template>
    <!-- Has person's profile picture, and their name -->
    <p v-if="following">{{ props.relation.target }}</p>
    <p v-else="following">{{ props.relation.viewer }}</p>
</template>




<style scoped>

</style>