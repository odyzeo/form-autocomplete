<template>
  <div
    id="app"
    class="app"
  >
    <div class="container">
      <h1>Demo 1</h1>
      <p>Using autocomplete as search with rerouting user to url of found item</p>
      <form-autocomplete
        :label="'Product name'"
        :placeholder="'Type to search'"
        :options="filteredProducts"
        :option-key="'name'"
        :loading="isSearchLoading"
        :hide-selected="true"
        :select-first="true"
        :limit-max-height="false"
        :open-link-on-click="true"
        @search-change="searchProduct"
      >
        <template
          slot="item"
          slot-scope="props"
        >
          <div class="search-item__left">
            <img
              :src="props.item.image"
              class="search-item__image"
            >
          </div>

          <div class="search-item__right">
            <div class="search-item__title">
              <a :href="props.item.url">{{ props.item.name }}</a>
            </div>
            <div
              class="search-item__price"
            >
              Price: {{ props.item.price }} &euro;
            </div>
            <div class="search-item__code">
              Product Code: {{ props.item.code }}
            </div>
          </div>
        </template>
        <template v-slot:no-results>
          Nothing found
        </template>
        <template v-slot:loading>
          ...loading...
        </template>
        <template v-slot:after-list>
          <a
            v-if="linkToAllResults"
            :href="linkToAllResults.link"
            class="form-item__dropdown-item"
          >
            <div class="search-item__more">
              <span class="search-item__more-link">
                {{ linkToAllResults.text }}
              </span>
            </div>
          </a>
        </template>
      </form-autocomplete>

      <h1>Demo 2</h1>
      <p>Using autocomplete for searching and selecting multiple items/tags</p>
      <form-autocomplete
        v-model="selectedPeople"
        :label="'Participants'"
        :placeholder="'Type to search'"
        :options="filteredPeople"
        :option-key="'name'"
        :loading="isSearchLoading"
        :hide-selected="true"
        :tags="true"
        :select-first="true"
        @search-change="searchPeople"
      >
        <template
          v-slot:tag="props"
        >
          {{ props.item.name }}
        </template>
        <template
          v-slot:item="props"
        >
          {{ props.item.name }}
        </template>
        <template slot="no-results">
          Participants not found
        </template>
        <template slot="loading">
          ...loading...
        </template>
      </form-autocomplete>
      <div>
        <p>Selected items:</p>
        <pre>{{ selectedPeople }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import FormAutocomplete from '@/components/FormAutocomplete.vue';
import products from './data/products';

export default {
  name: 'App',
  components: {
    FormAutocomplete,
  },
  data() {
    return {
      selectedPeople: [
        { name: 'Zombi 1' },
      ],
      people: [
        { name: 'Denton' },
        { name: 'Pe4k' },
        { name: 'PaDi' },
        { name: 'Zoli 1' },
        { name: 'Zoli 2' },
        { name: 'Zoli 3' },
        { name: 'Zombi 1' },
        { name: 'Zombi 2' },
        { name: 'Zombi 3' },
        { name: 'Zombi 4' },
      ],
      products,
      filteredPeople: [],
      filteredProducts: [],
      isSearchLoading: false,
      linkToAllResults: {
        link: 'http://www.google.com',
        text: 'Show all results (42)',
      },
    };
  },
  methods: {
    searchProduct(query) {
      this.filteredProducts = [];
      this.isSearchLoading = true;

      if (query.length < this.minSearchLength) {
        return;
      }

      this.startSearchingProducts(query);
    },
    searchPeople(query) {
      this.filteredPeople = [];
      this.isSearchLoading = true;

      if (query.length < this.minSearchLength) {
        return;
      }

      this.startSearchingPeople(query);
    },
    startSearchingPeople(query) {
      this.filteredPeople = this.people.filter(item => item.name.toLowerCase()
        .includes(query.toLowerCase()));
      this.isSearchLoading = false;
    },
    startSearchingProducts(query) {
      this.filteredProducts = this.products.filter(item => item.name.toLowerCase()
        .includes(query.toLowerCase()));
      this.isSearchLoading = false;
    },
  },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
