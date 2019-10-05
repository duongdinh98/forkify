// Global app controller
// API de436be06b7ba0b8e3d0ec04de248516 31e03ea0c6b1b447ebbb0d636e253f1e
// https://www.food2fork.com/api/search
// axios like fetch() but compatible for all browsers, and immediately return JSON

import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/**
 * Global 'states' of the app
 * - Search objects
 * - Currrent recipe objects
 * - Shopping list objects
 * - Liked recipe objects
 */
const states = {};

const controlSearch = async () => {
    // 1- Get query from Views
    const query = searchView.getInput();
    console.log(query);

    if(query){
        // 2- New Search obj and add it to states
        states.search = new Search(query);

        // 3- Prepare UI for result
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        // 4- Search for recipes
        await states.search.getResults();

        // 5- Render result to UI
        clearLoader();
        searchView.renderResults(states.search.result);

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(states.search.result, goToPage);
    }
});