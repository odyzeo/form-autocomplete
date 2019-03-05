# @odyzeo/form-autocomplete

Simple autocomplete Vue.js component with ability to select multiple options, 
keyboard usage, and multiple options to choose from. 

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
    :placeholder="'Type to search'"
    :options="filteredItems"
    :option-id="'name'"
    :loading="isSearchLoading"  
    select-first
    @selected="openLink($event)"
    @search-change="search"
  >
    <template
      #label
    >
      Participants
    </template>
          
    <template #item="{ item }">
      {{ item.name }}
    </template>
    
    <template #no-results>
      Participants not found
    </template>
    
    <template #loading>
      ...loading...
    </template>
    
    <template #after-list>
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

  <h1>Autocomplete - tags</h1>
  
  <form-autocomplete
    v-model="selectedTagItems"
    :placeholder="'Type to search'"
    :options="filteredItems"
    :option-id="'name'"
    :loading="isSearchLoading"
    :close-on-select="false"
    :clear-on-select="false"
    confirm-tag-removal
    tags
    select-first
    @search-change="search"
  >
    <template
      #label
    >
      Participants
    </template>
          
    <template #tag="{ item }">
      {{ item.name }}
    </template>
        
    <template #item="{ item }">
      {{ item.name }}
    </template>
    
    <template #no-results>
      Participants not found
    </template>
    
    <template #loading>
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
      this.isSearchLoading = true;

      if (query.length < this.minSearchLength || query === '') {
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
| `data` | array | `[]` | Array of all options, if provided - will show results on empty input as all provided data. Will show duplicates if `duplicates` prop is set to true |
| `options` | array | `[]` | Array of options to display, these should be influenced by outer search methods for example. |
| `optionHeight` | number | `38` | Single option height |
| `optionKey` | string | `name` | Name of the object key to get value displayed in dropdown |
| `value or v-model` | array | `[]` | Array of initial selected option(s) |
| `selectFirst` | boolean | `false` | Whether to auto select first value from dropdown options |
| `tags` | boolean | `false` | Whether to select multiple options - tags |
| `confirmTagRemoval` | boolean | `false` | Whether there should be a visualised confirmation when removing tags with keyboard |
| `duplicates` | boolean | `false` | Hide selected values from dropdown options, ensure no duplicates can be chosen |
| `maxHeight` | number | `190` | Dropdown options max height |
| `limitMaxHeight` | boolean | `true` | If results dropdown should have max-height, set to false if you limit amout of your results in your backend/api |
| `placeholder` | string | | Input `placeholer` attribute |
| `loading` | boolean | `false` | Show loading indicator |
| `disabled` | boolean | `false` | Set disabled input |
| `clearOnSelect` | boolean | `true` | Clear input on select |
| `closeOnSelect` | boolean | `true` | Hide dropdown on select |
| `formErrors` | array | `[]` | Array of errors to display |
| `transitionName` | string | `fade` | Name of css transition class |

## Slots
### label
Label value for input element.

### prepend
Div block before input element, use it to display an icon

### append
Div block after input element, use it to display an icon

### loading
What to display while loading, if loading prop is true

### tag
How a tag should look

### item
How a dropdown item should look

### no-results
Text to display if nothing if there are no results

### after-list
Use this to display some more information after the dropdown with results


## Development

```
npm run serve
```

or

```bash
yarn serve
```

