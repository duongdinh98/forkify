// Global app controller
// API de436be06b7ba0b8e3d0ec04de248516 31e03ea0c6b1b447ebbb0d636e253f1e
// https://www.food2fork.com/api/search
// axios like fetch() but compatible for all browsers, and immediately return JSON

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';

/**
 * Global 'states' of the app
 * - Search objects
 * - Currrent recipe objects
 * - Shopping list objects
 * - Liked recipe objects
 */
const states = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1- Get query from Views
    const query = searchView.getInput();

    if(query){
        // 2- New Search obj and add it to states
        states.search = new Search(query);

        // 3- Prepare UI for result
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try{
            // 4- Search for recipes
            await states.search.getResults();

            // 5- Render result to UI
            clearLoader();
            searchView.renderResults(states.search.result);
        }catch(err){
            clearLoader();
            alert('Something went wrong !');
        }

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

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    // get ID from URL 
    const id = window.location.hash.replace('#', ''); //Return hashcode in the URL bar

    if(id){
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected
        if(states.search) searchView.highlightSelected(id);

        // create new recipe obj
        states.recipe = new Recipe(id);

        try{
            // get recipe data
            await states.recipe.getRecipe();
            states.recipe.parseIngredients();

            // calculate servings and time
            states.recipe.calcTime();
            states.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(states.recipe, false);
        }catch(err){
            alert('Something went wrong !' + err);
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(states.recipe.servings > 1){
            states.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(states.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        states.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(states.recipe);
    }
});