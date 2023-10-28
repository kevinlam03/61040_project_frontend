<script setup lang="ts">

import { ref } from 'vue';

import SidebarComponent from '@/components/General/SidebarComponent.vue';
import ScreenTimeDataComponent from '@/components/ScreenTime/ScreenTimeDataComponent.vue';

interface ScreenTimeViewMenuOptions {
    name: "My ScreenTime" | "Others" | "Manage Restrictions"
}

// need to remember current option to display
let selectedOption = ref<ScreenTimeViewMenuOptions>({name:"My ScreenTime"});

const handleMenuOption = (option: ScreenTimeViewMenuOptions) => {
    selectedOption.value = option;
}


</script>

<template>
    <div class="screentime-view">
        <nav>
            <SidebarComponent @set-menu-option="handleMenuOption" :options="[
                {name:'My ScreenTime'}, {name:'Others'}, {name:'Manage Restrictions'}]"
            />
        </nav>
        

        <main>
            <ScreenTimeDataComponent v-if="selectedOption.name==='My ScreenTime'"/>
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