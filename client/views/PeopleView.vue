<script lang="ts" setup>

import SidebarComponent from "@/components/General/SidebarComponent.vue";
import FollowRelationListComponent from "@/components/People/FollowRelationListComponent.vue";
import RequestListComponent from "@/components/People/RequestListComponent.vue";
import SearchPeopleComponent from "@/components/People/SearchPeopleComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";
import { useTimeStore } from "../stores/timeTrack";

interface PeopleViewMenuOptions {
    name: "Following" | "Followers" | "Requests" | "Search"
}

// need to remember current option to display
let selectedOption = ref<PeopleViewMenuOptions>({name:"Following"});

const handleMenuOption = (option: PeopleViewMenuOptions) => {
    selectedOption.value = option;
}

const { startTimeTracking, endTimeTracking } = useTimeStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
var interval: NodeJS.Timeout;



onMounted(async () => {
    try {
        interval = await startTimeTracking(currentUsername.value, "People")
    } catch (e) {
        console.log(e)
    }
});

onUnmounted( async () => {
    try {
        await endTimeTracking(interval, currentUsername.value, "People")
    } catch (e) {
        console.log(e)
    }
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