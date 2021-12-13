<template>
    <div id="container2">
        <h4 class="main-text">Authentication Questions </h4>
        <div class="pb-3 pt-2" v-for="(question, i) in questions" :key="i">
            <label for="question.label + i">{{ question.label }}</label>
            <input :id="question.label + i" v-model="question.answer" class="form-control" type="text" />
            <br />
        </div>
        <div id="bottomButtonOuter">
            <button class="btn btn-dark" id="bottomButton" :disabled="noAnswer" @click="submit">Submit</button>
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
        questions: store.state.mfa.SecurityQuestion.map(q => q.label? {label: q.label, answer: ''} : ({ label: q, answer: '' }))
      }
  },
  computed: {
      noAnswer(){
          return this.questions.every(q => q.answer == '');
      }
  },
  methods: {
      submit(){
        api.securityAnswers(this.questions.map(q => q.answer))
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
