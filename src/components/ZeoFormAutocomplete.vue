<template>
  <div
    :class="['input-block', {
      'input-block--error': formErrors.length && showFormErrors,
      'input-block--tags': selected.length > 0,
      'input-block--tags-filled': selected.length > 0 && focus,
  }]">

    <div class="input-block__field">
      <div
        v-show="loading"
        class="input-block__loading">
        <slot name="loading">
          ...
        </slot>
      </div>

      <div
        v-if="selected.length > 0"
        class="input-block__tags"
        @click="onTagsClick($event)">
        <div
          v-for="(s, i) in selected"
          :key="i"
          class="input-block__tag">
          <div class="input-block__tag-text">
            <slot
              :item="s"
              name="tag">
              {{ s.name }}
            </slot>
          </div>
          <div
            class="input-block__tag-remove"
            @click="removeTag(i)">
            x
          </div>
        </div>
      </div>

      <input
        ref="input"
        :disabled="disabled"
        :id="uid"
        :placeholder="placeholder"
        :value="query"
        type="text"
        class="input-block__input input-block__input--autocomplete"
        autocomplete="off"
        @focus="onFocus"
        @blur.prevent="onBlur"
        @keydown.delete="onDelete"
        @keydown.down="onDown"
        @keydown.up="onUp"
        @keydown.enter.prevent="onEnter"
        @keydown.esc="onEsc"
        @input="updateSearch($event)">
      <label
        :for="uid"
        class="input-block__label">
        {{ label }}
      </label>

      <ul
        v-show="hasItems && !isEmpty && focus"
        ref="list"
        :style="{ maxHeight: maxHeight + 'px' }"
        class="input-block__dropdown">
        <li
          v-for="(item, index) in filteredItems"
          :class="['input-block__dropdown-item', { 'is-active': activeClass(index) }]"
          :key="index"
          @mousedown="onClick(index)">
          <slot
            :item="item"
            name="item">
            {{ item.name }}
          </slot>
        </li>
      </ul>
      <ul
        v-if="showNoResults"
        class="input-block__dropdown input-block__dropdown--no-results">
        <li class="input-block__dropdown-item">
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
        class="input-block__error"
        v-html="error"/>
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
      required: false,
      default: 42,
    },
    maxHeight: {
      type: Number,
      required: false,
      default: 209,
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
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
    multiple: {
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
    optionId: {
      type: String,
      required: false,
      default: 'name',
    },
    formErrors: {
      type: Array,
      default: () => [],
    },
    selectFirst: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      current: -1,
      focus: false,
      query: '',
      visibleElements: this.maxHeight / this.optionHeight,
      showFormErrors: false,
    };
  },
  computed: {
    uid() {
      return `input-block-${this._uid}`;
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
      return this.query.trim() === '';
    },
    pointerPosition() {
      return this.current * this.optionHeight;
    },
    showNoResults() {
      return this.focus && !this.loading && !this.hasItems && !this.isEmpty;
    },
  },
  watch: {
    formErrors() {
      this.showFormErrors = true;
    },
    filteredItems() {
      if (this.selectFirst && this.current === -1) {
        this.current = 0;
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
      if (this.multiple) {
        this.$emit('input', [...this.selected, item]);
      } else {
        this.$emit('input', [item]);
      }

      if (this.clearOnSelect) {
        this.query = '';
      }

      if (this.closeOnSelect) {
        this.clear();
      }
    },
    onEnter() {
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
      this.clear();
      this.focus = false;
    },
    onClick(index) {
      this.current = index;

      if (this.current !== -1) {
        this.onSelect(this.filteredItems[this.current]);
        this.reset();
      }
    },
    onEsc() {
      this.reset();
      this.clear();
    },
    onUp() {
      if (this.current > 0) {
        this.current -= 1;
      } else if (this.current === -1) {
        // this.current = this.filteredItems.length - 1
      } else if (this.current === 0) {
        // this.current = this.filteredItems.length - 1
      } else {
        this.current = 0;
      }

      if (this.$refs.list.scrollTop >= this.pointerPosition) {
        this.$refs.list.scrollTop = this.pointerPosition;
      }
    },
    onDown() {
      if (this.current < this.filteredItems.length - 1) {
        this.current += 1;
      } else {
        // this.current = 0
      }

      if (
        this.$refs.list.scrollTop <=
        this.pointerPosition - (this.visibleElements * this.optionHeight)
      ) {
        this.$refs.list.scrollTop =
          this.pointerPosition - ((this.visibleElements - 1) * this.optionHeight);
      }
    },
    onDelete() {
      if (this.query.length === 0) {
        this.removeTag(this.selected.length - 1);
      }
    },
    onTagsClick(event) {
      if (this.focus) return;

      this.onFocus(event);
      setTimeout(() => {
        this.$refs.input.focus();
      });
    },
    updateSearch(event) {
      this.showFormErrors = false;
      this.query = event.target.value.trim();
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
@import '../../src/less/autocomplete.less';
</style>
