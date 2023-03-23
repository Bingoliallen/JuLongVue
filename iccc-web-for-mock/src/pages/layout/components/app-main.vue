<template>
  <section class="l-main-content">
    <keep-alive>
      <router-view />
    </keep-alive>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'AppMain',
  data() {
    return { routerName: 'AppMain' };
  },
  computed: {
    ...mapGetters(['cachedViews'])
  }
};
</script>
<style scoped></style>
