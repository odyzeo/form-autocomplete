# zeo-form-autocomplete

Simple autocomplete Vue.js component.

## Installation

### npm

```
npm install --save zeo-form-autocomplete
```

### yarn

```
yarn add zeo-form-autocomplete
```

Import component in your where you want to use it and register it:

```
import 'Autocomplete' from 'zeo-form-autocomplete';
export default {
  components: { Autocomplete },
}
```

Import styles or make your own.

```
import 'zeo-form-autocomplete/dist/zeo-form-autocomplete.css';
```

## Usage

```
<template>
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
</template>
```

<script>
import ZeoFormAutocomplete from 'zeo-form-autocomplete'

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

## Options
