<template>
  <div
    id="app"
    class="app">
    <div class="container">
      <h1>Autocomplete</h1>
      <zeo-form-autocomplete
        v-model="selectedItems"
        :label="'Participants'"
        :placeholder="'Type to search'"
        :options="filteredItems"
        :option-id="'name'"
        :loading="isSearchLoading"
        :hide-selected="true"
        :close-on-select="false"
        :select-first="true"
        @search-change="search"
      >
        <template
          slot="tag"
          slot-scope="props">
          {{ props.item.name }}
        </template>
        <template
          slot="item"
          slot-scope="props">
          {{ props.item.name }}
        </template>
        <template slot="no-results">
          Participants not found
        </template>
        <template slot="loading">
          ...loading...
        </template>
      </zeo-form-autocomplete>
      <div>
        <p>Selected items:</p>
        <pre>{{ selectedItems }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import ZeoFormAutocomplete from '@/components/ZeoFormAutocomplete.vue';

export default {
  name: 'App',
  components: {
    ZeoFormAutocomplete,
  },
  data() {
    return {
      selectedItems: [],
      items: [
        { name: 'Denton' },
        { name: 'Pe4k' },
        { name: 'PaDi' },
        { name: 'Zoli' },
        { name: 'Zombi' },
      ],
      filteredItems: [],
      isSearchLoading: false,
    };
  },
  methods: {
    search(query) {
      this.filteredItems = [];
      this.isSearchLoading = true;

      if (query.length < this.minSearchLength) {
        return;
      }

      this.startSearching(query);
    },
    startSearching(query) {
      this.filteredItems = this.items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()));
      this.isSearchLoading = false;
    },
  },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
