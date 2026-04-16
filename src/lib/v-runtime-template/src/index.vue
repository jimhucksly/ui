<template>
  <component :is="componentName" v-if="componentName"></component>
</template>
<script>
import Mixin from './mixin';
export default {
  components: {},
  mixins: [Mixin]
}
</script>
