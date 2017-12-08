<template>
<section class="hero is-fullheight">
  <div class="hero-body">
    <div class="container">
        <div class="status" v-if="this.lastRate">
            <div class="emoji">{{range[this.placeCount]}}</div>
            <div class="is-text-7">${{toMoney(this.lastRate)}}</div>
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
            placeCount: 0,
            lastRate: null,
            range: ['😍','🤑','🤗','😝','😁','😀','😐','😑','😶','😬','😕','🙁','😔','😒','😫','😤','😡'],
            isLoadingData: false,
        }
    },
    components: {
    },
    methods: {
        toMoney(n) {
           return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },
        loadData() {
            if(!this.isLoadingData) {
                console.log('loading latest bitcoin price');
                this.isLoadingData = true;
                axios.get(coinURL).then((resp) => {
                    if(resp.data.bpi) {
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
.status {
    text-align: center;
    .emoji {
        font-size: 120px;
    }
}
</style>