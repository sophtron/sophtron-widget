<template>
    <div id="container2">
        <h4 class="sub-text">Connection successfull.</h4>
        <div id="bottomButtonOuter">
            <button class="btn btn-dark" id="bottomButton" @click="close">Close</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'Success',
  methods: {
      close(){
        store.dispatch('close', this.$route.name);
      }
  },
  data(){
    return { 
        bank: store.state.bank,
        username: '',
        password: ''
    }
  }
}

</script>
<style>
  @import '../css/answer.css';
</style>
