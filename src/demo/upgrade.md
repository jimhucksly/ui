## Changes of library usage
 * remove style importing '@ldmjs/ui/dist/css/index.css'
 * remove style importing '@ldmjs/ui/dist/css/root.css'
 * remove style importing '@ldmjs/ui/dist/css/calendar.css'
 * remove style importing '@ldmjs/ui/dist/scss/index-old.scss' (node-sass derecated)
 * remove style importing 'vuetify/styles'
 * remove style importing 'md-editor-v3/lib/style.css'
 * disable vuetify theme is now recommended
 ```js
 const vuetify = createVuetify({
  theme: false,
 });
 ```

## Next component has been removed
 * "small-button"
  - - using instead small-button ->  [ld-button](/?tab=buttons)
 * "square-button"
  - - using instead square-button -> [ld-button](/?tab=buttons)
 * "small-badge"
  - - using instead small-badge -> [ld-badge](/?tab=badge)
 * "ld-time"

## New [color palette and shadows](/?tab=colors_shadows)

## New [scroll styling  ](/?tab=scroll)

## Datatable is now included in library components list by default

warning!
package "@ldmjs/datatable" is dependency now

## TreeView is now included in library components list by default

warning!
package "@ldmjs/treeview" is dependency now

## New components
 * [ld-avatar](/?tab=avatar)
 * [ld-progress](/?tab=progress)
 * [ld-slide](/?tab=slider)
 * [ld-step](/?tab=stepper)
 * [ld-uploader](/?tab=uploader)
 * [ld-datatable](/?tab=datatable)
 * [ld-treeview](/?tab=treeview)
 * [ld-daterange](/?tab=daterange)

## Components updates
 ### [ld-breadcrumbs](/?tab=breadcrumbs)
 #### new props
  - label
  - size
  - theme
  ### new event
  - @open
  ### new item props
  - hidden
 ### [ld-button](/?tab=buttons)
 #### new props
 - icon
 - text
 - tooltip
 - tooltip-text
 - size
 - responsive
 ### [ld-calendar](/?tab=calendar)
 #### new props
  - model-value
  - readonly
  - disabled
  - viewMode
  - disabledDates
  - allowedDates
  #### removed props or events
  - attributes
  - initial-page
  - @select
 ### [ld-checkbox](/?tab=checkbox)
 #### new props
  - size
  - color
  - hint
 #### removed props
  - labelHighlight
  - boldLabel
 ### [ld-chip](/?tab=chip)
 #### new props
  - active
  - size
 ### [ld-combobox](/?tab=combobox)
 #### new props
  - itemSubtitle
  - internalSearch
  - highlight
  - size
  - color
 #### removed props
  - searchable
 ### [ld-datepicker](/?tab=datepicker)
 #### new props
  - size
  - color
  - prop "canClear" changed to "clearable"
  - prop "minDate" moved to "datepickerProps"
  - prop "maxDate" moved to "datepickerProps"
  - prop "disabledDates" moved to "datepickerProps"
  - prop "allowedDates" moved to "datepickerProps"
  - timepickerProps
  - - placeholder
  - - is24hr
 ### [ld-dialog](/?tab=dialog)
 #### alert dialog
  - new props
   - - size
   - - width
   - - height
   - - align
  - prop "content" change to "text"
 #### confirm dialog
  - new props
   - - size
   - - width
   - - height
   - - align
  - prop "content" change to "text"
 #### prompt dialog
   - new props
   - - size
   - - width
   - - height
   - - align
 #### info dialog
 - new props
   - - size
   - - align
 #### select dialog
  - new props
   - - size
   - - align
 #### create dialog
  - new props
   - - size
   - - align
 ### [ld-edit-list-box](/?tab=edit_list_box)
 #### new props
  - size
  - color
 ### [ld-edit-text](/?tab=edit_text)
 #### new props
  - size
  - color
  - prop "clear-icon" changed to "clearable"
 ### [ld-edit-masked-text](/?tab=edit_masked_text)
 #### new props
  - size
  - color
 ### [ld-loader](/?tab=loader)
 #### new props
 - size
 - transparent
 - view
 - color
 #### removed props
  - options
 ### [ld-pager](/?tab=pager)
 #### new props
 - lastPageUnknown
 - unlimited
 - sizes
 - showTotal
 - showSelectCounter
 - showPage
 - rounded
 - fluid
 - prevText
 - nextText
 #### new slots
  - #total
  - #selection
 #### removed props
  - content-type
  - entity-name
 ### [ld-radiogroup](/?tab=radiobutton)
 #### new props
  - size
 #### removed props
  - inputHint
 ### [ld-radiobutton](/?tab=radiobutton)
 #### new props
  - color
  - hint
 #### new props
  - size
  - color
  - hint
 ### [ld-select](/?tab=select)
 #### new props
  - size
  - color
  - prop "selection-show-count" changed to "limit"
 ### [ld-select-list-box](/?tab=select_list_box)
 ### new props
  - fetch-data
  - fetch-item
  - select
 #### new slots
  - #icon
 #### removed props
 - handlers
 - prop "icon" changes to slot #icon
 ### [ld-switch](/?tab=switch)
 #### new props
  - size
  - hint
 ### [ld-tabs](/?tab=tabs)
 #### new props
  - size
 ### [ld-textarea](/?tab=textarea)
 #### new props
  - size
  - color
 #### removed props
  - type
  - rows
 ### [ld-timepicker](/?tab=timepicker)
 #### new props
  - size
  - color
  - prop "format" changes to "is24hr" as type of boolean
 #### removed props
  - returnFormat
 ### [ld-toggle-buttons](/?tab=toggle_buttons)
 #### new props
  - size
  - rounded
 #### new item props
  - text
  - badge
 ### [$toasted](/?tab=toast)
 #### add second parameter into $toasted methods - message text
 ### [$utils](/?tab=utils)
 #### new utilities for datetime
  - this.$utils.datetime.toDate
  - this.$utils.datetime.localToISO
  - this.$utils.datetime.dateToLocal
  - this.$utils.datetime.compare
  - this.$utils.datetime.toServerString
 #### new utilities for files
 - this.$utils.files.getExtension
 - this.$utils.files.getFileName
 - this.$utils.files.formatSize


