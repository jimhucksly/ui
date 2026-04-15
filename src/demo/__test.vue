<template>
  <v-container class="d-flex flex-column">
    <content-header>Test page</content-header>
    <content-body h="300">
      <ld-button @click="dialog"> Call Dialog </ld-button>
    </content-body>
    <v-dialog v-model="show" persistent width="1100px">
      <v-card height="100%" elevation="0" class="pa-2">
        <v-card-title class="d-flex align-center justify-between">
          <span> Dialog </span>
          <v-spacer></v-spacer>
          <ld-button icon text @click="show = false">
            <ld-icon>close</ld-icon>
          </ld-button>
        </v-card-title>
        <v-card-text class="d-flex overflow-x-hidden" style="height: 155px">
          <div class="d-flex flex-column overflow-hidden" style="width: 100%; height: 100%">
            <ld-datatable
              id="datatable"
              ref="table"
              column-mode="flex"
              :columns="columns"
              :rows="rows"
              :scrollbar-h="false"
              :scrollbar-v="true"
              :header-height="38"
              :row-height="28"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import $ from 'mol_time_all';

const Moment = $.$mol_time_moment;

function dateFormat(date: string | Date, format: string = 'DD.MM.YYYY hh:mm', emptyText?: string) {
  if (!date) {
    return emptyText ? emptyText : '';
  }
  if (typeof date === 'string') {
    return new Moment(new Date(date)).toString(format);
  }
  return new Moment(date).toString(format);
}

export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    dialog() {
      this.show = true;
    },
  },
  computed: {
    columns() {
      return [
        {
          prop: 'signerFio',
          name: 'Подписал',
          flexGrow: 1,
        },
        {
          prop: 'signDate',
          name: 'Дата подписания',
          formatter: (cel: Date | string) => dateFormat(cel, 'DD.MM.YYYY hh:mm'),
          flexGrow: 2,
        },
        {
          prop: 'certificateCenterName',
          name: 'Удостоверяющий центр',
          flexGrow: 2,
        },
        {
          prop: 'isValid',
          name: 'Результат проверки',
          formatter: (cel: boolean) => (cel ? 'Подпись верна' : 'Подпись неверна'),
          flexGrow: 2,
        },
        {
          prop: 'message',
          name: 'Ошибка',
          flexGrow: 1,
        },
      ];
    },
    rows() {
      return [
        {
          signerFio: 'CN=Тестовая организация, SN=Диадок, G=Сертификат Тестовый',
          signDate: new Date(),
          certificateCenterName: 'CN=УЦ EasyCert, O=EasyCert, STREET="Малопрудная, 5',
          isValid: true,
          message:
            'Подпись не соответствует документу. Возможно, на проверку был передан неправильный документ или документ был изменён. Ошибка: [Неправильное значение хеша] (0x80091007).Сообщение содержит неверную подпись. Цепочка сертификатов обработана, но обработка прервана на корневом сертификате, у которого отсутствует отношение доверия с поставщиком доверия',
        },
      ];
    },
  },
};
</script>
