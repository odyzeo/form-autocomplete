# zeo-form-autocomplete

Simple autocomplete Vue.js component.

## Installation

### npm

```
npm install --save @odyzeo/form-autocomplete
```

### yarn

```
yarn add @odyzeo/form-autocomplete
```

Import component in your where you want to use it and register it:

```
import 'FormAutocomplete' from 'form-autocomplete';
export default {
  components: {
    FormAutocomplete,
  },
}
```

Import styles or make your own.

```
import 'form-autocomplete/dist/form-autocomplete.css';
```

## Usage

```
<template>
  <h1>Autocomplete - single</h1>
  <form-autocomplete
    v-model="selectedItems"
    :label="'Participants'"
    :placeholder="'Type to search'"
    :options="filteredItems"
    :option-id="'name'"
    :loading="isSearchLoading"
    :hide-selected="true"
    :select-first="true"
    @search-change="search"
  >
    <template
      slot="tag"
      slot-scope="props"
    >
      {{ props.item.name }}
    </template>
    <template
      slot="item"
      slot-scope="props"
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
  
  <h1>Autocomplete - tags</h1>
  <form-autocomplete
    v-model="selectedTagItems"
    :label="'Participants'"
    :placeholder="'Type to search'"
    :options="filteredItems"
    :option-id="'name'"
    :loading="isSearchLoading"
    :hide-selected="true"
    :tags="true"
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
  </form-autocomplete>
</template>
```

```
<script>
import FormAutocomplete from 'form-autocomplete'

export default {
  name: 'App',
  components: {
    FormAutocomplete,
  },
  data() {
    return {
      selectedItems: [],
      selectedTagItems: [
        { name: 'Zombi' },
      ],
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
        item.name.toLowerCase()
          .includes(query.toLowerCase()));
      this.isSearchLoading = false;
    },
  },
};
</script>
```

## Props

| Property name | Type | Default value | Description |
| ------------- | ---- | ------------- | ----------- |
| `optionHeight` | number | `38` | Single option height |
| `maxHeight` | number | `190` | Dropdown options max height |
| `label` | string | `''` | Label name for input |
| `placeholder` | string | | Input `placeholer` attribute |
| `loading` | boolean | `false` | Show loading indicator |
| `disabled` | boolean | `false` | Set disabled input |
| `clearOnSelect` | boolean | `true` | Clear input on select |
| `closeOnSelect` | boolean | `true` | Hide dropdown on select |
| `hideSelected` | boolean | `true` | Hide selected values from dropdown options |
| `value` | array | `[]` | Array of initial selected option(s) |
| `options` | array | `[]` | Array of options to display |
| `optionKey` | string | `name` | Name of the object key to get value displayed in dropdown |
| `formErrors` | array | `[]` | Array of errors to display |
| `selectFirst` | boolean | `false` | Whether to auto select first value from dropdown options |
| `tags` | boolean | `false` | Whether to select multiple options - tags |

## Development

```
npm run serve
```

or

```bash
yarn serve
```

