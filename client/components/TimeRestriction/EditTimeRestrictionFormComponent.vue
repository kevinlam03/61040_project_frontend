<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["restrictions", "feature"]);
const emit = defineEmits(["editRestriction", "refreshRestrictions"]);

const hourSelectionList = [0,1,2,3,4,5,6,7,8,9,10,11,12];
const minuteSelectionList: number[] = [];

const hourSelection = ref(0);
const minuteSelection = ref(0);
const timeRestriction = ref(0);

for(var min = 0; min <= 60; min++ ) {
    minuteSelectionList.push(min);
}

const getTimeRestriction = async () => {
  let res;
  try {
    res = await fetchy(`api/restriction/`, 'GET', { query: { feature: props.feature}})
  } catch {

  }
  timeRestriction.value = res;
}

const editTimeRestriction = async () => {
  const totalSeconds = hourSelection.value * 3600 + minuteSelection.value * 60;

  try {
    await fetchy(`/api/restrictions/${props.feature}`, "PUT", { body: totalSeconds });
  } catch (e) {
    return;
  }
  emit("editRestriction");
  emit("refreshRestrictions");
};

onBeforeMount(async () => {
  await getTimeRestriction();
});

</script>

<template>
  <form @submit.prevent="editTimeRestriction()">
    Set Restriction for {{ props.feature }}:

    <label for="hour">Hours</label>
    <select name="">
      <option id="hour" v-for="hour in hourSelectionList" :value="hour">
        {{ hour }}
      </option>
    </select>

    <label for="minute">Minutes</label>
    <select>
      <option id="minute" v-for="minute in minuteSelectionList" :value="minute">
        {{ minute }}
      </option>
    </select>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
