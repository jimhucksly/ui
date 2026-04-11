<template>
  <div :class="[classService.rootclass]">
    <b-row :class="classService.submodule('content')">
      <b-col v-if="label && labelCell" :cols="labelCell" :class="classService.submodule('label')">
        {{ label }}
      </b-col>
      <b-col :cols="inputCell" :class="classService.submodule('input')">
        <input
          :id="uid"
          :model-value="internalValue"
          :placeholder="placeholder"
          :name="name"
          :required="required"
          autocomplete="off"
          @keydown.enter.prevent.stop="onEnter"
          @input="onInput"
        />
        <div :class="classService.submodule('error')">
          <span v-if="error">{{ error }}</span>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script src="./input.ts"></script>
