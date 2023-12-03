<script setup lang="ts">

import { fetchy } from "@/utils/fetchy";
import { ref } from 'vue';

import SidebarComponent from '@/components/General/SidebarComponent.vue';
import RequestListComponent from '@/components/ScreenTime/RequestListComponent.vue';
import ScreenTimeDataComponent from '@/components/ScreenTime/ScreenTimeDataComponent.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import RestrictionListComponent from "../components/TimeRestriction/RestrictionListComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());



interface ScreenTimeViewMenuOptions {
    name: "My ScreenTime" | "Others" | "Manage Restrictions" | "Manage ScreenTime Sharing"
}

// need to remember current option to display
let selectedOption = ref<ScreenTimeViewMenuOptions>({name:"My ScreenTime"});

const handleMenuOption = async (option: ScreenTimeViewMenuOptions) => {
    if (option.name==='Others') {
        await getMonitoringList();
    }
    selectedOption.value = option;
    
}

const monitoringList = ref<Array<string>>([]);
const getMonitoringList = async () => {
    let res;
    try {
        res = await fetchy("/api/monitorRelations/monitoring", "GET")
    } catch (error) {
        return;
    }
    const listNames = res.map((relation: any) => { return relation.target })
    monitoringList.value = listNames;
}



</script>

<template>
    <div class="screentime-view">
        <nav>
            <SidebarComponent @set-menu-option="handleMenuOption" :options="[
                {name:'My ScreenTime'}, 
                {name:'Others'}, 
                {name:'Manage Restrictions'},
                {name:'Manage ScreenTime Sharing'},
            ]"
            />
        </nav>
        

        <main>
            <ScreenTimeDataComponent 
            v-if="selectedOption.name==='My ScreenTime'" 
            :username="currentUsername"/>

            <ScreenTimeDataComponent
            v-if="selectedOption.name === 'Others'"
            v-for="user in monitoringList"
            :username="user"
            />

            <RestrictionListComponent
            v-if="selectedOption.name==='Manage Restrictions'"
            />

            <RequestListComponent v-if="selectedOption.name === 'Manage ScreenTime Sharing'"/>
        </main>
    </div>

    

</template>

<style scoped>
    .screentime-view {
        display: flex;
    }

    nav {
        flex: 1;
    }

    main {
        flex: 3;
    }


</style>