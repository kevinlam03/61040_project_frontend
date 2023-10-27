<script lang="ts" setup>

import PostComponent from "@/components/Post/PostComponent.vue"
import { onBeforeMount, ref, watch } from "vue";
import { fetchy } from "@/utils/fetchy";

const props = defineProps(['user', 'userPosts'])

const isFollowing = ref(false);
const isRequestPending = ref(false);
const isStarred = ref(false);


/* 
    Add functionality for following, unfollowing, starring, unstarring here.

*/
const sendFollowRequest = async (to: string) => {
    try {
        await fetchy("api/follow/requests/" + to, "POST")
    } catch (_) {
        return;
    }
    isRequestPending.value = true;
}

const removeFollowRequest = async (to: string) => {
    try {
        await fetchy("api/follow/requests/" + to, "DELETE")
    } catch (_) {
        return;
    }
    isRequestPending.value = false;
}

const unfollow = async (target: string) => {
    try {
        // unfollow automatically unstars
        await fetchy("api/follow/following/" + target, "DELETE")
    } catch (_) {
        return;
    }
    isFollowing.value = false;
    isStarred.value = false;
}

const addStar = async (target: string) => {
    try {
        await fetchy("api/feed/stars/" + target, "POST")
    } catch (_) {
        return;
    }
    isStarred.value = true;
}

const removeStar = async (target: string) => {
    try {
        await fetchy("api/feed/stars/" + target, "DELETE")
    } catch (_) {
        return;
    }
    isStarred.value = false;
}



onBeforeMount(async () => {
    // check if we're already following this person
    // check if we've already starred this person
    // check if request is pending
    try {
        isRequestPending.value = false;
        isStarred.value = await fetchy("api/feed/stars/" + props.user.username, "GET")
        const followingList = await fetchy("api/follow/following", "GET")
        const pendingRequestList = await fetchy("api/follow/requests/sent/pending", 'GET')

        // check if we're following this user
        for (const relation of followingList) {
            if (relation.target === props.user.username) {
                isFollowing.value = true;
            } else {
                isFollowing.value = false;
            }
        }

        // check if we have a pending request to this user
        for (const req of pendingRequestList) {
            if (req.to === props.user.username) {
                isRequestPending.value = true;
            }
        }
    } catch (error) {
        return;
    }
})
</script>


<template>
    <h2>{{ user.username }}</h2>
    <menu>
        <!--
            Can send follow request/unfollow
            Can star/unstar
        -->
        <li v-if="isFollowing">
            <button @click="unfollow(user.username)">Unfollow</button>
        </li>
        <li v-else>
            <button v-if="!isRequestPending" @click="sendFollowRequest(user.username)">Follow</button>
            <button v-else @click="removeFollowRequest(user.username)">Remove Follow Request</button>
        </li>
        
        <li v-if="isStarred && isFollowing">
            <button @click="removeStar(user.username)">Unstar</button>
        </li>
        <li v-if="!isStarred && isFollowing">
            <button @click="addStar(user.username)">Star</button>
        </li>
        
        
    </menu>

    <!--
        Then view all posts down below
    -->
    <section>
        <article v-for="post in userPosts">
            <PostComponent :post="post" :key="post._id"/>
        </article>
    </section>
</template>


<style scoped>

</style>