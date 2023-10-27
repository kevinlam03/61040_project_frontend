<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import UserProfileComponent from "@/components/People/UserProfileComponent.vue"

const username = ref("")
const searchedUser = ref<Record<string, string>>();
const userPosts = ref<Array<Record<string, string>>>([]);

const getUserByUsername = async (username: string) => {
    let res;
    try {
        res = await fetchy("/api/users/" + username, 'GET')
    } catch(_) {
        return;
    }
    searchedUser.value = res
}

async function getPosts(username: string) {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", {query: {author: username}  });
  } catch (_) {
    return;
  }
  userPosts.value = postResults;
}

const handleSearch = async (username: string) => {
    await getUserByUsername(username)
    await getPosts(username);
}


</script>

<template>
  <form @submit.prevent="handleSearch(username)" class="pure-form">
    <fieldset>
      <legend>Search for People</legend>
      <input id="person" type="text" v-model="username" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>

  <main v-if="searchedUser">
    <UserProfileComponent :user="searchedUser" :userPosts="userPosts"/>
  </main>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
