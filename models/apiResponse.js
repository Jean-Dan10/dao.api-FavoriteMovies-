class apiResponse {
  constructor() {
      this.movieList = [];
      this.userList = [];
      this.user = null;
      this.movie = null;
      this.message = '';
      this.success = true;
  }

 
  getMovieList() {
      return this.movieList;
  }

  setMovieList(value) {
      this.movieList = value;
  }


  getUserList() {
      return this.userList;
  }

  setUserList(value) {
      this.userList = value;
  }

 
  getUser() {
      return this.user;
  }

  setUser(value) {
      this.user = value;
  }

  
  getMovie() {
      return this.movie;
  }

  setMovie(value) {
      this.movie = value;
  }

 
  getMessage() {
      return this.message;
  }

  setMessage(value) {
      this.message = value;
  }


  getSuccess() {
      return this.success;
  }

  setSuccess(value) {
      this.success = value;
  }
}

module.exports = apiResponse;