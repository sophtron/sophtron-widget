<template>
    <div id="container2">
      <h4 id="main-text">Verify Your Identity</h4>
      <p class="sub-text">Where would you like to send your security code?</p>
      <ul id="contactOptions">
          <li class="select-box box-shadow" v-for="number in options"  :key="number">
              <div class="radio-button">
                  <input class="form-check-input" type="radio" :value="number" v-model="selected" name="phoneNumberRadio">
              </div>
                <div class="side-text">
                    <div id="select-box-title" @click="select(number)">{{ number }}</div>
                    <!-- <div class="sub-side-text phone-number"> {{ number }}</div> -->
              </div>
          </li>
      </ul>
      <div id="bottomButtonOuter">
        <button class="btn btn-dark" id="bottomButton" :disabled="selected == ''" @click="submit">Submit</button>
      </div>
  </div>
</template>

<script>
import store from '@/store'
import api from '@/api'
export default {
  name: 'TokenMethod',
  methods: {
      submit(){
        api.tokenMethod(this.selected)
            .then(data => {
                if(data){
                    store.dispatch('SetMfa', {});
                }
            });
      },
      select(number){
        this.selected = number;
      }
  },
  components: {
  },
  setup(){
    return { 
        bank: store.state.bank
    }
  },
  mounted(){

  },
  data(){
    return { 
      options: store.state.mfa.TokenMethod,
      selected: ''
    }
  }
}

</script>
<style>
  @import '../../css/mfa.css';
</style>
