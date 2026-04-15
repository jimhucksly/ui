<template>
  <v-container class="h-100 pb-0 px-0">
    <v-row>
      <v-col class="d-flex flex-column">
        <ld-edit-text v-model="first_name" label="First Name" label-on-top required />
        <ld-edit-text v-model="last_name" label="Last Name" label-on-top required />
        <ld-select-list-box
          v-model="city"
          label="City"
          item-value="city"
          item-title="city"
          label-on-top
          required
          :fetch-item="fetchItem"
          :select="onSelect"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div style="width: 100%; height: 600px">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. At facilis commodi error expedita facere et
          repudiandae doloremque eveniet laboriosam accusamus optio, sed reprehenderit, excepturi aut magnam! Iusto,
          asperiores minima ipsa cumque iure soluta sequi id. Saepe hic recusandae veritatis optio molestiae porro quis,
          fugit nihil! Maiores eaque error quidem est illum laudantium quod minus assumenda cum architecto, enim odio
          rerum ratione incidunt praesentium vel quis iusto magnam provident adipisci quasi molestiae qui nostrum?
          Laudantium excepturi eos veritatis repellendus temporibus impedit ducimus dolorem illum odio esse dicta maxime
          sed aspernatur quidem libero cumque sunt eligendi, quod delectus autem eaque, et sequi. Vero delectus dolores
          laborum. Iusto laboriosam eveniet commodi placeat voluptate, inventore cupiditate deserunt, mollitia tempore
          dolore aspernatur officiis tenetur ut quam excepturi quas. Animi error, voluptatum ex nam accusamus in
          recusandae eos amet vitae suscipit blanditiis unde quo. Aut ducimus fugiat praesentium ullam. Officia
          consectetur natus quas commodi molestiae tenetur autem, tempora corrupti labore quaerat. Quia, consectetur.
          Natus repellat ducimus dolor molestias velit iusto pariatur nihil inventore minima, neque officiis, nisi harum
          cum nemo illo. Magni, facere. Repellendus in at, quia ipsum dolorem exercitationem aliquam laborum nesciunt
          adipisci ex. Illo voluptatem natus accusantium expedita voluptate voluptas aliquam repellendus. Explicabo,
          praesentium!
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/typedef */
import { DialogManager } from '@/ld-dialog/dialog.manager';
import { SelectDialog } from '@/ld-dialog/dialogs';
import { ValidateMixinOptions } from '@/mixins/validate.mixin';
import { delay } from '@/utils';
interface IRow {
  id: number;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  first_name: string;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  last_name: string;
  city: string;
}
export default {
  emits: [
    'collapse-modal',
    'cancel',
    'set-result',
    'set-readonly',
    'dialog:activate',
    'dialog:processing',
    'external-component-created',
  ],
  props: {
    model: {
      type: Object,
      default: (): Record<string, unknown> => null,
    },
    setIsChangedCallback: {
      type: Function,
      default: null,
    },
  },
  mixins: [ValidateMixinOptions],
  data(): {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    first_name: string;
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    last_name: string;
    city: string;
    mockData: Array<unknown>;
    mockCities: Array<unknown>;
  } {
    return {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      first_name: null,
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      last_name: null,
      city: null,
      mockData: null,
      mockCities: null,
    };
  },
  created() {
    this.$emit('external-component-created', this);
  },
  watch: {
    model: {
      immediate: true,
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      handler(val: { first_name: string; last_name: string }) {
        if (val) {
          this.first_name = val.first_name;
          this.last_name = val.last_name;
        }
      },
    },
  },
  methods: {
    async fetchMock() {
      if (this.mockData) {
        return this.mockData;
      }
      await this.$utils.delay(1000);
      return fetch('/mock.json')
        .then(response => response.json())
        .then(data => {
          this.mockData = data;
          return data;
        });
    },
    async fetchCities() {
      if (this.mockCities) {
        return this.mockCities;
      }
      await this.$utils.delay(1000);
      return this.fetchMock().then((data: Array<IRow>) => {
        const result = Array.from(new Set(data.map((el: { city: string }) => el.city))).map(el => ({ city: el }));
        this.mockCities = result;
        return result;
      });
    },
    fetchItem(ids: Array<string>) {
      return this.fetchCities().then((data: Array<IRow>) => data.filter(el => ids.includes(el.city)));
    },
    async onSelect() {
      const res = await DialogManager.exec(
        new SelectDialog({
          title: 'Выберите элемент',
          component: 'select-component',
          loading: true,
          componentProps: {
            selectedItems: [],
            disabledItems: [],
            multiselect: false,
          },
          selectAsOk: true,
          fullHeight: true,
        }),
        () =>
          this.fetchCities().then((data: Array<IRow>) => ({
            rows: data,
            columns: [
              {
                name: 'City',
                prop: 'city',
              },
            ],
          }))
      );
      if (res) {
        return res;
      }
    },
    async save() {
      if (this.validate()) {
        await delay(3000);
        return {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          first_name: this.first_name,
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          last_name: this.last_name,
          city: this.city,
        };
      }
      return false;
    },
    isChanged() {
      if (this.model) {
        return this.first_name !== this.model.first_name || this.last_name !== this.model.last_name;
      }
      return false;
    },
  },
};
</script>
