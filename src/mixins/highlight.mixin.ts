import { Prop, Vue } from 'vue-property-decorator';

export default class HighlightMixin extends Vue {
  /**
   * Подсветка поиска
   */
  @Prop({ type: Boolean, default: true }) highlight: boolean;

  highlightedText(title: string, text: string) {
    if (!text) {
      return title;
    }
    let result = title;
    const index = title.toLowerCase().indexOf(text.toLowerCase());
    if (index > -1) {
      const slice = title.slice(index, index + text.length);
      result = title
        .split(slice)
        .join(`<span style="color: var(--text); font-family: 'Roboto Semi Bold'">${slice}</span>`);
    }
    return result;
  }
}
