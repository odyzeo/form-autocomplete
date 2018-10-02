/* eslint-disable */
import Vue from 'vue';
import ZeoFormAutocomplete from './ZeoFormAutocomplete.vue';

const Components = {
  ZeoFormAutocomplete
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;
