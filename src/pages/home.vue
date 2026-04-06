<template>
  <div id="title">DN UI Library</div>
  <b-button id="start" @click="$app.go('demo')">Start</b-button>
  <div id="ver">{{ $dnwebui.ver }}</div>
</template>
<script>
export default {
  data() {
    return {
      //
    };
  },
  mounted() {
    document.body.style['background-color'] = 'var(--grey-d-6)';
  },
  beforeUnmount() {
    document.body.style['background-color'] = 'unset';
  },
};
</script>
<style lang="scss" scoped>
#title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--semibold);
  font-size: 36px;
  height: 100vh;
  color: var(--grey-l-1);
  z-index: 1;
}
#start {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 150%);
}
#ver {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 0;
  font-family: var(--semibold);
  font-size: 16px;
  font-weight: 700;
  color: var(--grey-l-1);
  text-align: center;
  z-index: 1;
}
</style>
