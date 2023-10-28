<script lang="ts" setup>

import { onBeforeMount, ref } from "vue"
import { fetchy } from "@/utils/fetchy";


const pendingSentRequests = ref<Array<Record<string, string>>>([]);
const pendingReceivedRequests = ref<Array<Record<string, string>>>([]);
const monitoringList = ref<Array<Record<string, string>>>([]);
const monitoredList = ref<Array<Record<string, string>>>([]);

const formInput = ref("");

const stopMonitoring = async (target: string) => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/monitoring/" + target, 'DELETE')
    } catch(_) {
        return;
    }
    await getMonitoringRelations();
}

const removeMonitor = async (target: string) => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/monitors/" + target, 'DELETE')
    } catch(_) {
        return;
    }
    await getMonitoredRelations();
}

const getMonitoringRelations = async () => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/monitoring", 'GET')
    } catch(_) {
        return;
    }
    monitoringList.value = res
}

const getMonitoredRelations = async () => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/monitored", 'GET')
    } catch(_) {
        return;
    }
    monitoredList.value = res
}

const getPendingReceivedRequests = async () => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/requests/received/pending", 'GET')
    } catch(_) {
        return;
    }
    pendingReceivedRequests.value = res
}

const removeFollowRequest = async (to: string) => {
    try {
        await fetchy("api/monitorRelations/requests/" + to, "DELETE")
    } catch (_) {
        return;
    }
    // remove, then update requests again
    await getPendingSentRequests();
}

const getPendingSentRequests = async () => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/requests/sent/pending", 'GET')
    } catch(_) {
        return;
    }
    pendingSentRequests.value = res
}

const acceptMonitorRequest = async (from: string) => {
    try {
        await fetchy("/api/monitorRelations/requests/accept/" + from, 'PUT')
    } catch(_) {
        return;
    }
    // once you accept a request, update received requests
    await getPendingReceivedRequests();
    await getMonitoringRelations();
}

const rejectMonitorRequest = async (from: string) => {
    try {
        await fetchy("/api/monitorRelations/requests/reject/" + from, 'PUT')
    } catch(_) {
        return;
    }
    // once you reject a request, update received requests
    await getPendingReceivedRequests();
}

const sendMonitorRequest = async (to: string) => {
    try {
        await fetchy("api/monitorRelations/requests/" + to, "POST")
    } catch (_) {
        return;
    }
    await getPendingSentRequests();
}

onBeforeMount(async () => {
    await getPendingReceivedRequests();
    await getPendingSentRequests();
    await getMonitoredRelations();
    await getMonitoringRelations();
})
</script>
    
<template>
    <!--
        Add buttons to remove requests, accept/decline requests, and then make it reactive.
        First need to add requesting functionality though. 
    -->
    <section>
        <form @submit.prevent="sendMonitorRequest(formInput)">
            <legend>Share ScreenTime Data</legend>
            <input v-model="formInput" placeholder="Username">
            <button type="submit">Send</button>
        </form>
    </section>

    <section>
        <h2>Sent</h2>
        <article v-for="request in pendingSentRequests">
            <p>You've shared to {{ request.to }}! Awaiting their response.</p>
            <button @click="removeFollowRequest(request.to)">
                Remove Request
            </button>

        </article>
    </section>

    <section>
        <h2>Received</h2>
        <article v-for="request in pendingReceivedRequests">
            <p>{{ request.from }} wants to share their ScreenTime data with you!</p>
            <button @click="acceptMonitorRequest(request.from)">
                Accept
            </button>
            <button @click="rejectMonitorRequest(request.from)">
                Reject
            </button>
        </article>
    </section>

    <section>
        <h2>Monitoring</h2>
        <article v-for="relation in monitoringList">
            <p>You are currently able to view {{ relation.target }}'s ScreenTime data.</p>
            <button @click="stopMonitoring(relation.target)">
                Stop Monitoring
            </button>
        </article>
    </section>

    <section>
        <h2>Monitored By</h2>
        <article v-for="relation in monitoredList">
            <p>You are currently sharing ScreenTime data to {{ relation.viewer }}</p>
            <button @click="removeMonitor(relation.viewer)">
                Revoke ScreenTime Sharing
            </button>
        </article>
    </section>
</template>

<style scoped>

</style>