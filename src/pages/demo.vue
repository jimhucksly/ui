<template>
  <b-row class="pa-3">
    <b-col cols="6" style="display: grid; grid-auto-flow: column; gap: calc(var(--gutter) * 2); justify-content: start">
      <b-button color="primary">Primary</b-button>
      <b-button color="success">Success</b-button>
      <b-button color="warning">Warning</b-button>
      <b-button color="error">Error</b-button>
      <b-button color="grey">Grey</b-button>
    </b-col>
  </b-row>
  <b-row class="pa-3">
    <b-col cols="6" style="display: grid; grid-auto-flow: column; gap: calc(var(--gutter) * 2); justify-content: start">
      <b-button color="primary" outlined>Primary</b-button>
      <b-button color="success" outlined>Success</b-button>
      <b-button color="warning" outlined>Warning</b-button>
      <b-button color="error" outlined>Error</b-button>
      <b-button color="grey" outlined>Grey</b-button>
    </b-col>
  </b-row>
  <b-row class="pa-3">
    <b-col cols="6" class="flex-start">
      <div style="width: 55px; height: 55px">
        <b-loader view="dotts"></b-loader>
      </div>
      <div style="width: 55px; height: 55px">
        <b-loader view="circle"></b-loader>
      </div>
      <div style="width: 55px; height: 55px">
        <b-loader view="circle" color="primary"></b-loader>
      </div>
      <div style="width: 55px; height: 55px">
        <b-loader view="circle" color="success"></b-loader>
      </div>
      <div style="width: 55px; height: 55px">
        <b-loader view="circle" color="warning"></b-loader>
      </div>
      <div style="width: 55px; height: 55px">
        <b-loader view="circle" color="error"></b-loader>
      </div>
      <div style="width: 55px; height: 55px">
        <b-loader view="circle" color="grey"></b-loader>
      </div>
    </b-col>
  </b-row>
</template>
<script>
export default {
  data() {
    return {
      //
    };
  },
};
</script>
