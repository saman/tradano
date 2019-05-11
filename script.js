
const api = {
  baseUrl: 'https://cors-anywhere.herokuapp.com/api.coinmarketcap.com/v1/ticker',
  searchListUrl: 'https://s2.coinmarketcap.com/generated/search/quick_search.json',
};

const portfolio = localStorage.getItem('portfolio') ? JSON.parse(localStorage.getItem('portfolio')) : [];
const unit = localStorage.getItem('unit') || 'dv';

const defaultCoin = {
  uuid: '',
  id: '',
  realId: '',
  wallet: '',
  amount: '',
  priceBuy: '',
  priceSell: '',
  dateBuy: new Date(),
  dateSell: '',
  deactive: false,
  done: false,
  comment: '',
  tags: '',
  loading: false,
  from: {}
}

moment().format();
Vue.use(Buefy.default, { defaultIconPack: 'fa' })

new Vue({
  el: '#app',
  data: {
    loading: { save: false },
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
      return '$';
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
      if (!_.isEmpty(val)) {
        this.coin.id = val.slug;
        this.coin.realId = val.id;
      }
    },
    selectedSearchListFromItem: function (val) {
      if (!_.isEmpty(val)) {
        this.coin.from.id = val.slug;
        this.coin.from.realId = val.id;
      }
    }
  },
  methods: {
    isJSON(str) {
      if (_.isNull(str)) return false
      return !_.isError(_.attempt(JSON.parse, str));
    },
    reset() {
      localStorage.clear();
      window.location.reload();
    },
    importFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
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
      const text = JSON.stringify(this.portfolio, 0, 2);
      const filename = 'tradano-' + moment(new Date(), 'YYYY-MM-DD') + '.json'
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    sumAssets(deleted) {
      let sum = 0;
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
    getIndexById(item) {
      for (let [index, value] of Object.entries(this.portfolio)) {
        if (value && JSON.stringify(item) === JSON.stringify(value)) {
          return index
        }
      }
    },
    makeuuid(item) {
      const index = this.getIndexById(item)
      this.portfolio[index]['uuid'] = this.uuidv4();
      this.savePortfolio();
    },
    getIndexByUUID(item, list) {
      for (let [index, value] of Object.entries(list)) {
        if (value && item.uuid === value.uuid) {
          return index
        }
      }
    },
    savePortfolio() {
      const portfolio = JSON.stringify(this.portfolio);
      localStorage.setItem('portfolio', portfolio);
    },
    removeCoin() {
      const indexP = this.getIndexByUUID(this.coin, this.portfolio);
      this.portfolio.splice(indexP, 1);
      this.addCoinToggle = false;
      this.savePortfolio();
    },
    addCoin(item) {
      this.selectedSearchListItem = {};
      this.selectedSearchListFromItem = {};
      if (item !== undefined) {
        this.editMode = true;
        this.coin_temp = item;
        this.coin = { ...item };
        this.coin.from = { ...item.from };
        this.coin.dateBuy = new Date(this.coin.dateBuy);
        this.coin.dateSell = this.coin.dateSell ? new Date(this.coin.dateSell) : '';
      } else {
        this.editMode = false;
        this.coin = { ...defaultCoin };
        this.coin.uuid = this.uuidv4();
      }
      this.addCoinToggle = !this.addCoinToggle
    },
    toggleCoin(item, field) {
      if (field === 'done') {
        if (item.done) {
          this.unDoneCoin(item);
        } else {
          this.doneCoin(item);
        }
      }

      item[field] = !item[field];
      this.savePortfolio();
    },
    doneCoin(item) {
      item.percent_change_1h = '';
      item.percent_change_7d = '';
      item.percent_change_24h = '';
      item.dateSell = new Date();
      if (!item.priceSell) {
        item.priceSell = item.price_btc;
      }
    },
    unDoneCoin(item) {
      item.dateSell = '';
      this.getCoin(item);
    },
    editCoin() {
      if (!this.loading.save) {
        if (this.editMode) {
          this.editCoinSave();
        }
        else {
          this.addCoinSave();
        }
      }
    },
    copyToClipboard(item) {
      const data = {
        symbol: item.symbol + item.from.symbol,
        price: item.priceBuy,
        precent: '-5',
        mode: '<=',
      };
      str = '/add\n\n' + JSON.stringify(data, 0, 5);
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },
    cancelEditCoin() {
      this.addCoinToggle = false;
    },
    editCoinSave() {
      this.loading.save = true;
      this.$http.get(`${api.baseUrl}/${this.coin.id}/?convert=EUR`).then(response => {
        this.$http.get(`${api.baseUrl}/${this.coin.from.id}/?convert=EUR`).then(to_response => {
          this.coin.from = { ...this.coin.from, ...to_response.body[0] };
          const new_data = this.calculateCoin(this.coin, response.body[0]);
          this.deepSave(new_data, this.coin_temp);
          this.loading.save = false;
          this.addCoinToggle = false
          if (this.coin_temp.done) {
            this.doneCoin(this.coin_temp);
          }
          this.savePortfolio();
        }, error => {
          this.loading.save = false;
          console.log(error.body.error);
        });
      }, error => {
        this.loading.save = false;
        console.log(error.body.error);
      });
    },
    addCoinSave() {
      this.loading.save = true;
      this.$http.get(`${api.baseUrl}/${this.coin.id}/?convert=EUR`).then(response => {
        this.$http.get(`${api.baseUrl}/${this.coin.from.id}/?convert=EUR`).then(to_response => {
          this.coin.from = { ...this.coin.from, ...to_response.body[0] };
          this.portfolio.push(this.calculateCoin(this.coin, response.body[0]));
          this.savePortfolio();
          this.loading.save = false;
          this.addCoinToggle = false
        }, error => {
          this.loading.save = false;
          console.log(error.body.error);
        });
      }, error => {
        this.loading.save = false;
        console.log(error.body.error);
      });
    },
    calculateCoin(coin, item) {
      const price_eur = coin.price * item.price_eur / item.price_usd

      let more = {}
      if (coin.done) {
        more = {
          valueSell: this.isNumber(coin.priceSell) ? coin.amount * (coin.priceSell || 0) : null,
          profit: ((coin.priceSell > 0 ? coin.priceSell : item.price_btc) - coin.priceBuy) * coin.amount,
          profit_per: (1 - ((coin.priceBuy > 0 ? coin.priceBuy : item.price_btc) / coin.priceSell)) * 100,
        }
      } else {
        more = {
          valueBuy: coin.amount * coin.priceBuy,
          // valueBuy_usd: coin.amount * coin.priceBuy,
          valueSell: this.isNumber(coin.priceSell) ? coin.amount * coin.priceSell : null,
          valueCurrent: {
            dv: coin.amount * (item.price_btc / coin.from.price_btc),
            btc: coin.amount * item.price_btc,
            usd: coin.amount * item.price_usd,
            eur: coin.amount * item.price_eur
          },
          profit: ((coin.priceSell > 0 ? coin.priceSell : item.price_btc) - coin.priceBuy) * coin.amount,
          profit_per: (1 - (coin.priceBuy / (coin.priceSell > 0 ? coin.priceSell : item.price_btc))) * 100,

        }

        console.log(more);
      }

      return { ...coin, ...item, ...more };
    },
    getSearchList() {
      this.$http.get(api.searchListUrl).then(response => {
        if (response.status === 200) {
          this.searchList = response.body;
        }
      });
    },
    findInSearchList(name) {
      // this.filteredSearchList = [];
      // _.debounce(() => {
      this.filteredSearchList = this.searchList.filter(x => JSON.stringify(x).toLowerCase().indexOf(name.toLowerCase()) >= 0).slice(0, 10);
      // }, 500);
    },
    getCoin(item) {
      item.loading = true;
      this.$http.get(`${api.baseUrl}/${item.id}/?convert=EUR`).then(response => {
        this.$http.get(`${api.baseUrl}/${item.from.id}/?convert=EUR`).then(to_response => {
          item.loading = false;
          item.from = { ...item.from, ...to_response.body[0] };
          const new_data = this.calculateCoin(item, response.body[0]);
          this.deepSave(new_data, item);
          this.savePortfolio();
        })
      }, error => {
        console.log(error);
        item.loading = false;
      });
    },
    runApp() {
      this.getSearchList();
      this.portfolio.forEach(item => {
        if (!item.done) {
          this.getCoin(item);
        }
      });
    },
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    deepSave(source, target) {
      for (let k in source) target[k] = source[k];
    },
    isNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
  },
  filters: {
    moment(value) {
      if (moment && value) return moment(value, 'YYYY-MM-DD').fromNow(true);
      return '-'
    },
    unitSymbol() {
      if (this.unit == 'eur') return '€';
      return '$';
    },
    numberFormat(value, count = 10) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        const tmp = parseFloat(value).toFixed(count)
        return _.trimEnd(_.trimEnd(Intl.NumberFormat('en-US', {
          minimumFractionDigits: count
        }).format(tmp), '0'), '.');
      }
      return '-'
    }
  }
})
