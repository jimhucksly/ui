<template>
  <v-container class="d-flex flex-column">
    <content-header>Scrollbar</content-header>
    <content-body h="500">
      <v-row class="pt-3">
        <v-col cols="12" style="display: grid; grid-template-columns: auto auto; gap: 8px">
          <div>
            <div style="height: 60px"></div>
            <div class="overflow-auto" style="height: 250px; border: 1px solid var(--grey-l-5)">
              <div class="pa-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad amet cum architecto necessitatibus, earum
                voluptate iusto perspiciatis odit molestias omnis mollitia reiciendis, ab id deleniti ut dignissimos
                corporis ex suscipit qui asperiores aspernatur error nam maxime numquam! Illum fuga eos sunt vero
                explicabo impedit mollitia doloribus! Rerum nostrum, recusandae omnis hic dolor voluptatem dolores
                voluptates ratione quia culpa est officia impedit minus animi suscipit? Officia minus magnam odit
                repellat aperiam consequuntur nam odio error eum adipisci fuga, numquam culpa repudiandae laudantium
                totam. Minima ea sequi necessitatibus ipsum repellendus facere distinctio magnam. Nesciunt eligendi
                nobis, sint labore repellat consequatur placeat consectetur corporis at vel laboriosam eum, laborum
                tempore corrupti, omnis molestiae id aperiam alias? Nisi aperiam officia repellat sit illum reiciendis
                earum vel eligendi consectetur molestiae tempore praesentium, velit a id. Quae fugit nesciunt, maxime a
                asperiores earum tempora quis possimus iste consectetur veritatis exercitationem neque debitis,
                temporibus inventore aliquam expedita corporis ducimus, est dolorum maiores dicta minus. Non autem nihil
                sapiente dolorum facere cumque quas dolor minima cum quis pariatur, saepe, recusandae ab illo, provident
                voluptatibus nemo impedit odio repellendus quod culpa nobis veritatis. Asperiores quasi nesciunt cumque
                hic maxime quo a, molestiae labore illum tempore vero voluptas nihil ipsa!
              </div>
            </div>
          </div>
          <div>
            <div style="height: 60px">
              <markdown-to-html v-if="!templatesLoading" :template="templates['scroll.md']" />
            </div>
            <div class="overflow-auto scroll-s" style="height: 250px; border: 1px solid var(--grey-l-5)">
              <div class="pa-3">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex ea consequatur quaerat quo asperiores
                veniam illum consectetur, consequuntur nam aliquid, fugit tenetur laborum molestiae possimus,
                praesentium natus explicabo cumque? Perspiciatis nostrum reprehenderit, recusandae eum doloremque
                pariatur molestiae cum nesciunt perferendis libero aperiam voluptate possimus sequi ea necessitatibus.
                Recusandae suscipit, omnis minus veritatis voluptates ipsa cumque? Illo aliquam explicabo iste assumenda
                quae velit vero perspiciatis reiciendis natus consequatur rerum aperiam eius fugiat unde enim saepe
                temporibus, a at amet quisquam modi accusantium eum placeat quaerat. Reiciendis aperiam quis maxime est
                commodi assumenda iure illum quae pariatur magnam magni rem, porro architecto nulla nam rerum a id
                laborum dolorum temporibus nobis. Optio eaque, quaerat earum dolor corrupti magni possimus, modi
                consequuntur laudantium provident aperiam saepe dignissimos, adipisci placeat blanditiis suscipit
                officiis expedita! Ratione est distinctio sint quam. Itaque, facere. Ratione totam dolore, ad aliquid
                neque cupiditate iure, at repellendus dolor quis laboriosam quidem perspiciatis? Nostrum quas
                voluptatibus ratione dolore, obcaecati nam ipsam minima est ea doloribus rem unde optio porro
                repudiandae iure eius animi amet, reprehenderit, excepturi officiis rerum modi architecto sunt?
                Perferendis beatae pariatur maxime. Velit natus quos voluptatibus ipsam cupiditate rerum fugiat dolores
                quia, reiciendis atque odit iusto aliquid, voluptas autem sapiente architecto rem unde sed. Unde
                sapiente labore tenetur rerum totam recusandae veniam modi dignissimos amet, vel, vitae rem facere
                libero nulla aliquid architecto aliquam molestias magnam adipisci! Culpa corporis aspernatur minima
                impedit doloribus consequuntur odit unde et libero consequatur? Mollitia tempora expedita debitis
                asperiores. Quae debitis qui sequi neque quisquam magnam odit ex in assumenda perspiciatis vel
                laboriosam veniam quas rem nulla quam maxime facere aspernatur quasi ipsa dolorem iste iusto,
                consequatur incidunt? Iusto saepe explicabo error aspernatur mollitia consequatur, aliquam assumenda.
                Totam adipisci ullam iusto. Neque veniam quaerat reiciendis aperiam unde ullam omnis ipsam. Provident
                nihil molestias harum ad culpa voluptatum numquam. Repudiandae atque esse eum optio similique neque,
                quasi sapiente. Pariatur nisi voluptatibus omnis repudiandae repellat? Amet vel voluptas repudiandae
                sequi vitae id deserunt distinctio excepturi accusantium temporibus consequatur quam, mollitia molestias
                sapiente velit magni consectetur provident fuga dignissimos ullam totam laudantium eligendi blanditiis.
                Reiciendis eos commodi aperiam non quia sunt rerum consequuntur neque obcaecati, facilis repudiandae ut,
                beatae ad delectus ex, vitae laboriosam totam quisquam omnis inventore iste fuga quaerat itaque.
                Accusantium, laboriosam ratione! Deleniti doloribus placeat aut cumque amet incidunt dicta dolor. Quis
                debitis amet necessitatibus nobis eveniet aliquam est facilis ad officia asperiores accusamus distinctio
                excepturi dolorem quas placeat beatae odit, voluptates qui id! Unde, nostrum. Provident nam assumenda
                eaque blanditiis in necessitatibus eveniet placeat voluptatem, eos, et exercitationem reprehenderit
                adipisci nisi! Reprehenderit debitis sed eum ab quis excepturi dignissimos impedit animi doloribus natus
                consequuntur quidem itaque omnis repudiandae voluptates magnam, autem maxime iure enim laborum illum.
                Totam in cupiditate magnam quod praesentium. Delectus, eveniet illum. Repellendus exercitationem vero
                porro quae quo voluptatem provident sed molestias. Delectus voluptatibus odio iste earum consectetur
                quam aliquam blanditiis in eveniet minus, culpa error, quo quisquam amet tempora rerum sapiente fugiat
                sit? Molestiae ea maxime ad commodi?
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      //
    };
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['scroll.md'];
    },
  },
};
</script>
