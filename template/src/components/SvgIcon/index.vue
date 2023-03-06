<template>
  <svg aria-hidden="true" class="svg-icon" :style="`width:${iconSize}em;height:${iconSize}em`">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  iconClass: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: '',
  },
  iconSize: {
    type: Number,
    default: 1
  }
});

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  fill: currentColor;
}
</style>
