<template>
  <b-container>
    <b-row class="pa-3">
      <b-col
        cols="5"
        style="display: grid; grid-auto-flow: column; gap: calc(var(--gutter) * 2); justify-content: start"
      >
        <b-button color="primary">Primary</b-button>
        <b-button color="success">Success</b-button>
        <b-button color="warning">Warning</b-button>
        <b-button color="error">Error</b-button>
        <b-button color="grey">Grey</b-button>
      </b-col>
      <b-col cols="5">
        <b-input
          v-model="input"
          label="Input"
          label-on-top
          :grid="[2, 10]"
          required
          name="input"
          :error="v?.elements?.input?.message"
        ></b-input>
        <b-otp
          v-model="code"
          label="OTP Input"
          label-on-top
          required
          name="code"
          :error="v?.elements?.code?.message"
        ></b-otp>
        <div>
          <b-button @click="validate">Validate</b-button>
        </div>
      </b-col>
    </b-row>
    <b-row class="pa-3">
      <b-col
        cols="6"
        style="display: grid; grid-auto-flow: column; gap: calc(var(--gutter) * 2); justify-content: start"
      >
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
          <b-loader view="dotts" color="primary"></b-loader>
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
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      v: {},
      input: null,
      code: null,
    };
  },
  mounted() {
    this.$validate(this);
  },
  methods: {
    async validate() {
      await this.v.touch();
      return this.v.valid();
    },
  },
};
</script>
