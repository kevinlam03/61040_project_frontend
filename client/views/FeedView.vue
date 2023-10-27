<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { fetchy } from "@/utils/fetchy";
import PostComponent from "@/components/Post/PostComponent.vue";

const starredFeed = ref<Array<Record<string, string>>>([]);
const notStarredFeed = ref<Array<Record<string, string>>>([]);
const feedOption = ref("starred");

const getStarredFeed = async () => {
    let res;
    try {
        res = await fetchy("/api/feed/starredFeed", 'GET')
    } catch(_) {
        return;
    }
    starredFeed.value = res
    feedOption.value = "starred"
}

const getNotStarredFeed = async () => {
    let res;
    try {
        res = await fetchy("/api/feed/notStarredFeed", 'GET')
    } catch(_) {
        return;
    }
    notStarredFeed.value = res
    feedOption.value = "notStarred"
}

onBeforeMount(async () => {
    await getStarredFeed();
})


</script>

<template>
    <button @click="getStarredFeed()">
        Starred Feed
    </button>
    <button @click="getNotStarredFeed()">
        Not Starred Feed
    </button>

    <main>
        <article v-if="feedOption==='starred'" v-for="post in starredFeed">
            <PostComponent :post="post"/>
        </article>
        <article v-else v-for="post in notStarredFeed">
            <PostComponent :post="post"/>
        </article>
    </main>

</template>

<style scoped>

</style>