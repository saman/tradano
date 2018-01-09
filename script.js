var app = new Vue({
  el: '#app',
  data: {
    coins: [],
    unit: 'USD',
  },
  computed: {
    sortedCoins: function () {
      return this.coins.sort(this.compare);
    },
    sum: function () {
      var sum = 0;
      this.coins.forEach(item => {
        sum += item.price * item.value
      })
      return sum;
    }
  },
  created: function () {
    this.runApp();
  },
  methods: {
    runApp: function () {
      this.coins = [];
      this.$http.get('./data.json').then(response => {
        response.body.forEach(item => {
          this.$http.get(item.api + this.unit).then(apiResponse => {
            this.coins.push({
              name: apiResponse.body.data.coin.name,
              symbol: apiResponse.body.data.coin.symbol,
              unit: apiResponse.body.data.stats.base,
              price: apiResponse.body.data.coin.price,
              value: item.value,
            });
          })
        });
      }, response => {
        // error callback
      });
    },
    changeUnit: function () {
      this.unit = this.unit == 'USD' ? 'EUR' : 'USD';
      this.runApp();
    },
    compare: function (a, b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }
  },
  filters: {
    unitSymbol: function (unit) {
      if (unit == 'EUR') return '€';
      return '$';
    },
    numberFormat: function (value, count = 4) {
      return parseFloat(value).toFixed(count)
    }
  }
})