/**
 * import markdownToHTML from './mixins/markdownToHTML';
 *
 * mixins: [markdownToHTML],
 *
  computed: {
    library() {
      return [
        'index.md'
      ]
    }
  },
 * use:
 * <markdown-to-html v-if="!templatesLoading" :template="templates['index.md']" />
 *
 * use cols:
 *
 # cols[6]
 # end of cols
 # cols[6]
 # end of cols
 */
export default {
  async mounted() {
    const markdownIt = (await import('markdown-it')).default;
    this.md = new markdownIt();
    this.fetchTemplates();
  },
  data(): {
    md: unknown;
    templatesLoading: boolean;
    templates: Record<string, string>;
  } {
    return {
      md: null,
      templatesLoading: false,
      templates: {},
    };
  },
  methods: {
    async fetchTemplates() {
      this.templatesLoading = true;
      try {
        const result: Record<string, string> = {};
        if (Array.isArray(this.library)) {
          for (const f of this.library) {
            const data = await fetch('/readme/' + f);
            const text = await data.text();
            let html = this.md.render(text);
            html = html
              .replace(/&lt;br&gt;/g, '<br>')
              .replace(/\{/g, '&lbrace;')
              .replace(/\}/g, '&rbrace;');
            const m = html.match(/<h1>cols\[\d\d?\]<\/h1>/g);
            if (Array.isArray(m) && m.length) {
              const cols = [];
              for (const i of m) {
                cols.push(i.replace(/(<h1>)(cols)(\[\d\d?\])(<\/h1>)/g, '$3').replace(/\D/g, ''));
              }
              html = html.replace(/<h1>cols\[\d\d?\]<\/h1>/g, '');
              html = html.replace(/<h1>end of cols<\/h1>/g, '-split by cols-');
              const e = html.split('-split by cols-');
              for (let i = 0; i < e.length; i++) {
                if (cols[i]) {
                  e[i] = `<v-col cols="${cols[i]}">` + e[i] + `</v-col>`;
                }
              }
              html = '<v-row>' + e.join('') + '</v-row>';
            }
            result[f] = '<div class="markdown-to-html-content">' + html + '</div>';
          }
          this.templates = result;
        }
      } finally {
        this.templatesLoading = false;
      }
    },
  },
};
