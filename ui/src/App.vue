<template>
  <div id="second-body">
    <div id="container">
      <div id="header">
        <img id="arrow" class="left-header-button" width="23" style="cursor: pointer;" @click="goBack" v-if="canGoBack" src="./assets/arrow.png">
        <div id="header-placeholder" v-else></div>
        <div>
          <img id="logo" class="center-header-logo" width="30" v-show="showLogo" src="./assets/sophtron_logo.png">
          <img id="logo_text" class="center-header-logo" width="70" v-show="showLogo" src="./assets/sophtron_text.png">
        </div>
        <img id="x" class="right-header-button" width="23" style="cursor: pointer;" @click="close" src="./assets/x.png">
      </div>
      <div class="displayed-bank" v-if="bank.name">
        <img class="bank-logo" v-bind:src="bank.img || require('@/assets/bank-img.png')" width="128"/> 
        <!-- <div class="side-text">
          <div class="item-name"><b>{{ bank.name }}</b></div>
          <div class="sub-side-text">{{ bank.link }}</div>
        </div> -->
      </div>
      <div id="body">
        <router-view />
      </div>

      <div class="modal-mask" v-if="showCloseConfirmation">
        <div class="modal-container">
          <div class="modal-content">
            <p class="sub-text">Login in progress, are you sure to close?</p>
          </div>
          <div class="modal-buttons-container">
            <button class="btn modal-button" @click="confirmClose">Yes</button>
            <button class="btn modal-button" @click="cancelClose">Cancel</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import store from '@/store'
import {useRoute} from  'vue-router'
//import router from '@/router'
export default {
  name: 'App',
  components: {
  },
  // store,
  // router,
  methods:{
    goBack(){
      store.commit('SET_BANK', {});
      this.$router.back();
    },
    close(){
      store.dispatch('close', {route: this.$route.name});
    },
    confirmClose(){
      store.dispatch('close', {route: this.$route.name, confirmed: true});
    },
    cancelClose(){
      store.dispatch('cancelClose', {route: this.$route.name});
    }
  },
  data(){
    return {
    }
  },
  computed : {
    bank() {
      if(store && store.state)
        return  store.state.bank;
      return {};
    },
    canGoBack(){
      var route = useRoute();
      return route.name == 'Login' && !store.state.request.userInstitutionId && !store.state.request.institutionId && !store.state.request.routingNumber;
    },
    showCloseConfirmation(){
      return store.state.closing;
    },
    showLogo(){
       return store.state.preference.showProviderLogo;
    }
  },
  mounted(){
    // let vwc = document.getElementById("container").clientWidth
    // //let vhc = document.getElementById("container").clientHeight
    // let vwp = vwc/100
    // //let vhp = vhc/100

    // if (document.getElementById("arrow")) {
    //   document.getElementById("arrow").style.width = vwp*6+"px"
    //   document.getElementById("arrow").style.height = vwp*6+"px"
    // }
    // document.getElementById("logo").style.height = vwp*7.5+"px"
    // document.getElementById("logo").style.width = ((vwp*7)*3.2)+"px"
    // document.getElementById("x").style.width = vwp*6+"px"
    // document.getElementById("x").style.height = vwp*6+"px"
  }
}
</script>

<style>
  @import './css/universal.css';
  @import './css/modal.css';
</style>
