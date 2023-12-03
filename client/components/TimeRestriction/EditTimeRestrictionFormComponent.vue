<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { convertTime } from "../../utils/convertTime";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["feature"]);
const emit = defineEmits(["editRestriction", "refreshRestrictions"]);

const hourSelectionList = [0,1,2,3,4,5,6,7,8,9,10,11,12];
const minuteSelectionList: number[] = [];

const hourSelection = ref(0);
const minuteSelection = ref(0);
const timeRestriction = ref(86400);

const hrRestriction = computed(() => convertTime(timeRestriction.value).hour)
const minRestriction = computed(() => convertTime(timeRestriction.value).minute)

for(var min = 0; min <= 60; min++ ) {
    minuteSelectionList.push(min);
}


const getTimeRestriction = async () => {
  let res;
  try {
    res = await fetchy(`/api/restrictions/time/${props.feature}`, 'GET')
    
    if (res === null) {
      timeRestriction.value = 86400
    } else {
      timeRestriction.value = res.limit;
    }

  } catch (error: any) {
    console.log(error)
  }
  
}

const addTimeRestriction = async () => {
  const totalSeconds = hourSelection.value * 3600 + minuteSelection.value * 60;

  try {
    await fetchy(`/api/restrictions/${props.feature}`, "POST", { body: {limit: totalSeconds} });
    await getTimeRestriction();
  } catch (e) {

  }

  
};

const editTimeRestriction = async () => {
  console.log(timeRestriction.value)
  const totalSeconds = hourSelection.value * 3600 + minuteSelection.value * 60;

  try {
    await fetchy(`/api/restrictions/${props.feature}`, "PUT", { body: {limit: totalSeconds} });
    await getTimeRestriction();
  } catch (e) {
    return;
  }
  
};

const handleFormSubmit = async () => {
  console.log("Entering handle: " + timeRestriction.value)
  if (timeRestriction.value === 86400) {
    await addTimeRestriction();
  } else {
    await editTimeRestriction();
  }
}

onBeforeMount(async () => {
  await getTimeRestriction();
});

</script>

<template>
  <h1>{{ props.feature }}</h1>
  <p>Current Restriction: {{ hrRestriction  }} hr {{ minRestriction }} min</p>
  <form @submit.prevent="handleFormSubmit()">
    Set Restriction for {{ props.feature }}:

    <label for="hour">Hours</label>
    <select name="hour" v-model="hourSelection">
      <option id="hour" v-for="hour in hourSelectionList" :value="hour">
        {{ hour }}
      </option>
    </select>

    <label for="minute">Minutes</label>
    <select name="minute" v-model="minuteSelection">
      <option id="minute" v-for="minute in minuteSelectionList" :value="minute">
        {{ minute }}
      </option>
    </select>
    <button type="submit">Set</button>
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
