<template>
  <span v-if="item.type == 'code'" v-code="{ code: item.code, value: value }"> </span>
  <span v-else-if="item.type == 'date'">{{ value | filterDate }}</span>
  <span v-else>{{ (value || item.value) | filterText }}</span>
</template>

<script>
export default {
  props: {
    item: Object,
    // type: String,
    // code: String,
    value: String
  }
};
</script>
