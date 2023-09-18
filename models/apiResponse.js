class apiResponse {
  constructor() {
    this.movieList = [];
    this.userList = [];
    this.user = null;
    this.movie = null;
    this.message = "";
    this.success = true;
    this.data = null
  }
}

module.exports = apiResponse;
