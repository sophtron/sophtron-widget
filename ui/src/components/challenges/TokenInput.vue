<template>
    <div id="container2">
        <div class="sub-text">Enter the <a class="sub-text phone-number">{{ inputName }}</a></div>
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
  name: 'TokenInput',
  components: {
  },
  setup(){
    return { 
        bank: store.state.bank,
    }
  },
  data(){
      return {
        questions: store.state.mfa.SecurityQuestions,
        inputName: store.state.mfa.TokenInputName,
        input: '',
      }
  },
  methods: {
      submit(){
        api.tokenInput(this.input) 
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
