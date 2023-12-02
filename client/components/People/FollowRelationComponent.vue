<script lang="ts" setup>

import { fetchy } from '@/utils/fetchy';
import { defineProps } from 'vue';


let props = defineProps(["relation", "following"]);
let emit = defineEmits(["stopFollowing", "removeFollower"])


</script>

<template>
    <section v-if="following">
        <p>{{ relation.target }}</p>
        <button @click="emit('stopFollowing', relation.target)">Stop Following</button>
    </section>

    <section v-else>
        <p v-if="!following">{{ relation.viewer }}</p>
        <button @click="emit('removeFollower', relation.target)">Remove Follower</button>
    </section>
</template>




<style scoped>

</style>