import Cookies from 'universal-cookie';

class CookieService {
  constructor() {
    this.cookie = new Cookies();
  }

  get(key) {
    return this.cookie.get(key);
  }

  set(key, value, options) {
    this.cookie.set(key, value, options);
  }

  remove(key) {
    this.cookie.remove(key);
  }
}

export default new CookieService();
