<template>
  <f7-sheet
    class="demo-sheet"
    style="height:auto; --f7-sheet-bg-color: #fff; border-radius: 25px 25px 0px 0px;"
    :opened="openDetailed"
    @sheet:closed="handleClose"
    @sheet:close="handleClose"
    :swipe-to-close="!selectedModificatorGroup"
    swipe-to-step
    backdrop
    close-by-backdrop-click
    close-by-outside-click
    animate
  >
    <f7-link
      v-if="selectedModificatorGroup"
      @click="selectedModificatorGroup = null"
      :style="'margin: 20px; float: right;'"
    >
      <img :src="require('../../images/cancel.svg').default" />
    </f7-link>
    <f7-link v-else sheet-close :style="'margin: 20px; float: right;'">
      <img :src="require('../../images/cancel.svg').default" />
    </f7-link>

    <f7-block :style="'margin-top: 50px;'">
      <div v-if="selectedModificatorGroup" class="modificator-list-container">
        <div class="detailed-components">
          {{ selectedModificatorGroup }}
        </div>

        <div
          v-for="modificator in modificatorsGroup(selectedModificatorGroup)"
          :key="modificator.name"
          class="modificator-select"
          :style="'width: calc(100% - 60px);'"
          @click="handleModificatorSelect(modificator.id)"
        >
          <div>
            {{ modificator.name }}
          </div>
          <img
            v-if="modificatorSelected(modificator)"
            :src="require('../../images/circleSelected.svg').default"
          />
          <img
            v-else
            :src="require('../../images/circleOutline.svg').default"
          />
        </div>
      </div>

      <div class="detailed-item">
        <div class="detailed-item-image-container">
          <img
            v-if="data.image && data.image.url"
            :src="data.image.url"
            class="detailed-item-image"
          />
        </div>

        <div class="detailed-item-text-container">
          <p class="detailed-item-text-head">{{ data.contentHeader }}</p>
          <p class="detailed-item-text">{{ data.content }}</p>
          <p v-if="data.initialPrice" class="detailed-item-price">
            {{ data.initialPrice }} ₽
          </p>
        </div>
      </div>
      <form v-if="showBasket" ref="infoInputs" :style="'margin-bottom: 200px;'">
        <div v-for="(item, i) in uniqueModificators" :key="item">
          <div class="detailed-components">
            {{ item }}
          </div>

          <div
            class="modificator-select"
            @click="selectedModificatorGroup = item"
          >
            <div>
              {{ modificatorName(i) }}
            </div>
            <img :src="require('../../images/chevronDown.svg').default" />
          </div>
        </div>

        <div v-if="components && components.length" class="detailed-components">
          Дополнительно
        </div>

        <div
          v-for="(item, index) in components"
          :key="index"
          class="detailed-component-container"
        >
          <div class="detailed-components" :style="'font-weight: normal;'">
            {{ item.name }}
          </div>
          <div class="detailed-component-price">+{{ item.price }} ₽</div>
          <div class="detailed-counter">
            <img
              :src="require('../../images/minus.svg').default"
              @click="handleComponentMinus(index)"
            />
            <div v-if="selectedComponents.length" class="detailed-item-number">
              {{ selectedComponents[index].count }}
            </div>
            <img
              :src="require('../../images/plus.svg').default"
              @click="handleComponentPlus(index)"
            />
          </div>
        </div>
      </form>
    </f7-block>

    <div
      v-if="selectedModificatorGroup"
      @click="selectedModificatorGroup = null"
    >
      <primary-button
        class="info-submit-button add-to-basket"
        title="Выбрать"
      />
    </div>
    <div v-if="!selectedModificatorGroup && showBasket" @click="addToBasket">
      <primary-button
        class="info-submit-button add-to-basket"
        :title="currentPriceTitle"
      />
    </div>
  </f7-sheet>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Accordion from '../components/accordion'
import AppBar from '../components/appbar'
import PrimaryButton from '../components/primarybutton'

export default {
  props: ['data', 'components', 'openDetailed'],
  data() {
    return {
      selectedComponents: [],
      selectedModificators: [],
      screenHeight: window.height - 100,
      selectedModificatorGroup: null
    }
  },
  components: {
    Accordion,
    AppBar,
    PrimaryButton
  },
  mounted() {
    this.selectedComponents = this.components.map((item) => {
      return { count: 0, productId: item.id }
    })
    this.selectedModificators = this.uniqueModificators.map((item) => {
      // по умолчанию выбираем первый модификатор
      return {
        productModificatorId: this.data.modificators.filter(
          (prod) => prod.group === item
        )[0].id
      }
    })
  },
  computed: {
    currentPrice() {
      return (
        this.data.initialPrice +
        this.selectedModificators.reduce(
          (acc, cur) =>
            acc +
            this.data.modificators.find(
              (item) => item.id === cur.productModificatorId
            ).price,
          0
        ) +
        this.selectedComponents.reduce(
          (acc, cur) =>
            acc +
            this.components.find((item) => item.id === cur.productId).price *
              cur.count,
          0
        )
      )
    },
    currentPriceTitle() {
      return 'Добавить в корзину ' + this.currentPrice + ' ₽'
    },
    uniqueModificators() {
      // названия групп модификаторов (Размер, Объём, ...)
      return [...new Set(this.data.modificators.map((item) => item.group))]
    },
    showBasket() {
      return this.modules.find((item) => item.systemName === 'Module Delivery')
    },

    ...mapState({
      menu: (state) => state.menu,
      modules: (state) => state.modules
    })
  },
  methods: {
    addToBasket(e) {
      e.preventDefault()

      this.addBasket({
        ...this.data,
        price: this.currentPrice,
        count: 1,
        selectedComponents: this.selectedComponents.filter(
          (item) => item.count
        ),
        selectedModificators: this.selectedModificators,
        type: 'product'
      })

      this.$f7router.back()
    },
    handleComponentMinus(index) {
      if (this.selectedComponents[index].count)
        this.selectedComponents[index].count--
    },
    handleComponentPlus(index) {
      this.selectedComponents[index].count++
    },
    handleModificatorSelect(id) {
      this.selectedModificators[
        this.data.modificators.findIndex(
          (item) => item.group === this.selectedModificatorGroup
        )
      ].productModificatorId = id
    },
    handleClose() {
      this.$emit('closed')
    },
    modificatorsGroup(name) {
      return this.data.modificators.filter((item) => item.group === name)
    },
    modificatorSelected(modificator) {
      return this.selectedModificators.some(
        (item) => item.productModificatorId === modificator.id
      )
    },
    modificatorName(index) {
      if (!this.data.modificators.length || !this.selectedModificators.length) {
        return
      }

      return this.data.modificators.find(
        (item) =>
          this.selectedModificators[index].productModificatorId === item.id
      ).name
    },

    ...mapActions(['addBasket'])
  }
}
</script>
