<template>
<section class="hero is-fullheight">
  <div class="hero-body">
    <div class="container">
        <div class="status">
            <div class="emoji">{{range[this.placeCount]}}</div>
            <div class="is-text-7 latest" v-if="this.lastRate">${{toMoney(this.lastRate)}}</div>
            
            <div>
                <a class="is-link enter-amount-link" v-if="!showEnterAmount && !buyPrice" @click="() => {this.showEnterAmount=!this.showEnterAmount}">what did you buy it at?</a>
                
                <template v-if="buyPrice">
                    <div class="purcase-price">
                        <span class="is-size-7">Purcase price ${{toMoney(buyPrice)}}</span><br>
                        <a class="is-link enter-amount-link"  @click="() => {this.showEnterAmount=!this.showEnterAmount}">edit</a>
                    </div>
                </template>
                
                <div class="enter-amount" v-if="showEnterAmount">
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Price in BTC in USD?" v-model="buyPrice" @keyup.enter="setBuyPrice">
                        </div>
                        <div class="control">
                            <a class="button is-info" @click="setBuyPrice">Set</a>
                        </div>
                    </div>
                    <a class="is-link enter-amount-link" @click="cancelSetPrice">cancel</a>
                </div>
            </div>
        </div>
    </div>
  </div>
</section>
</template>

<script>
import axios from 'axios'
var coinURL = 'https://api.coindesk.com/v1/bpi/currentprice.json'
var timer = null
export default {
    name: 'App',
    props: {},
    data() {
        return {
            inMoodMode: true,
            showEnterAmount: false,
            buyPrice: null,
            placeCount: 0,
            lastRate: null,
            range: ['😍','🤑','🤗','😝','😛','😁','😀','🙃','😐','😑','😶','😬','😕','🙁','😔','😒','😫','😤','😡'],
            isLoadingData: false,
        }
    },
    components: {
    },
    methods: {
        setBuyPrice(e) {
            var str = ""+this.buyPrice;
            var v = parseFloat( str.replace(/[^\d\.]/g,'') );
            console.log(v);
            this.buyPrice = v;
            this.showEnterAmount = false;
            if(this.lastRate) {
                this.placeCount = parseInt((this.range.length/2));
            }
            this.inMoodMode = false;
        },
        cancelSetPrice(e) {
            this.inMoodMode = true;
            this.buyPrice = null;
            this.showEnterAmount = false;
        },
        toMoney(n) {
           return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },
        loadData() {
            if(!this.isLoadingData) {
                console.log('loading latest bitcoin price');
                this.isLoadingData = true;
                axios.get(coinURL).then((resp) => {
                    if(resp.data.bpi) {
                        if(this.inMoodMode) {
                            if (this.lastRate == null) {
                                this.placeCount = parseInt(this.range.length/2);
                            }
                            var newRate = resp.data.bpi.USD.rate_float;

                            // more money --
                            if (newRate > this.lastRate && this.placeCount > 0) {
                                this.placeCount --;
                            }
                            else if(newRate < this.lastRate && this.placeCount < this.range.length-1) {
                                this.placeCount ++;
                            }
                            this.lastRate = newRate
                            console.log('new rate', newRate);
                        }
                        else {
                            if(this.buyPrice) {
                                var newRate = resp.data.bpi.USD.rate_float;
                                // more money --
                                if (newRate > this.buyPrice && this.placeCount > 0) {
                                    this.placeCount --;
                                }
                                // less money ++
                                else if(newRate < this.buyPrice && this.placeCount < this.range.length-1) {
                                    this.placeCount ++;
                                }
                                this.lastRate = newRate
                                console.log('new rate', newRate);
                            }
                        }
                    }
                    this.isLoadingData = false;
                })
            }
        }
    },
    computed: {
    },
    watch: {
    },
    created() {
        if (timer) {
            clearInterval(timer)
        }
    },
    mounted() {
        if (timer) {
            clearInterval(timer)
        }
        timer = setInterval(this.loadData, 1000);
    }
}
</script>

<style lang="scss">
@import '~bulma';
.section {
    background-color: white;
}
.enter-amount-link {
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
}
.status {
    text-align: center;
    .emoji {
        font-size: 120px;
    }
}
.enter-amount {
    padding-top: 50px;
    .field {
        justify-content: center;
    }
    width: 100%;
}
.purcase-price {
    padding-top: 30px;
}
.latest {
    font-weight: bold;
}
</style>