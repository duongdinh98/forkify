// Global app controller
// axios like fetch() but compatible for all browsers, and immediately return JSON

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
    alert("aaa");
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
            recipeView.renderRecipe(states.recipe, states.likes.isLiked(id));
        }catch(err){
            alert('Something went wrong !' + err);
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */

 const controlList = () => {
    // create new List if there in none yet
    if(!states.list) states.list = new List();

    // add each ingredient to list
    states.recipe.ingredients.forEach(el => {
        const item = states.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
 };

//  Handle list edit and update list items events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from Model
        states.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    }
    // Handle count update
    else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value, 10);
        states.list.updateCount(id, val);
    }
});

/**
 * LIKE CONTROLLER
 */

// restore liked recipes on page load
window.addEventListener('load', () => {
    states.likes = new Likes();

    // restore data from localStorage
    states.likes.readLocalStorage();

    // show like menu
    likesView.toggleLikeMenu(states.likes.getNumsLiked());

    // render existing liked recipe was storaged
    states.likes.likes.forEach(el => likesView.renderLike(el));
});

const controlLike = () => {
    if(!states.likes) states.likes = new Likes();
    const currentID = states.recipe.id;

    // User has NOT yet liked current recipe
    if(!states.likes.isLiked(currentID)){
        // add like to states
        const newLike = states.likes.addLike(
            currentID, 
            states.recipe.title, 
            states.recipe.author, 
            states.recipe.img
        );
        // Toggle like button
        likesView.toggleLikeBtn(true);

        // Add to like tab UI
        likesView.renderLike(newLike);
    }
    // User HAS yet liked current recipe
    else{
        // Remove like from states
        states.likes.deleteLike(currentID);

        // Toggle like button
        likesView.toggleLikeBtn(false);

        // Remove to like tab UI
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(states.likes.getNumsLiked());
};
 

// Handling recipe button click
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(states.recipe.servings > 1){
            states.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(states.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        states.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(states.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // add ingredient to shopping list
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        // call like controller
        controlLike();
    }
});


window.test = states;