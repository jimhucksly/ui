<template>
  <div class="ld-dialog">
    <minimized
      :id="id"
      :dialogs="minimized"
      @maximize="onMinimize($event)"
      @close="handleCancel($event, cancelReason.FromCloseButton)"
      @close-all="handleCancelAll"
    />
    <div v-for="modal in modals" :key="modal.id" class="h-100">
      <v-dialog
        v-model="modal.show"
        :ref="`ld-dialog-${modal.id}`"
        :content-class="['ld-dialog-content'].concat(modalClass(modal))"
        :class="dialogClass(modal)"
        persistent
        scroll-strategy="none"
        v-bind="dialogBindings(modal)"
        :hide-header-close="!modal.closable"
        :no-click-animation="modal.noModal"
        :retain-focus="modal.retainFocus"
        :scrim="showScrim(modal)"
        @hide="handleHide(modal)"
      >
        <v-card>
          <!-- Title -->

          <v-card-title :class="{ 'v-card-title--dark': isTitleDark(modal) }">
            <component
              :is="$ui.options.aliases['ld-button']"
              v-if="hasParent(modal)"
              icon
              text
              size="s"
              class="mr-2"
              @click="handleCancel(modal, cancelReason.FromBackButton)"
            >
              <svg-icon>to left</svg-icon>
            </component>

            <span> {{ modalTitle(modal) }} </span>

            <v-spacer></v-spacer>

            <component
              :is="$ui.options.aliases['ld-button']"
              icon
              text
              :tooltip="true"
              :tooltip-text="$i18n.gettext('Help')"
              v-if="modal.help"
              @click="onHelp(modal)"
            >
              <svg-icon>help</svg-icon>
            </component>

            <component
              :is="$ui.options.aliases['ld-button']"
              v-if="modal.minimizable && !isMobileGlobal"
              icon
              text
              @click="onMinimize(modal)"
            >
              <svg-icon>minimize</svg-icon>
            </component>

            <component
              :is="$ui.options.aliases['ld-button']"
              v-if="isExpanded(modal) && !isMobileGlobal"
              icon
              text
              @click="onExpandCollapse(modal)"
            >
              <svg-icon>collapse</svg-icon>
            </component>

            <component
              :is="$ui.options.aliases['ld-button']"
              v-if="isCollapsed(modal) && !isMobileGlobal"
              icon
              text
              @click="onExpandCollapse(modal)"
            >
              <svg-icon>expand</svg-icon>
            </component>

            <component
              :is="$ui.options.aliases['ld-button']"
              v-if="modal.closable || isMobileGlobal"
              icon
              text
              class="ml-1"
              @click.native="handleCancel(modal, cancelReason.FromCloseButton)"
            >
              <svg-icon>close</svg-icon>
            </component>
          </v-card-title>

          <!-- Content -->

          <v-card-text
            v-if="modal.content && (isAlertDialog(modal) || isConfirmDialog(modal))"
            v-html="modal.content"
          />

          <v-card-text v-else-if="isPromptDialog(modal)">
            <component :is="$ui.options.aliases['ld-textarea']" v-model="modal.content" rows="3" />
          </v-card-text>

          <v-card-text
            v-else-if="modal.component"
            :style="{
              visibility: setVisibility(modal.id),
            }"
          >
            <component :is="$ui.options.aliases['ld-loader']" :transparent="true" :visible="modal.loading" />

            <component
              v-if="!modal.loading && (isInfoDialog(modal) || isSelectDialog(modal))"
              :is="modal.component"
              v-bind="modal.componentProps"
              @set-result="onSetResult(modal, $event)"
              @set-result-and-close="onSetResultAndClose(modal, $event)"
              @cancel="handleCancel(modal)"
              @external-component-created="onComponentInstanceCreated(modal, $event)"
            />

            <component
              v-if="!modal.loading && isCreateEditDialog(modal)"
              :is="modal.component"
              v-bind="modal.componentProps"
              @collapse-modal="onExpandCollapse(modal)"
              @cancel="handleCancel(modal)"
              @set-result="onSetResult(modal, $event)"
              @set-readonly="modal.okDisabled = true"
              @dialog:activate="onActivate(modal)"
              @dialog:processing="onProcessing(modal, $event)"
              @external-component-created="onComponentInstanceCreated(modal, $event)"
            />
          </v-card-text>

          <!-- Actions -->

          <v-card-actions v-if="!modal.hideFooter">
            <component
              :is="$ui.options.aliases['ld-button']"
              v-if="hasParent(modal)"
              :id="`ld-dialog-btn-goback-${modal.id}`"
              variant="outlined"
              color="primary"
              size="s"
              @click.native="handleCancel(modal, cancelReason.FromBackButton)"
            >
              {{ $i18n.gettext('Dialog Go Back') }}
            </component>
            <component
              :is="$ui.options.aliases['ld-button']"
              :id="`ld-dialog-btn-cancel-${modal.id}`"
              v-if="showCancelBtn(modal)"
              :disabled="modal.okOnly || modal.okLoading"
              variant="outlined"
              color="primary"
              size="s"
              @click.native="handleCancel(modal, cancelReason.FromCancelButton)"
            >
              {{ cancelButtonText(modal) }}
            </component>
            <component
              :is="$ui.options.aliases['ld-button']"
              :id="`ld-dialog-btn-ok-${modal.id}`"
              v-if="showOkBtn(modal)"
              :disabled="modal.okDisabled"
              :loading="modal.okLoading"
              color="primary"
              size="s"
              @click.native="handleCancel(modal, cancelReason.FromOkButton)"
            >
              {{ okButtonText(modal) }}
            </component>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script src="./ld-dialog.ts"></script>
