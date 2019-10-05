import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(){
        const key = '31e03ea0c6b1b447ebbb0d636e253f1e';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        }
        catch(err){
            alert(err);
        }
    }
}