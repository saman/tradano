
var api = {
  baseUrl: 'https://cors-anywhere.herokuapp.com/api.coinmarketcap.com/v1/ticker',
  searchListUrl: 'https://s2.coinmarketcap.com/generated/search/quick_search.json',
};

const portfolio = localStorage.getItem('portfolio') ? JSON.parse(localStorage.getItem('portfolio')) : [];
const unit = localStorage.getItem('unit') || 'usd';

var defaultCoin = {
  uuid: '',
  id: '',
  realId: '',
  wallet: '',
  amount: '',
  price: '',
  priceSell: '',
  date: new Date(),
  dateSell: null,
  deactive: false,
  done: false,
  comment: '',
  tags: '',
  from: {}
}

moment().format();
Vue.use(Buefy.default, { defaultIconPack: 'fa' })

var app = new Vue({
  el: '#app',
  data: {
    searchList: [],
    filteredSearchList: [],
    selectedSearchListItem: {},
    selectedSearchListFromItem: {},
    portfolio,
    coin: defaultCoin,
    coin_temp: {},
    unit,
    editMode: false,
    addCoinToggle: false,
  },
  computed: {
    unitSymbol() {
      if (this.unit == 'eur') return '€';
      return "$";
    },
    sortedCoins() {
      return _.orderBy(this.portfolio, ['date'], ['asc'])
      // return _.orderBy(this.portfolio, ['deactive', 'value_usd', 'delete'], ['asc', 'desc', 'asc'])
    },
    sum() {
      return this.sumAssets(true)
    },
    sumAll() {
      return this.sumAssets(false)
    }
  },
  created: function () {
    document.getElementById('app').classList.remove('is-invisible');
    this.runApp();
  },
  watch: {
    unit: function (val) {
      localStorage.setItem('unit', val);
    },
    selectedSearchListItem: function (val) {
      if (val !== null) {
        this.coin.id = val.slug;
        this.coin.realId = val.id;
      }
    },
    selectedSearchListFromItem: function (val) {
      console.log(val);
      if (val !== null) {
        this.coin.from.id = val.slug;
        this.coin.from.realId = val.id;
        console.log(this.coin);
      }
    }
  },
  methods: {
    isJSON(str) {
      if (_.isNull(str)) return false
      return !_.isError(_.attempt(JSON.parse, str));
    },
    reset() {
      this.portfolio = [];
      this.savePortfolio();
      this.unit = 'usd';
      window.location.reload();
    },
    importFile(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function (event) {
        if (this.isJSON(event.target.result)) {
          this.portfolio = [];
          this.portfolio = JSON.parse(event.target.result)
          this.savePortfolio();
          this.runApp()
        }
      }.bind(this);

      reader.readAsText(file);
    },
    exportFile() {
      var text = JSON.stringify(this.portfolio, 0, 2);
      var filename = 'tradano-' + moment(new Date(), "YYYY-MM-DD") + '.json'
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    sumAssets (deleted) {
      var sum = 0;
      if (this.portfolio.length) {
        this.portfolio.forEach(item => {
          if (item && (item.price_usd || item.price_eur)) {
            price = this.unit === 'usd' ? item.price_usd : item.price_eur
            if (deleted && item.deactive) {
              price = 0;
            }
            if (item.done) {
              price = 0;
            }
            sum += price * item.amount
          }
        })
      }
      return sum;
    },
    getIndexById (item) {
      for (let [index, value] of Object.entries(this.portfolio)) {
        if (value && JSON.stringify(item) === JSON.stringify(value)) {
          return index
        }
      }
    },
    makeuuid (item) {
      var index = this.getIndexById(item)
      this.portfolio[index]['uuid'] = this.uuidv4();
      this.savePortfolio();
    },
    getIndexByUUID (item, list) {
      for (let [index, value] of Object.entries(list)) {
        if (value && item.uuid === value.uuid) {
          return index
        }
      }
    },
    savePortfolio () {
      var portfolio = JSON.stringify(this.portfolio);
      localStorage.setItem('portfolio', portfolio);
    },
    removeCoin () {
      var indexP = this.getIndexByUUID(this.coin, this.portfolio);
      this.portfolio.splice(indexP, 1);
      this.addCoinToggle = false;
      this.savePortfolio();
    },
    addCoin (item) {
      if (item !== undefined) {
        this.editMode = true
        this.coin_temp = item;
        this.coin = { ...item };
        this.coin.from = { ...item.from };
        this.coin.date = new Date(this.coin.date);
        this.coin.date_sell = this.coin.date_sell ? new Date(this.coin.date_sell) : '';
      } else {
        this.selectedSearchListItem = {};
        this.coin = { ...defaultCoin };
        this.coin.uuid = this.uuidv4();
      }
      this.addCoinToggle = !this.addCoinToggle
    },
    toggleCoin (item, field) {
      if (field === 'done') {
        if (item.done) {
          this.unDoneCoin(item);
        } else {
          this.doneCoin(item);
        }
        item.done = !item.done;
      }
      this.savePortfolio();
    },
    doneCoin (item) {
      item.percent_change_1h = '';
      item.percent_change_7d = '';
      item.percent_change_24h = '';
      item.date_sell = new Date();
      if (!item.priceCell) {
        item.priceSell = item.price_btc;
      }      
    },
    unDoneCoin (item) {
      item.date_sell = '';
      this.getCoin(item);
    },
    editCoin () {
      if (this.editMode)
        this.editCoinSave()
      else
        this.addCoinSave()
    },
    cancelEditCoin () {
      this.addCoinToggle = false;
    },
    editCoinSave () {
      this.$http.get(`${api.baseUrl}/${this.coin.id}/?convert=EUR`).then(response => {
        this.$http.get(`${api.baseUrl}/${this.coin.from.id}/?convert=EUR`).then(to_response => {
          this.coin.from = { ...this.coin.from, ...to_response.body[0] };
          const new_data = this.calculateCoin(this.coin, response.body[0]);
          this.deepSave(new_data, this.coin_temp);
          this.addCoinToggle = false
          if (this.coin_temp.done) {
            this.doneCoin(this.coin_temp);
          }
          this.savePortfolio();
        });
      }, response => {
        console.log(response.body.error);
      });
    },
    addCoinSave () {
      this.$http.get(`${api.baseUrl}/${this.coin.id}/?convert=EUR`).then(response => {
        this.$http.get(`${api.baseUrl}/${this.coin.from.id}/?convert=EUR`).then(to_response => {
          this.coin.from = { ...this.coin.from, ...to_response.body[0] };
          this.portfolio.push(this.calculateCoin(this.coin, response.body[0]));
          this.savePortfolio();
          this.addCoinToggle = false
        });
      }, response => {
        console.log(response.body.error);
      });
    },
    calculateCoin(coin, item) {
      const price_eur = coin.price * item.price_eur / item.price_usd

      let more = {}

      if (coin.done) {
        more = {
          value_usd: coin.amount * (coin.priceSell || 0),
          profit_usd: (coin.priceSell || 0) * coin.amount - coin.price * coin.amount,
          profit: (coin.priceSell || 0) * coin.amount * 100 / (coin.price * coin.amount) - 100
        }
      } else {
        more = {
          value_usd: coin.amount * item.price_usd,
          value_eur: coin.amount * item.price_eur,
          profit_usd: item.price_usd * coin.amount - coin.price * coin.amount,
          profit_eur: item.price_eur * coin.amount - price_eur * coin.amount,
          profit: item.price_usd * coin.amount * 100 / (coin.price * coin.amount) - 100
        }
      }

      return { ...coin, ...item, ...more };
    },
    getSearchList () {
      this.$http.get(api.searchListUrl).then(response => {
        if (response.status === 200) {
          this.searchList = response.body;
        }
      });
    },
    findInSearchList (name) {
      // this.filteredSearchList = [];
      // _.debounce(() => {
      this.filteredSearchList = this.searchList.filter(x => JSON.stringify(x).toLowerCase().indexOf(name.toLowerCase()) >= 0).slice(0, 10);
      // }, 500);
    },
    getCoin (item) {
      item.loading = true;
      console.log(item.loading);
      this.$http.get(`${api.baseUrl}/${item.id}/?convert=EUR`).then(response => {
        this.$http.get(`${api.baseUrl}/${item.from.id}/?convert=EUR`).then(to_response => {
          delete item.loading;
          item.from = { ...item.from, ...to_response.body[0] };
          const new_data = this.calculateCoin(item, response.body[0]);
          // for (var k in item) item[k] = new_data[k];
          this.deepSave(new_data, item);
          this.savePortfolio();
        })
      }, error => {
        console.log(error);
        delete item.loading;
      });
    },
    runApp () {
      this.getSearchList();
      this.portfolio.forEach(item => {
        if (!item.done) {
          this.getCoin(item);
        }
      });
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    clone (obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    deepSave (source, target) {
      for (var k in source) target[k] = source[k];
    }
  },
  filters: {
    moment (value) {
      if (moment && value) return moment(value, "YYYY-MM-DD").fromNow(true);
      return '-'
    },
    unitSymbol () {
      if (this.unit == 'eur') return '€';
      return '$';
    },
    numberFormat (value, count = 10) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        const tmp = parseFloat(value).toFixed(count)
        return _.trimEnd(Intl.NumberFormat('en-US', {
          minimumFractionDigits: count
        }).format(tmp), ['.', '0']);
      }
      return '-'
    }
  }
})
