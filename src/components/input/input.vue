<template>
  <div :class="[classService.rootclass]">
    <div :class="classService.submodule('content')">
      <div :class="classService.submodule('label')" v-if="label">{{ label }}</div>
      <div :class="classService.submodule('input')">
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
      </div>
    </div>
  </div>
</template>
<script src="./input.ts"></script>
