<script lang="ts" setup>

import { fetchy } from "@/utils/fetchy"
import { onBeforeMount, ref } from "vue"
import FollowRelationComponent from "./FollowRelationComponent.vue";


let props = defineProps(["following"]);

let followingRelations = ref<Array<Record<string, string>>>([]);
let followerRelations = ref<Array<Record<string, string>>>([]);

const stopFollowing = async (target: string) => {
    let res;
    try {
        res = await fetchy("/api/follow/following/" + target, "DELETE")
    } catch (_) {
        return;
    }
    await getFollowingRelations();
}

const removeFollower = async (target: string) => {
    let res;
    try {
        res = await fetchy("/api/follow/followers/" + target, "DELETE")
    } catch (_) {
        return;
    }
    await getFollowerRelations();
}



// get all people we're following
const getFollowingRelations = async () => {
    let result;
    try {
        result = await fetchy("/api/follow/following", "GET")
    } catch(_) {
        return;
    }

    followingRelations.value = result;
}

const getFollowerRelations = async () => {
    let result;
    try {
        result = await fetchy("/api/follow/followers", "GET")
    } catch(_) {
        return;
    }

    followerRelations.value = result;
}



onBeforeMount(async () => {
  await getFollowingRelations();
  await getFollowerRelations();
});

</script>


<template>
    <!--For every follow relation, produce a relationComponent-->
    <section v-if="props.following">
        <h2 v-if="props.following">Following</h2>
        
        <article v-for="relation in followingRelations">
            <FollowRelationComponent 
                @stopFollowing="stopFollowing"
                :following="true" 
                :relation="relation" 
                :key="relation._id"/>
        </article>
    </section>

    <section v-else>
        <h2>Followers</h2>
        
        <article v-for="relation in followerRelations">
            <FollowRelationComponent 
            @stopFollowing="removeFollower"
            :following="false" 
            :relation="relation" 
            :key="relation._id"/>
        </article>
    </section>
    
</template>


<style scoped>


</style>