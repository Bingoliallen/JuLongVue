<template>
  <div class="statistical-tab">
    <dg-radio-group
      v-model="value"
      :data="data"
      value-name="name"
      label-name="option"
      type="button"
      szie="mini"
      call-off
      @change="changeListener"
    ></dg-radio-group>
  </div>
</template>

<script>
import { EventBus } from './event-bus.js';

export default {
  name: 'mine-tab',
  props: {},
  data() {
    return {
      data: [
        {
          name: 'mine_control',
          option: '我的布控'
        },
        {
          name: 'mine_examine',
          option: '我的审批'
        },
        {
          name: 'mine_collection',
          option: '我的收藏'
        }
      ],
      value: 'mine_control'
    };
  },
  methods: {
    changeListener(value) {
      EventBus.$emit('update-mine-tab', { value });
    }
  }
};
</script>

<style lang="scss" scoped></style>
