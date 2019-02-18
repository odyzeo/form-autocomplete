<template>
  <div
    class="form-item"
    :class="{
      'form-item--filled': !isEmpty,
      'form-item--error': formErrors.length && showFormErrors,
      'form-item--tags': tags && selected.length > 0,
      'form-item--tags-filled': tags && selected.length > 0 && focus,
    }"
  >
    <div class="form-item__field">
      <slot name="prepend"></slot>

      <div class="form-item__wrapper">
        <div
          v-show="loading"
          class="form-item__loading"
        >
          <slot name="loading">
            ...
          </slot>
        </div>

        <label
          v-if="showTags"
          :for="uid"
          class="form-item__tags"
        >
          <div
            v-for="(s, i) in selected"
            :key="i"
            class="form-item__tag"
          >
            <div class="form-item__tag-text">
              <slot
                :item="s"
                name="tag"
              >
                {{ s[optionKey] }}
              </slot>
            </div>
            <div
              class="form-item__tag-remove"
              @mousedown="removeTag(i)"
            >
              x
            </div>
          </div>
        </label>

        <input
          ref="input"
          :disabled="disabled"
          :id="uid"
          :placeholder="placeholder"
          v-model.trim="query"
          type="text"
          class="form-item__input form-item__input--autocomplete"
          autocomplete="off"
          @focus="onFocus"
          @blur.prevent="onBlur"
          @keydown.delete="onDelete"
          @keydown.down.prevent="onDown"
          @keydown.up.prevent="onUp"
          @keydown.enter.prevent="onEnter"
          @keydown.esc="onEsc"
          @input="updateSearch($event)"
        >
        <label
          :for="uid"
          class="form-item__label"
        >
          {{ label }}
        </label>
      </div>

      <slot name="append">
        <div class="form-item__readonly-icon form-item__readonly-icon--right">
          <span class="icon icon-caret-down"></span>
        </div>
      </slot>

      <transition :name="transitionName">
        <ul
          v-show="hasItems && !isEmpty && focus"
          ref="list"
          :style="{ maxHeight: (limitMaxHeight ? `${maxHeight}px` : '') }"
          class="form-item__dropdown"
        >
          <li
            v-for="(item, index) in filteredItems"
            class="form-item__dropdown-item"
            :class="{ 'is-active': activeClass(index) }"
            :key="item.id || index"
            @mousedown="onClick(item, index)"
          >
            <slot
              :item="item"
              name="item"
            >
              {{ item[optionKey] }}
            </slot>
          </li>
          <slot name="after-list">
          </slot>
        </ul>
      </transition>
      <ul
        v-if="showNoResults"
        class="form-item__dropdown form-item__dropdown--no-results"
      >
        <li class="form-item__dropdown-item">
          <slot name="no-results">
            No results found
          </slot>
        </li>
      </ul>
    </div>

    <div v-if="showFormErrors">
      <div
        v-for="(error, index) in formErrors"
        :key="index"
        class="form-item__error"
        v-html="error"
      ></div>
    </div>
  </div>
</template>

<script>
function not(fun) {
  return (...params) => !fun(...params);
}

export default {
  props: {
    optionHeight: {
      type: Number,
      default: 38,
    },
    maxHeight: {
      type: Number,
      default: 190,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearOnSelect: {
      type: Boolean,
      default: true,
    },
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    hideSelected: {
      type: Boolean,
      default: true,
    },
    value: {
      type: null,
      default() {
        return [];
      },
    },
    options: {
      type: Array,
      required: true,
    },
    optionKey: {
      type: String,
      default: 'name',
    },
    formErrors: {
      type: [Array, Object],
      default: () => [],
    },
    selectFirst: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Boolean,
      default: false,
    },
    transitionName: {
      type: String,
      default: 'fade',
    },
    limitMaxHeight: {
      type: Boolean,
      default: true,
    },
    openLinkOnClick: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let query = '';

    if (!this.tags && Array.isArray(this.value) && this.value.length > 0) {
      query = this.value[0][this.optionKey];
    }

    return {
      current: -1,
      focus: false,
      query,
      visibleElements: this.maxHeight / this.optionHeight,
      showFormErrors: false,
    };
  },
  computed: {
    uid() {
      return `form-item-${this._uid}`;
    },
    selected() {
      return Array.isArray(this.value) ? this.value : [this.value];
    },
    hasItems() {
      return this.filteredItems.length > 0;
    },
    filteredItems() {
      let options = this.options.concat();

      options = this.hideSelected ? options.filter(not(this.isSelected)) : options;

      return options;
    },
    isEmpty() {
      return this.query === ''
        && (!this.tags || (this.tags && this.selected.length > 0));
    },
    pointerPosition() {
      return this.current * this.optionHeight;
    },
    showNoResults() {
      return this.focus && !this.loading && !this.hasItems && !this.isEmpty;
    },
    showTags() {
      return this.tags && this.selected.length > 0;
    },
  },
  watch: {
    formErrors() {
      this.showFormErrors = true;
    },
    filteredItems(items) {
      if (items.length > 0 && this.selectFirst && this.current === -1) {
        this.current = 0;
      } else if (items.length < (this.current - 1) && items.length > 0) {
        this.current = 0;
      } else if (items.length < (this.current - 1) && items.length === 0) {
        this.current = -1;
      } else if (items.length === 0) {
        this.current = -1;
      }
    },
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.reset();
      }
    });
  },
  methods: {
    onSelect(item) {
      if (this.tags) {
        this.$emit('input', [...this.selected, item]);
      } else {
        this.$emit('input', [item]);
      }

      if (this.tags && this.clearOnSelect) {
        this.clear();
      } else {
        this.query = item[this.optionKey];
      }

      if (this.closeOnSelect) {
        this.close();
      }
    },
    onEnter() {
      if (this.openLinkOnClick && this.current !== -1 && this.filteredItems[this.current].url) {
        window.location = this.filteredItems[this.current].url;
        return;
      }
      if (this.current !== -1) {
        this.onSelect(this.filteredItems[this.current]);
        this.reset();
      }
    },
    onFocus() {
      this.focus = true;
    },
    onBlur() {
      this.reset();
      if (this.tags) {
        this.clear();
      } else {
        setTimeout(() => {
          if (this.isEmpty) {
            this.$emit('input', []);
          } else {
            // Always last value, do not enable user to enter non existing value
            // Not working in safari
            // this.query = this.value.length > 0 ? this.value[0][this.optionKey] : '';
          }
        });
      }
      this.focus = false;
    },
    onClick(item, index) {
      if (this.openLinkOnClick && item.url) {
        window.location = item.url;
        return;
      }
      this.current = index;

      if (this.current !== -1) {
        this.onSelect(this.filteredItems[this.current]);
        this.reset();
      }
    },
    onEsc() {
      this.reset();
      if (this.tags) {
        this.clear();
      }
      this.close();
    },
    onUp() {
      if (!this.hasItems) return;
      if (this.current > 0) {
        this.current -= 1;
      } else if (this.current <= 0) {
        this.current = this.filteredItems.length - 1;
      } else {
        this.current = 0;
      }

      this.$refs.list.scrollTop = this.pointerPosition;
    },
    onDown() {
      if (!this.hasItems) return;
      if (this.current < this.filteredItems.length - 1) {
        this.current += 1;
      } else {
        this.current = 0;
      }

      if (
        this.$refs.list.scrollTop <= this.pointerPosition
        - (this.visibleElements * this.optionHeight)
        || this.$refs.list.scrollTop > this.pointerPosition
      ) {
        this.$refs.list.scrollTop = this.pointerPosition
          - ((this.visibleElements - 1) * this.optionHeight);
      }
    },
    onDelete() {
      if (this.query.length === 0) {
        this.removeTag(this.selected.length - 1);
      }
    },
    updateSearch() {
      this.showFormErrors = false;
      this.$emit('search-change', this.query);
    },
    activeClass(index) {
      return this.current === index;
    },
    reset() {
      this.current = -1;
    },
    clear() {
      this.query = '';
    },
    close() {
      this.$refs.input.blur();
    },
    removeTag(index) {
      const newValue = [...this.selected.slice(0, index), ...this.selected.slice(index + 1)];
      this.$emit('input', newValue);
    },
    isSelected(option) {
      return this.selected.findIndex(s => JSON.stringify(s) === JSON.stringify(option)) > -1;
    },
  },
};
</script>

<style lang="less">
@import '../less/form-autocomplete.less';
</style>
