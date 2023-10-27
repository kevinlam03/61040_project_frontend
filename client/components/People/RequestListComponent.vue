<script lang="ts" setup>

import { onBeforeMount, ref } from "vue"
import { fetchy } from "@/utils/fetchy";


const pendingSentRequests = ref<Array<Record<string, string>>>([]);
const pendingReceivedRequests = ref<Array<Record<string, string>>>([]);


const getPendingReceivedRequests = async () => {
    let res;
    try {
        res = await fetchy("/api/follow/requests/received/pending", 'GET')
    } catch(_) {
        return;
    }
    pendingReceivedRequests.value = res
    console.log(res);
}

const removeFollowRequest = async (to: string) => {
    try {
        await fetchy("api/follow/requests/" + to, "DELETE")
    } catch (_) {
        return;
    }
    // remove, then update requests again
    await getPendingSentRequests();
}

const getPendingSentRequests = async () => {
    let res;
    try {
        res = await fetchy("/api/follow/requests/sent/pending", 'GET')
    } catch(_) {
        return;
    }
    pendingSentRequests.value = res
    console.log(res);
}

const acceptFollowRequest = async (from: string) => {
    try {
        await fetchy("/api/follow/accept/" + from, 'PUT')
    } catch(_) {
        return;
    }
    // once you accept a request, update received requests
    await getPendingReceivedRequests();
}

const rejectFollowRequest = async (from: string) => {
    try {
        await fetchy("/api/follow/reject/" + from, 'PUT')
    } catch(_) {
        return;
    }
    // once you reject a request, update received requests
    await getPendingReceivedRequests();
}

onBeforeMount(async () => {
    await getPendingReceivedRequests()
    await getPendingSentRequests();
})
</script>
    
<template>
    <!--
        Add buttons to remove requests, accept/decline requests, and then make it reactive.
        First need to add requesting functionality though. 
    -->
    <section>
        <h2>Sent</h2>
        <article v-for="request in pendingSentRequests">
            <p>You sent a request to {{ request.to }}!</p>
            <button @click="removeFollowRequest(request.to)">
                Remove Request
            </button>

        </article>
    </section>

    <section>
        <h2>Received</h2>
        <article v-for="request in pendingReceivedRequests">
            <p>{{ request.from }} wants to follow you!</p>
            <button @click="acceptFollowRequest(request.from)">
                Accept
            </button>
            <button @click="rejectFollowRequest(request.from)">
                Reject
            </button>
        </article>
    </section>
</template>

<style scoped>

</style>