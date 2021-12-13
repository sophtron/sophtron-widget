<template>
    <div id="container2">
        <img alt="captcha-image" class="captcha-image" id='captchaImage' :src="'data:image/png;base64,' + imageSrc" />
        <div class="sub-text">Please enter the code you see in this picture</div>
        <div class="pb-3 pt-2">
            <input type="text" class="form-control" v-model="input" placeholder="Code">
        </div>
        <div id="bottomButtonOuter">
            <button class="btn btn-dark" id="bottomButton" :disabled="input == ''" @click="submit">Submit</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import api from '@/api'
export default {
  name: 'Captcah',
  components: {
  },
  setup(){
    return { 
        bank: store.state.bank,
        imageSrc: store.state.mfa.CaptchaImage
    }
  },
  data(){
      return {
        input: ''
      }
  },
  methods: {
      submit(){
        api.captchaInput(this.input)  
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
