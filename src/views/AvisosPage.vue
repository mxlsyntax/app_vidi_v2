<script setup>
import { ref, computed, renderList } from 'vue';
const counter = ref(0);
const arrayCounter = ref([]);
const increment = () => {
  counter.value++;
};
const decrement = () => {
  counter.value--;
};
const reset = () => {
  counter.value = 0;
};
const counterClass = () => {
    if (counter.value === 0) {
      return 'zero';
    }if (counter.value < 0) {
      return 'negative';
    }if (counter.value > 0) {
      return 'positive';
    }
};
const add = () => {
  arrayCounter.value.push(counter.value);
  console.log(arrayCounter);
  counter.value = 0; // Reset counter after adding to array
};

const bloquearBtnAdd = computed(() => {
    const numSearch = arrayCounter.value.find(num => num === counter.value);
    if (numSearch === 0) return true;
        return numSearch ? true : false;
});
</script>

<template>
<div class="container text-center mt-5">
<h2 :class="counterClass()">{{ counter }}</h2>
<div class="btn-group">
<button class="btn btn-primary" @click="increment">Aumentar</button>
<button class="btn btn-success" @click="decrement">Disminuir</button>
<button class="btn btn-danger" @click="reset">reset</button>
<button class="btn btn-info" :disabled="bloquearBtnAdd" @click="add">Add</button>
</div>

<ul class="list-group" v-for="(item, index) in arrayCounter" :key="index">
    <li class="list-group-item">{{ item }}</li>
    </ul>

</div>


</template>

<style>
.positive {
  color: rgb(2, 255, 2);
}
.negative {
  color: red;
}
.zero {
  color: purple;
}
</style>