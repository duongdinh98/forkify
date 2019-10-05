import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if((acc + cur.length) <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>   
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (curPage, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? curPage - 1 : curPage + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? curPage - 1 : curPage + 1}</span>
    </button>    
`;

const renderButton = (curPage, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);

    let button;
    if(curPage === 1 && pages > 1){
        // render onl next button
        button = createButton(curPage, 'next');
    }else if(curPage < pages){
        // both button
        button = `
            ${createButton(curPage, 'prev')}
            ${createButton(curPage, 'next')}
        `;
    }else if(curPage === pages && pages > 1){
        // render onl prev button
        button = createButton(curPage, 'prev')
    }

    elements.searchResPage.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    
    // render pagination button
    renderButton(page, recipes.length, resPerPage);
}