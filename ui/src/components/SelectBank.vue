<template>
    <div v-show="noprovider" id="container2">
        <h4 class="main-text">{{ isDemo ? 'Demo - ' : '' }}Select your bank</h4>
        <div id="searchBarOuter">
            <input type="search" id="search-bar" v-model="searchStr" @keyup="search" class="form-control rounded" placeholder="Search">
        </div>
        <ul id="bank-list">
            <li class="list-item" v-for="bank in loadedBanks" :key="bank.name" @click="selectBank(bank)" >
                <img class="bank-img" v-bind:src="bank.img || require('@/assets/bank-img.png') "/> 
                <div class="side-text" >
                    <div class="item-name">{{ bank.name }} </div>
                    <div class="sub-side-text">{{ bank.link }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import api from '../api'
import store from '@/store'
console.log("Ao")
export default {
  name: 'SelectBank',
  methods: {
      selectBank(bank){
          store.dispatch('SetBank', bank)
      },
      search(){
        if(this.searchStr && this.searchStr.length >= 3){
          api.search(this.searchStr.toLowerCase())
            .then(data => {
                store.commit('SET_BANKS', data);
            });
        }else{
          store.commit('SET_BANKS', []);
        }
      }
  },
  computed: {
    loadedBanks(){
      return (store.state.banks || []).length > 0
          ? store.state.banks 
          : (store.state.defaultBanks || [] ).filter(b =>this.searchStr == '' || b.name.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1);
    },
    noprovider(){
      return store.state.provider.token == undefined;
    }
    // filteredBanks() {
    //     return (this.banks || []).filter(bank => !this.searchStr || this.searchStr == '' || (bank.name || '').toUpperCase().indexOf(this.searchStr.toUpperCase()) > -1)
    // }
  },
  data(){
    return { 
        searchStr: '',
        isDemo: store.state.request.action == 'Demo'
    }
  },
  beforeMount(){
  }
}

</script>
<style>
  @import '../css/selectBank.css';
</style>
