<template>
    <div
        id="app"
        class="app"
    >
        <div class="container">
            <h1>Demo 1</h1>

            <p>Using autocomplete as search with rerouting user to url of found item</p>

            <form-autocomplete
                :limit-max-height="false"
                :loading="isSearchLoading"
                :option-key="'name'"
                :options="filteredProducts"
                :placeholder="'Type to search'"
                :clear-on-select="false"
                :debounce="200"
                @search-change="searchProduct"
                @selected="openLink($event)"
            >
                <template
                    #label
                >
                    Product name
                </template>

                <template #item="{ item }">
                    <div class="search-item__left">
                        <img
                            :src="item.image"
                            class="search-item__image"
                        >
                    </div>

                    <div class="search-item__right">
                        <div class="search-item__title">
                            <a :href="item.url">
                                {{ item.name }}
                            </a>
                        </div>

                        <div
                            class="search-item__price"
                        >
                            Price: {{ item.price }} &euro;
                        </div>

                        <div class="search-item__code">
                            Product Code: {{ item.code }}
                        </div>
                    </div>
                </template>

                <template #no-results>
                    Nothing found
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

            <h1>Demo 2</h1>

            <p>Using autocomplete for searching and selecting multiple items/tags</p>

            <form-autocomplete
                v-model="selectedPeople"
                :clear-on-select="false"
                :close-on-select="false"
                :data="people"
                :loading="isSearchLoading"
                :option-key="'name'"
                :options="filteredPeople"
                :placeholder="'Type to search'"
                confirm-tag-removal
                tags
                @search-change="searchPeople"
            >
                <template
                    #label
                >
                    Participants
                </template>

                <template
                    #tag="{ item }"
                >
                    {{ item.name }}
                </template>

                <template
                    #item="{ item }"
                >
                    {{ item.name }}
                </template>

                <template #no-results>
                    Participants not found
                </template>

                <template #loading>
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
import FormAutocomplete from '@/components/FormAutocomplete';
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
            minSearchLength: 3,
        };
    },
    methods: {
        openLink(item) {
            if (typeof item === 'string') {
                if (this.isQueryValid(item)) {
                    this.isSearchLoading = false;

                    return;
                }

                window.location = `/#${item}`;
                // Generate search page with returned query
                return;
            }

            window.location = item.url;
        },
        searchProduct(query) {
            this.isSearchLoading = true;

            if (this.isQueryValid(query)) {
                this.isSearchLoading = false;

                return;
            }

            this.startSearchingProducts(query);
        },
        searchPeople(query) {
            this.isSearchLoading = true;

            if (this.isQueryValid(query)) {
                this.isSearchLoading = false;

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
        isQueryValid(query) {
            return query.length < this.minSearchLength || query === '';
        },
    },
};
</script>

<style lang="less">
    @import '../src/less/app.less';
</style>
