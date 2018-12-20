import { shallowMount } from '@vue/test-utils';
import FormAutocomplete from '@/components/FormAutocomplete.vue';

describe('FormAutocomplete.vue', () => {
  it('renders props.msg when passed', () => {
    const options = ['Hello', 'There'];
    const label = 'Participants';
    const placeholder = 'Type to search';

    const wrapper = shallowMount(FormAutocomplete, {
      propsData: {
        label,
        options,
        placeholder,
      },
    });
    expect(wrapper.text())
      .toMatch(label);
  });
});
