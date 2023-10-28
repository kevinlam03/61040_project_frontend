<script lang="ts" setup>

import { onBeforeMount, ref } from "vue"


let props = defineProps(["options"])
let emit = defineEmits(["set-menu-option"])


onBeforeMount(() => {
    
})
</script>


<template>
    <nav>
        <ul>
            <li v-for="option in options">
                <button @click="$emit('set-menu-option', {name:option.name})">
                    {{ option.name }}
                </button>
            </li>

            <!--
                <li>
                <button @click="$emit('set-menu-option', {name:'Following'})">Following</button>
            </li>
            <li>
                <button @click="$emit('set-menu-option', {name:'Followers'})">Followers</button>
            </li>
            <li>
                <button @click="$emit('set-menu-option', {name:'Requests'})">Requests</button>
            </li>
            <li>
                <button @click="$emit('set-menu-option', {name:'Search'})">Search</button>
            </li>    
            -->
                    
        </ul>
    </nav>
    
</template>


<style scoped>


</style>