<script lang="ts" setup>

import SidebarComponent from "@/components/People/SidebarComponent.vue"
import FollowRelationListComponent from "@/components/People/FollowRelationListComponent.vue";
import SearchPeopleComponent from "@/components/People/SearchPeopleComponent.vue";
import RequestListComponent from "@/components/People/RequestListComponent.vue";

import { MenuOption } from "@/components/People/SidebarComponent.vue"

import { ref } from "vue";

// need to remember current option to display
let selectedOption = ref<MenuOption>({name:"Following"});

const handleMenuOption = (option: MenuOption) => {
    selectedOption.value = option;
}


</script>


<template>
    <div class="people-view">
        <nav>
            <h1>People</h1>
            <SidebarComponent @set-menu-option="handleMenuOption"/>
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