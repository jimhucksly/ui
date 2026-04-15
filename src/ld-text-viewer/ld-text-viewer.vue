<template>
  <div class="ld-text-viewer">
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col class="d-flex text-justify align-center" :class="inputSizeClasses">
        <template v-if="src">
          <template v-if="textWithHyperlinks">
            <span v-html="textWithHyperlinks"></span>
          </template>
          <template v-else>
            <span v-html="src"></span>
          </template>
        </template>
        <template v-else>
          <slot></slot>
        </template>
        <p v-if="showPlaceholder" class="italic" style="color: var(--grey-l-2)">{{ $ldmuii18n.gettext('No data') }}</p>
      </v-col>
    </v-row>
  </div>
</template>
<script src="./ld-text-viewer.ts"></script>
