<template>
  <div :class="[classService.rootclass]">
    <input
      type="text"
      style="display: none"
      :value="code"
      :required="required"
      :id="uid"
      :name="name"
      autocomplete="off"
    />
    <b-row :class="classService.submodule('content')">
      <b-col v-if="label && labelCell" :cols="labelCell" :class="classService.submodule('label')">
        {{ label }}
      </b-col>
      <b-col :cols="inputCell" :class="classService.submodule('input')">
        <template v-for="i in arr">
          <input
            type="text"
            :id="'field-' + i"
            v-model="values[i]"
            :class="{ error }"
            @input="onInput($event, i)"
            @keydown="onKeydown($event, i)"
          />
        </template>
      </b-col>
    </b-row>
    <div :class="classService.submodule('error')">
      <span v-if="error">{{ error }}</span>
    </div>
  </div>
</template>
<script src="./code.ts" lang="ts"></script>
