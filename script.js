var apiBaseUrl = 'https://cors-anywhere.herokuapp.com/api.coinmarketcap.com/v1/ticker';
const portfolio = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];

var defaultCoin = {
  uuid: '',
  id: '',
  wallet: '',
  amount: '',
  price: '',
  price_sell: '',
  date: new Date(),
  date_sell: '',
  deactive: false,
  delete: false,
}

moment().format();
Vue.use(Buefy.default, { defaultIconPack: 'fa' })

var app = new Vue({
  el: '#app',
  data: {
    portfolio: portfolio,
    coin: defaultCoin,
    coins: portfolio, // [{ "id": "trust", "name": "WeTrust", "symbol": "TRST", "rank": "203", "price_usd": "1.03444", "price_btc": "0.00007327", "24h_volume_usd": "1702150.0", "market_cap_usd": "95321060.0", "available_supply": "92147500.0", "total_supply": "100000000.0", "max_supply": "100000000.0", "percent_change_1h": "-2.28", "percent_change_24h": "-13.16", "percent_change_7d": "-3.96", "last_updated": "1516033451", "price_eur": "0.8427137871", "24h_volume_eur": "1386668.41255", "market_cap_eur": "77653969.0", "wallet": "", "amount": "250.055348", "price": "1.1", "date": "2018-01-12" }, { "id": "litecoin", "name": "Litecoin", "symbol": "LTC", "rank": "6", "price_usd": "240.069", "price_btc": "0.0170045", "24h_volume_usd": "640509000.0", "market_cap_usd": "13148287003.0", "available_supply": "54768783.0", "total_supply": "54768783.0", "max_supply": "84000000.0", "percent_change_1h": "-0.26", "percent_change_24h": "0.49", "percent_change_7d": "-5.75", "last_updated": "1516033441", "price_eur": "195.573891333", "24h_volume_eur": "521795140.413", "market_cap_eur": "10711344045.0", "wallet": "", "amount": "5", "price": "273", "date": "2017-12-22", "done": true }, { "id": "stellar", "name": "Stellar", "symbol": "XLM", "rank": "9", "price_usd": "0.628353", "price_btc": "0.00004451", "24h_volume_usd": "354370000.0", "market_cap_usd": "11241590476.0", "available_supply": "17890565456.0", "total_supply": "103590302054", "max_supply": null, "percent_change_1h": "-1.32", "percent_change_24h": "5.54", "percent_change_7d": "-2.12", "last_updated": "1516033444", "price_eur": "0.5118921699", "24h_volume_eur": "288690001.09", "market_cap_eur": "9158040372.0", "wallet": "", "amount": "11047", "price": "0", "date": "2014-08-02", "done": true }, { "id": "binance-coin", "name": "Binance Coin", "symbol": "BNB", "rank": "24", "price_usd": "20.9004", "price_btc": "0.00148041", "24h_volume_usd": "247617000.0", "market_cap_usd": "2069432206.0", "available_supply": "99014000.0", "total_supply": "199013968.0", "max_supply": null, "percent_change_1h": "3.61", "percent_change_24h": "6.56", "percent_change_7d": "17.26", "last_updated": "1516033453", "price_eur": "17.0266571628", "24h_volume_eur": "201722922.369", "market_cap_eur": "1685877432.0", "wallet": "", "amount": "52", "price": "20", "date": "2018-01-12" }, { "id": "eos", "name": "EOS", "symbol": "EOS", "rank": "11", "price_usd": "14.1498", "price_btc": "0.00100225", "24h_volume_usd": "861304000.0", "market_cap_usd": "8562139729.0", "available_supply": "605106767.0", "total_supply": "900000000.0", "max_supply": "1000000000.0", "percent_change_1h": "0.16", "percent_change_24h": "1.91", "percent_change_7d": "49.78", "last_updated": "1516033452", "price_eur": "11.5272336186", "24h_volume_eur": "701667332.728", "market_cap_eur": "6975207065.0", "wallet": "", "amount": "229", "price": "14.9", "date": "2018-01-12", "done": true }, { "id": "dogecoin", "name": "Dogecoin", "symbol": "DOGE", "rank": "36", "price_usd": "0.0108099", "price_btc": "0.00000077", "24h_volume_usd": "70875200.0", "market_cap_usd": "1219083701.0", "available_supply": "112774743608", "total_supply": "112774743608", "max_supply": null, "percent_change_1h": "0.46", "percent_change_24h": "-6.6", "percent_change_7d": "-30.33", "last_updated": "1516033442", "price_eur": "0.0088063607", "24h_volume_eur": "57738977.8064", "market_cap_eur": "993135071.0", "wallet": "", "amount": "7177", "price": "0.003398", "date": "2017-06-14", "done": true }, { "id": "bitcoin-gold", "name": "Bitcoin Gold", "symbol": "BTG", "rank": "15", "price_usd": "317.748", "price_btc": "0.0225066", "24h_volume_usd": "922451000.0", "market_cap_usd": "5327430041.0", "available_supply": "16766211.0", "total_supply": "16866211.0", "max_supply": "21000000.0", "percent_change_1h": "-3.6", "percent_change_24h": "14.06", "percent_change_7d": "35.35", "last_updated": "1516033456", "price_eur": "258.855632436", "24h_volume_eur": "751481164.307", "market_cap_eur": "4340028175.0", "wallet": "", "amount": "0.0914120", "price": "0", "date": "2017-11-25", "done": true }, { "id": "eos", "name": "EOS", "symbol": "EOS", "rank": "11", "price_usd": "14.1498", "price_btc": "0.00100225", "24h_volume_usd": "861304000.0", "market_cap_usd": "8562139729.0", "available_supply": "605106767.0", "total_supply": "900000000.0", "max_supply": "1000000000.0", "percent_change_1h": "0.16", "percent_change_24h": "1.91", "percent_change_7d": "49.78", "last_updated": "1516033452", "price_eur": "11.5272336186", "24h_volume_eur": "701667332.728", "market_cap_eur": "6975207065.0", "wallet": "", "amount": "129", "price": "14.9", "date": "2018-01-12", "done": false }, { "id": "eos", "name": "EOS", "symbol": "EOS", "rank": "11", "price_usd": "14.1498", "price_btc": "0.00100225", "24h_volume_usd": "861304000.0", "market_cap_usd": "8562139729.0", "available_supply": "605106767.0", "total_supply": "900000000.0", "max_supply": "1000000000.0", "percent_change_1h": "0.16", "percent_change_24h": "1.91", "percent_change_7d": "49.78", "last_updated": "1516033452", "price_eur": "11.5272336186", "24h_volume_eur": "701667332.728", "market_cap_eur": "6975207065.0", "wallet": "", "amount": "129", "price": "14.9", "date": "2018-01-12", "done": true }, { "id": "eos", "name": "EOS", "symbol": "EOS", "rank": "11", "price_usd": "14.1498", "price_btc": "0.00100225", "24h_volume_usd": "861304000.0", "market_cap_usd": "8562139729.0", "available_supply": "605106767.0", "total_supply": "900000000.0", "max_supply": "1000000000.0", "percent_change_1h": "0.16", "percent_change_24h": "1.91", "percent_change_7d": "49.78", "last_updated": "1516033452", "price_eur": "11.5272336186", "24h_volume_eur": "701667332.728", "market_cap_eur": "6975207065.0", "wallet": "", "amount": "129", "price": "14.9", "date": "2018-01-12", "done": true }, { "id": "cardano", "name": "Cardano", "symbol": "ADA", "rank": "5", "price_usd": "0.857725", "price_btc": "0.00006075", "24h_volume_usd": "1100990000.0", "market_cap_usd": "22238296577.0", "available_supply": "25927070538.0", "total_supply": "31112483745.0", "max_supply": "45000000000.0", "percent_change_1h": "2.34", "percent_change_24h": "13.14", "percent_change_7d": "-4.85", "last_updated": "1516033455", "price_eur": "0.6987516753", "24h_volume_eur": "896929210.43", "market_cap_eur": "18116583975.0", "wallet": "", "amount": "1747.2893", "price": "0.79", "date": "2018-01-15", "done": false }],
    unit: 'usd',
    editMode: false,
    addCoinToggle: false,
  },
  computed: {
    unitSymbol: function () {
      if (this.unit == 'eur') return '€';
      return '$';
    },
    sortedCoins: function () {
      return _.orderBy(this.coins, ['deactive', 'value_usd', 'delete'], ['asc', 'desc', 'asc'])
    },
    sum: function () {
      return this.sumAssets(true)
    },
    sumAll: function () {
      return this.sumAssets(false)
    }
  },
  created: function () {
    this.runApp();
  },
  methods: {
    isJSON: function (str) {
      if (_.isNull(str)) return false
      return !_.isError(_.attempt(JSON.parse, str));
    },
    importFile: function (event) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function (event) {
        if (this.isJSON(event.target.result)) {
          this.portfolio = []
          console.log(JSON.parse(event.target.result))
          this.portfolio = JSON.parse(event.target.result)
          this.savePortfolio();
          this.runApp()
        } else {
          console.log('JSON ERROR')
        }
      }.bind(this);

      reader.readAsText(file);
    },
    exportFile: function () {
      var text = JSON.stringify(this.portfolio, 0, 2);
      var filename = 'cryptocurrency-portofilio-' + moment(new Date(), "YYYY-MM-DD") + '.json'
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    sumAssets: function (deleted) {
      var sum = 0;
      this.coins.forEach(item => {
        if (item && (item.price_usd || item.price_eur)) {
          price = this.unit === 'usd' ? item.price_usd : item.price_eur
          if (deleted && item.deactive) {
            price = 0;
          }
          if (item.delete) {
            price = 0;
          }
          sum += price * item.amount
        }
      })
      return sum;
    },
    getIndexById: function (item) {
      for (let [index, value] of Object.entries(this.coins)) {
        if (value && JSON.stringify(item) === JSON.stringify(value)) {
          return index
        }
      }
    },
    makeuuid: function (item) {
      var index = this.getIndexById(item)
      this.coins[index]['uuid'] = this.uuidv4();
      this.portfolio[index]['uuid'] = this.coins[index]['uuid'];
      this.savePortfolio();
    },
    getIndexByUUID: function (item, list) {
      for (let [index, value] of Object.entries(list)) {
        if (value && item.uuid === value.uuid) {
          return index
        }
      }
    },
    savePortfolio: function () {
      var data = JSON.stringify(this.portfolio);
      localStorage.setItem('data', data);
      this.coins = JSON.parse(JSON.stringify(this.coins));
    },
    removeCoin: function () {
      var indexC = this.getIndexByUUID(this.coin, this.coins)
      var indexP = this.getIndexByUUID(this.coin, this.portfolio)
      this.coins.splice(indexC, 1)
      this.portfolio.splice(indexP, 1)
      this.addCoinToggle = false
      this.savePortfolio()
    },
    addCoin: function (item) {
      if (item.id) {
        this.editMode = true
        var indexP = this.getIndexByUUID(item, this.portfolio)
        this.coin = this.portfolio[indexP]
        this.coin.date = new Date(this.coin.date)
        this.coin.date_sell = this.coin.date_sell ? new Date(this.coin.date_sell) : ''
      } else {
        this.coin = defaultCoin
        this.coin.uuid = this.uuidv4()
      }
      this.addCoinToggle = !this.addCoinToggle
    },
    toggleCoin: function (item, field) {
      var indexC = this.getIndexByUUID(item, this.coins)
      var indexP = this.getIndexByUUID(item, this.portfolio)
      if (indexC && indexP) {
        this.coins[indexC][field] = !this.coins[indexC][field];

        this.portfolio[indexP][field] = !this.portfolio[indexP][field]
        if (field === 'delete') {
          this.coins[indexC]['price_sell'] = this.coins[indexC].price_usd;
          this.coins[indexC]['date_sell'] = new Date()
          this.portfolio[indexP]['price_sell'] = this.coins[indexP].price_usd;
          this.portfolio[indexP]['date_sell'] = new Date()
        }
        this.coins = JSON.parse(JSON.stringify(this.coins));
        this.savePortfolio();
      }
    },
    editCoin: function () {
      if (this.editMode)
        this.editCoinSave()
      else
        this.addCoinSave()
    },
    editCoinSave: function () {
      var indexC = this.getIndexByUUID(this.coin, this.coins)
      var indexP = this.getIndexByUUID(this.coin, this.portfolio)

      this.coins[indexC] = this.calculateCoin([], this.coin, this.coin)
      this.portfolio[indexP] = this.coin

      this.addCoinToggle = false

      this.savePortfolio();
    },
    addCoinSave: function () {
      console.log(this.coin)
      var index = this.portfolio.push(this.coin);
      this.$http.get(`${apiBaseUrl}/${this.coin.id}/?convert=EUR`).then(apiResponse => {
        this.coins[index] = this.calculateCoin(this.coin, apiResponse.body[0])
        this.savePortfolio();
        this.addCoinToggle = false
      }, response => {
        console.log(response.body.error);
      })
    },
    calculateCoin(coin, item) {
      const price_eur = coin.price * item.price_eur / item.price_usd

      let more = {}

      if (coin.delete) {
        more = {
          value_usd: coin.amount * (coin.price_sell || 0),
          profit_usd: (coin.price_sell || 0) * coin.amount - coin.price * coin.amount,
          profit: (coin.price_sell || 0) * coin.amount * 100 / (coin.price * coin.amount) - 100
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

      return Object.assign({}, item, coin, more);
    },
    runApp: function () {
      console.log('start')
      for (let [index, item] of Object.entries(this.portfolio)) {
        if (!item.delete) {
          this.$http.get(`${apiBaseUrl}/${item.id}/?convert=EUR`).then(apiResponse => {
            this.coins[index] = this.calculateCoin(item, apiResponse.body[0])
            this.coins = JSON.parse(JSON.stringify(this.coins));
          })
        } else {
          this.coins[index] = this.calculateCoin(item, item)
        }
      };
    },
    changeUnit: function () {
      this.unit = this.unit == 'usd' ? 'eur' : 'usd';
    },
    uuidv4: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  },
  filters: {
    moment: function (value) {
      if (moment && value) return moment(value, "YYYY-MM-DD").fromNow();
      return '-'
    },
    unitSymbol: function () {
      if (this.unit == 'eur') return '€';
      return '$';
    },
    numberFormat: function (value, count = 4) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        const tmp = parseFloat(value).toFixed(count)
        return new Intl.NumberFormat().format(tmp);
      }
      return '-'
    }
  }
})