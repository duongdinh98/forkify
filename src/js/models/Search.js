import axios from "axios";
import { key } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `http://127.0.0.1:6464/api/v1/search/${this.query}`
      );
      this.result = res.data.recipes;
    } catch (err) {
      alert(err);
    }
  }
}

// http://127.0.0.1:6464/api/v1/search/carrot
