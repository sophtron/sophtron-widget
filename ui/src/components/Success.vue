<template>
    <div id="container2">
        <h4 class="main-text">All Done </h4>
    </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'SecurityQuestion',
  methods: {
      submit(){

      },
      init(){

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
