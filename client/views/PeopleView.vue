<script lang="ts" setup>

import SidebarComponent from "@/components/General/SidebarComponent.vue";
import FollowRelationListComponent from "@/components/People/FollowRelationListComponent.vue";
import RequestListComponent from "@/components/People/RequestListComponent.vue";
import SearchPeopleComponent from "@/components/People/SearchPeopleComponent.vue";
import RestrictionMessageComponent from "@/components/TimeRestriction/RestrictionMessageComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useTimeStore } from "../stores/timeTrack";

interface PeopleViewMenuOptions {
    name: "Following" | "Followers" | "Requests" | "Search"
}

const { startTimeTracking, endTimeTracking } = useTimeStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { timeUsed, restriction } = storeToRefs(useTimeStore());

const showWarning = ref(true);
var interval: NodeJS.Timeout;

// need to remember current option to display
let selectedOption = ref<PeopleViewMenuOptions>({name:"Following"});

const changeWarning = (value: boolean) => {
  showWarning.value = value
}

const handleMenuOption = (option: PeopleViewMenuOptions) => {
    selectedOption.value = option;
}

onBeforeMount(async () => {
    try {
        interval = await startTimeTracking(currentUsername.value, "People"); 
        showWarning.value = timeUsed.value >= restriction.value 
        console.log("After mount: Time: " + timeUsed.value + "Restrict: " + restriction.value)
  } catch (e) {
        console.log(e);
  }
});

onBeforeUnmount( async () => {
    try {
        await endTimeTracking(interval, currentUsername.value, "People")
    } catch (e) {
        console.log(e)
    }
});

</script>


<template>
    <RestrictionMessageComponent v-if="showWarning" @notify-monitor="changeWarning"/>
    <div class="people-view" v-else>
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