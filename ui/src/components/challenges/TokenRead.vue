<template>
    <div id="container2">
        <h4 class="main-text">Verify Phone Number </h4>
            <div class="sub-text">Please wait for a phone call and verify with this token value: <b>{{ token }}</b></div>
        <div id="bottomButtonOuter">
            <button class="btn btn-dark" id="bottomButton" @click="submit">Submit</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import http from '@/api'
export default {
  name: 'TokenRead',
  components: {
  },
  setup(){
    return { 
        bank: store.state.bank,
        token: store.state.mfa.Token
    }
  },
  data(){
      return {
        input: ''
      }
  },
  methods: {
      submit(){
        api.tokenConfirm()
            .then(data => {
                if(data){
                    store.dispatch('SetMfa', {});
                }
            });
      }
  },
  mounted(){

  }
}

</script>
<style>
  @import '../../css/answer.css';
</style>
