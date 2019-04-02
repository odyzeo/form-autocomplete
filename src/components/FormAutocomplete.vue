<template>
    <div
        :class="{
            'form-item--filled': !isEmpty,
            'form-item--error': formErrors.length && showFormErrors,
            'form-item--tags': tags && selected.length > 0,
            'form-item--tags-filled': tags && selected.length > 0 && focus,
        }"
        class="form-item"
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
                    :key="specialId"
                    :for="uid"
                    class="form-item__tags"
                >
                    <div
                        v-for="(s, i) in localValue"
                        :key="i"
                        :class="{'is-active': s.active}"
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
                    :id="uid"
                    ref="input"
                    v-model.trim="query"
                    :disabled="disabled"
                    :placeholder="placeholder"
                    autocomplete="off"
                    class="form-item__input form-item__input--autocomplete"
                    type="text"
                    @blur.prevent="onBlur"
                    @focus="onFocus"
                    @input="updateSearch($event)"
                    @keydown.delete="onDelete"
                    @keydown.down.prevent="onDown"
                    @keydown.enter.prevent="selectCurrent"
                    @keydown.esc="onEsc"
                    @keydown.up.prevent="onUp"
                >
                <label
                    :for="uid"
                    class="form-item__label"
                >
                    <slot name="label">
                        Label
                    </slot>
                </label>
            </div>

            <slot name="append">
                <div class="form-item__readonly-icon form-item__readonly-icon--right">
                    <span class="icon icon-caret-down"></span>
                </div>
            </slot>

            <transition :name="transitionName">
                <div
                    v-show="showDropdown"
                    ref="list"
                    :style="{ maxHeight: (limitMaxHeight ? `${maxHeight}px` : '') }"
                    class="form-item__dropdown"
                >
                    <div
                        v-for="(item, index) in filteredItems"
                        :key="item.id || index"
                        :class="{ 'is-active': activeClass(index) }"
                        class="form-item__dropdown-item"
                        @mousedown="selectCurrent()"
                        @mouseover="current = index"
                    >
                        <slot
                            :item="item"
                            name="item"
                        >
                            {{ item[optionKey] }}
                        </slot>
                    </div>
                    <slot name="after-list">
                    </slot>
                </div>
            </transition>
            <ul
                v-if="showNoResults && !isTyping"
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
            <!--eslint-disable vue/no-v-html-->
            <div
                v-for="(error, index) in formErrors"
                :key="index"
                class="form-item__error"
                v-html="error"
            ></div>
            <!--eslint-enable vue/no-v-html-->
        </div>
    </div>
</template>

<script>
function not(fun) {
    return (...params) => !fun(...params);
}

const debounce = (callback, time) => {
    let interval;

    return (...args) => {
        clearTimeout(interval);

        interval = setTimeout(() => {
            interval = null;
            callback(...args);
        }, time);
    };
};

export default {
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        optionHeight: {
            type: Number,
            default: 38,
        },
        maxHeight: {
            type: Number,
            default: 190,
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
        confirmTagRemoval: {
            type: Boolean,
            default: false,
        },
        duplicates: {
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
            localValue: this.value,
            // eslint-disable-next-line no-underscore-dangle
            specialId: this._uid,
            isTyping: false,
            setTypingOnNoInput: debounce(() => {
                this.isTyping = false;
            }, 300),
        };
    },
    computed: {
        uid() {
            // eslint-disable-next-line no-underscore-dangle
            return `form-item-${this._uid}`;
        },
        selected() {
            return Array.isArray(this.localValue) ? this.localValue : [this.localValue];
        },
        hasItems() {
            return this.filteredItems.length > 0;
        },
        filteredItems() {
            let options;

            if (this.canShowAllData) {
                let tempFilteredItems = this.data;

                this.selected.forEach(() => {
                    tempFilteredItems = tempFilteredItems.filter(not(this.isSelected));
                });

                options = !this.duplicates ? tempFilteredItems : this.data;

                return options;
            }

            options = this.options.concat();
            options = !this.duplicates ? options.filter(not(this.isSelected)) : options;

            return options;
        },
        isEmpty() {
            return this.query === '';
        },
        pointerPosition() {
            return this.current * this.optionHeight;
        },
        hasData() {
            return this.data.length > 0;
        },
        canShowAllData() {
            return this.hasData && this.isEmpty;
        },
        showDropdown() {
            return this.focus && ((this.hasItems && !this.isEmpty) || this.canShowAllData);
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
        value(value) {
            this.localValue = value;
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
            if (item) {
                if (this.tags) {
                    this.resetActiveTags();

                    this.$emit('input', [...this.selected, item]);
                } else {
                    this.$emit('input', [item]);
                }
            }

            if (this.tags && this.clearOnSelect) {
                this.clear();
            } else {
                if (item !== null) {
                    this.query = item[this.optionKey];
                }

                this.updateSearch();
            }

            if (this.closeOnSelect) {
                this.close();
            }
        },
        selectCurrent() {
            if (this.current !== -1) {
                const currentItem = this.filteredItems[this.current];

                this.$emit('selected', currentItem);

                this.onSelect(currentItem);
                this.reset();
            } else {
                this.$emit('selected', this.query);
                this.onSelect(null);
            }
        },
        onFocus() {
            this.focus = true;
        },
        onBlur() {
            this.reset();

            if (this.clearOnSelect) {
                this.clear();
            }

            if (this.tags) {
                this.resetActiveTags();
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

            const { scrollTop } = this.$refs.list;
            if (
                scrollTop < this.pointerPosition
                && (scrollTop + this.maxHeight - this.optionHeight) > this.pointerPosition
            ) {
                return;
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
            if (this.isEmpty && this.selected.length !== 0) {
                this.removeTag(this.selected.length - 1, true);
            }
        },
        updateSearch() {
            this.showFormErrors = false;

            this.toggleTyping();

            if (this.tags) {
                this.resetActiveTags();
            }

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
            this.reset();

            this.$refs.input.blur();
        },
        removeTag(index, keypress) {
            if (this.confirmTagRemoval) {
                if (keypress && !this.localValue[index].active) {
                    this.localValue[index].active = true;
                    this.randomizeId();

                    return;
                }

                this.resetActiveTags();
            }

            const newValue = [
                ...this.localValue.slice(0, index),
                ...this.localValue.slice(index + 1),
            ];
            this.$emit('input', newValue);
        },
        isSelected(option) {
            return this.selected.findIndex(s => JSON.stringify(s) === JSON.stringify(option)) > -1;
        },
        randomizeId() {
            // eslint-disable-next-line no-underscore-dangle
            this.specialId = `${this._uid}-${Math.random()}`;
        },
        resetActiveTags() {
            if (this.confirmTagRemoval) {
                this.localValue.forEach((item) => {
                    delete item.active;
                });
            }
        },
        toggleTyping() {
            this.isTyping = true;
            this.setTypingOnNoInput();
        },
    },
};
</script>

<style lang="less">
@import '../less/form-autocomplete.less';
</style>
