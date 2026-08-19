<template>
  <div class="b-dialog">
    <minimized
      :id="id"
      :dialogs="modals.filter(m => m.minimized)"
      @maximize="onMinimize($event)"
      @close="handleCancel($event, cancelReason.FromCloseButton)"
      @close-all="handleCancelAll"
    />
    <div v-for="modal in modals" :key="modal.id" class="h-100">
      <v-dialog
        v-model="modal.show"
        :ref="`b-dialog-${modal.id}`"
        :content-class="['b-dialog-content'].concat(modalClass(modal))"
        :class="dialogClass(modal)"
        persistent
        scroll-strategy="none"
        v-bind="dialogBindings(modal)"
        :no-click-animation="true"
        :retain-focus="modal.retainFocus"
        :scrim="showScrim(modal)"
        @after-enter="dialogEnter(modal)"
        @after-leave="dialogLeave(modal)"
      >
        <v-card data-role="modal" :style="{ '--scrollbar-width': scrollbarWidth }">
          <!-- ---------- -->
          <!-- Title -->
          <!-- ---------- -->
          <v-card-title data-role="modal-title">
            <div style="height: 40px" class="d-flex align-center">
              <component
                :is="$ui.options.aliases['b-button']"
                v-if="hasParent(modal)"
                icon
                text
                size="m"
                class="mr-2"
                @click="handleCancel(modal, cancelReason.FromBackButton)"
              >
                <svg-icon>to left</svg-icon>
              </component>
            </div>

            <div class="b-dialog__title">
              {{ modalTitle(modal) }}
            </div>

            <v-spacer></v-spacer>

            <div style="height: 40px" class="d-flex align-center">
              <component
                :is="$ui.options.aliases['b-button']"
                v-if="modal.help"
                icon
                text
                size="m"
                :tooltip="true"
                :tooltip-text="$i18n.gettext('Help')"
                @click="onHelp(modal)"
              >
                <svg-icon>help</svg-icon>
              </component>

              <component
                :is="$ui.options.aliases['b-button']"
                v-if="modal.minimizable && !isMobileGlobal"
                icon
                text
                size="m"
                @click="onMinimize(modal)"
              >
                <svg-icon>minimize</svg-icon>
              </component>

              <component
                :is="$ui.options.aliases['b-button']"
                v-if="isExpanded(modal) && !isMobileGlobal"
                icon
                text
                size="m"
                @click="onExpandCollapse(modal)"
              >
                <svg-icon>collapse</svg-icon>
              </component>

              <component
                :is="$ui.options.aliases['b-button']"
                v-if="isCollapsed(modal) && !isMobileGlobal"
                icon
                text
                size="m"
                @click="onExpandCollapse(modal)"
              >
                <svg-icon>expand</svg-icon>
              </component>

              <component
                :is="$ui.options.aliases['b-button']"
                v-if="modal.closable || isMobileGlobal"
                icon
                text
                size="m"
                class="ml-1"
                @click="handleCancel(modal, cancelReason.FromCloseButton)"
              >
                <svg-icon>close</svg-icon>
              </component>
            </div>
          </v-card-title>
          <!-- ---------- -->
          <!-- Content -->
          <!-- ---------- -->
          <v-card-text
            v-if="modal.content && (isAlertDialog(modal) || isConfirmDialog(modal))"
            data-role="modal-text"
            :style="{
              '--scrollbar-visible': modal.scrollbar,
            }"
          >
            <template v-if="hasContentDetails(modal.content)">
              <div class="b-dialog__text" v-html="modal.content.split(messageDetailSeparator)[0]"></div>
              <v-expansion-panels class="elevation-0">
                <v-expansion-panel class="px-0">
                  <v-expansion-panel-title style="color: var(--grey-d-1)">
                    <template #actions>
                      <b-icon>chevron-right</b-icon>
                    </template>
                    {{ $i18n.gettext('Details') }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="b-dialog__text" v-html="modal.content.split(messageDetailSeparator)[1]"></div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <div class="b-dialog__text" v-else v-html="modal.content"></div>
          </v-card-text>

          <v-card-text
            v-else-if="isPromptDialog(modal)"
            data-role="modal-text"
            :style="{
              '--scrollbar-visible': modal.scrollbar,
            }"
          >
            <component :is="$ui.options.aliases['b-textarea']" v-model="modal.content" rows="3" />
          </v-card-text>

          <v-card-text
            v-else-if="modal.component"
            data-role="modal-text"
            :style="{
              '--scrollbar-visible': modal.scrollbar,
            }"
          >
            <component :is="$ui.options.aliases['b-loader']" :transparent="true" :visible="modal.loading" />

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

          <v-card-actions v-if="!modal.hideFooter" data-role="modal-actions">
            <component
              :is="$ui.options.aliases['b-button']"
              v-if="hasParent(modal)"
              :id="`b-dialog-btn-goback-${modal.id}`"
              variant="outlined"
              :color="modal.cancelColor"
              size="s"
              @click.native="handleCancel(modal, cancelReason.FromBackButton)"
            >
              <svg-icon>to left</svg-icon>
              {{ $i18n.gettext('Dialog Go Back') }}
            </component>
            <component
              :is="$ui.options.aliases['b-button']"
              :id="`b-dialog-btn-cancel-${modal.id}`"
              v-if="showCancelBtn(modal)"
              :disabled="modal.okOnly || modal.okLoading"
              variant="outlined"
              :color="modal.cancelColor"
              size="s"
              @click="handleCancel(modal, cancelReason.FromCancelButton)"
            >
              {{ cancelButtonText(modal) }}
            </component>
            <component
              :is="$ui.options.aliases['b-button']"
              :id="`b-dialog-btn-ok-${modal.id}`"
              v-if="showOkBtn(modal)"
              :disabled="modal.okDisabled"
              :loading="modal.okLoading"
              :color="modal.okColor"
              size="s"
              @click="handleCancel(modal, cancelReason.FromOkButton)"
            >
              {{ okButtonText(modal) }}
            </component>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script src="./b-dialog.ts"></script>
