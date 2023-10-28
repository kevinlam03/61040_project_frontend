<script lang="ts" setup>

import SidebarComponent from "@/components/General/SidebarComponent.vue"
import FollowRelationListComponent from "@/components/People/FollowRelationListComponent.vue";
import SearchPeopleComponent from "@/components/People/SearchPeopleComponent.vue";
import RequestListComponent from "@/components/People/RequestListComponent.vue";


import { ref } from "vue";
import { useScreenTimeStore } from "@/stores/screentime";
import { useUserStore } from "@/stores/user";
import { onUnmounted, onMounted } from "vue";
import { storeToRefs } from "pinia";

interface PeopleViewMenuOptions {
    name: "Following" | "Followers" | "Requests" | "Search"
}

// need to remember current option to display
let selectedOption = ref<PeopleViewMenuOptions>({name:"Following"});

const handleMenuOption = (option: PeopleViewMenuOptions) => {
    selectedOption.value = option;
}


const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { currentScreenTimeData } = storeToRefs(useScreenTimeStore());
const timeStore = useScreenTimeStore();
var clearIntervalReference: NodeJS.Timeout;

/*
  Before entering a page, we need to start tracking the screenTime for this feature
*/
const initializeScreenTimeTracking = async (username: string, feature: string) => {
    await timeStore.requestScreenTimeData(username, feature);

    // save so we can stop updating data when we exit later
    clearIntervalReference = setInterval(async () => {
        await timeStore.updateCurrentScreenTimeData(username, feature, currentScreenTimeData.value[feature] + 60000)
    }, 20000);
}

/*
  Before exiting a page, we need to send updates to the api, and stop tracking time
  for this feature.
*/
const endScreenTimeTracking = async (username: string) => {
    clearInterval(clearIntervalReference);
    await timeStore.updateScreenTimeData(username);
}

onMounted(async () => {
    await initializeScreenTimeTracking(currentUsername.value, "Feed");
});

onUnmounted( async () => {
    await endScreenTimeTracking(currentUsername.value);
});

</script>


<template>
    <div class="people-view">
        <nav>
            <h1>People</h1>
            <SidebarComponent @set-menu-option="handleMenuOption" :options="[
                {name:'Following'}, {name:'Followers'}, {name:'Requests'}, {name:'Search'}
            ]"/>
        </nav>
        
        <!---
            After sidebar, we need a frame to display information depending on the element selected
        -->
        <main>
            <FollowRelationListComponent v-if="selectedOption.name === 'Following'" v-bind:following="true"/>
            <FollowRelationListComponent v-if="selectedOption.name === 'Followers'" v-bind:following="false"/>
            <RequestListComponent v-if="selectedOption.name === 'Requests'"/>
            <!--
                Once you search for someone, you see a banner for their profile. Clicking it 
                should take you to their actual profile. 
            -->
            <SearchPeopleComponent v-if="selectedOption.name === 'Search'"/>
        </main>
    </div>
    
</template>


<style scoped>
    .people-view {
        display: flex;
    }

    nav {
        flex: 1;
    }

    main {
        flex: 3;
    }

</style>