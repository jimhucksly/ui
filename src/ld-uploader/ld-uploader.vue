<template>
  <v-card
    class="ld-uploader"
    elevation="0"
    :id="`uploader-${uid}`"
    :class="[mySize, { 'ld-uploader--disabled': disabled, 'ld-uploader--drag': isDrag }]"
    :style="{ 'max-width': myWidthValue }"
  >
    <v-card-text>
      <ld-label v-if="label" :label="label" :required="required"></ld-label>
      <div
        class="ld-uploader-droparea"
        ref="droparea"
        :style="{ width: myWidthValue, height: myHeightValue }"
        @click="onClick"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <input
          type="file"
          ref="fileInput"
          :name="name || `uploader-${uid}`"
          :disabled="disabled"
          :accept="accept"
          :multiple="multiple"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
        />
        <div class="d-flex mb-1" :class="{ 'flex-column align-center': size !== 's', 'justify-center': size === 's' }">
          <svg
            v-if="size === 's'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.4 6C18.7 2.6 15.7 0 12 0C9.1 0 6.6 1.6 5.4 4C2.3 4.4 0 6.9 0 10C0 13.3 2.7 16 6 16H19C21.8 16 24 13.8 24 11C24 8.4 21.9 6.2 19.4 6ZM14 9V13H10V9H7L12 4L17 9H14Z"
              :fill="disabled ? 'var(--grey-l-3)' : 'var(--primary)'"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            :width="size === 'm' ? 56 : 100"
            :height="size === 'm' ? 32 : 56"
            viewBox="0 0 100 56"
            fill="none"
          >
            <path
              d="M20.0095 55.9504H84.2877C86.3262 56.0173 88.3574 55.6779 90.2606 54.9525C92.1637 54.2272 93.8999 53.1306 95.3659 51.728C96.8318 50.3254 97.9975 48.6456 98.7936 46.7883C99.5897 44.9311 100 42.9344 100 40.9172C100 38.8999 99.5897 36.9033 98.7936 35.046C97.9975 33.1888 96.8318 31.5089 95.3659 30.1063C93.8999 28.7038 92.1637 27.6072 90.2606 26.8818C88.3574 26.1564 86.3262 25.8171 84.2877 25.884H83.9197C82.8726 19.454 79.7902 13.5183 75.116 8.93079C70.4418 4.34333 64.4168 1.34062 57.9077 0.354721C51.3987 -0.631182 44.7411 0.450523 38.893 3.44422C33.045 6.43791 28.308 11.1893 25.3633 17.0147C23.6427 16.5356 21.864 16.2906 20.0765 16.2866C14.7519 16.2866 9.64521 18.3786 5.88014 22.1024C2.11508 25.8263 0 30.877 0 36.1433C0 41.4096 2.11508 46.4602 5.88014 50.1841C9.64521 53.908 14.7519 56 20.0765 56L20.0095 55.9504Z"
              :fill="disabled ? 'var(--grey-l-3)' : 'var(--primary-l-4)'"
            />
            <path
              d="M59.3334 38.8559H39.993C39.8392 38.8546 39.6886 38.8127 39.5563 38.7344C39.4241 38.6561 39.3152 38.5443 39.2404 38.4103C39.1656 38.2763 39.1276 38.125 39.1305 37.9717C39.1334 37.8183 39.1771 37.6685 39.2569 37.5374L48.9437 21.4826C49.0212 21.3548 49.1304 21.2491 49.2609 21.1757C49.3913 21.1024 49.5386 21.0638 49.6883 21.0638C49.8381 21.0638 49.9853 21.1024 50.1158 21.1757C50.2462 21.2491 50.3553 21.3548 50.4327 21.4826L60.0862 37.5541C60.1625 37.686 60.2028 37.8356 60.2028 37.9879C60.2028 38.1402 60.1627 38.2898 60.0864 38.4217C60.0101 38.5536 59.9004 38.6632 59.7682 38.7394C59.636 38.8156 59.4861 38.8558 59.3334 38.8559Z"
              :fill="disabled ? 'var(--white)' : 'var(--primary)'"
            />
            <path
              d="M48.9359 44.8523L50.3581 44.8535C51.2267 44.8542 51.9313 44.1525 51.932 43.2861L51.9437 29.9016C51.9445 29.0352 51.2411 28.3322 50.3726 28.3314L48.9503 28.3302C48.0818 28.3294 47.3771 29.0312 47.3764 29.8976L47.3647 43.2821C47.3639 44.1485 48.0673 44.8515 48.9359 44.8523Z"
              :fill="disabled ? 'var(--white)' : 'var(--primary)'"
            />
          </svg>
          <div class="ld-uploader-placeholder">
            <span class="text-body-s">{{ myPlaceholder }}</span>
          </div>
        </div>
        <div v-if="max" class="ld-uploader-max">
          <span>max. {{ maxValue }}</span>
        </div>
      </div>
      <div class="ld-uploader-validate" v-if="!hideDetails && !hasItems">
        <transition name="squash">
          <span v-if="inputHint || showError" :class="[showError ? 'error--text' : 'grey--text']">
            {{ showError ? validationMessage : inputHint }}
          </span>
        </transition>
      </div>
      <div class="ld-uploader-items" v-if="hasItems && !asInput">
        <ul>
          <li v-for="item of items" :key="item.uid">
            <div class="ld-uploader-item">
              <div class="ld-uploader-item-icon flex-shrink-0">
                <svg-icon>file</svg-icon>
              </div>
              <div class="d-flex flex-column flex-grow-1 pl-3" style="max-width: 100%">
                <div class="d-flex">
                  <span class="text-body-s text-ellipsis">{{ item.filename }}</span>
                  <span>.{{ item.extension }}</span>
                </div>
                <span class="text-body" style="color: var(--grey-d-1)">{{ item.sizeFormat }}</span>
                <span class="text-error text-body py-1" v-if="item.isExceptionalStatus || item.isAbortedStatus">
                  {{ getItemStatus(item) }}
                </span>
                <component
                  v-if="item.isUploadingStatus || item.isUploadedStatus"
                  :is="$ldmui.options.aliases['ld-progress']"
                  :value="item.progress"
                  :counter="false"
                  :label="null"
                  class="ld-uploader-progress"
                />
              </div>
              <!-- buttons -->
              <div class="d-flex justify-end">
                <slot name="actions" :file="item"></slot>
                <component
                  :is="$ldmui.options.aliases['ld-button']"
                  v-if="lazy && url && item.isNoneStatus"
                  icon
                  text
                  @click="onUploadItem(item)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.50008 13.3333V8.33333H4.16675L10.0001 2.5L15.8334 8.33333H12.5001V13.3333H7.50008ZM4.16675 16.6667V15H15.8334V16.6667H4.16675Z"
                      fill="currentColor"
                    />
                  </svg>
                </component>
                <component
                  :is="$ldmui.options.aliases['ld-button']"
                  v-if="lazy && (item.isNoneStatus || item.isAbortedStatus || item.isExceptionalStatus)"
                  icon
                  text
                  @click="onDeleteItem(item)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M13.3334 7.5V15.8333H6.66675V7.5H13.3334ZM12.0834 2.5H7.91675L7.08341 3.33333H4.16675V5H15.8334V3.33333H12.9167L12.0834 2.5ZM15.0001 5.83333H5.00008V15.8333C5.00008 16.75 5.75008 17.5 6.66675 17.5H13.3334C14.2501 17.5 15.0001 16.75 15.0001 15.8333V5.83333Z"
                      fill="currentColor"
                    />
                  </svg>
                </component>
                <component
                  :is="$ldmui.options.aliases['ld-button']"
                  v-if="item.isUploadingStatus"
                  icon
                  text
                  @click="onAbortItem(item)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.8334 3.34175L12.6584 2.16675L8.00002 6.82508L3.34169 2.16675L2.16669 3.34175L6.82502 8.00008L2.16669 12.6584L3.34169 13.8334L8.00002 9.17508L12.6584 13.8334L13.8334 12.6584L9.17502 8.00008L13.8334 3.34175Z"
                      fill="currentColor"
                    />
                  </svg>
                </component>
                <slot name="actions-list" :file="item"></slot>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </v-card-text>
  </v-card>
</template>
<script src="./ld-uploader.ts"></script>
