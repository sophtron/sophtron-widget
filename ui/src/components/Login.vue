<template>
    <div id="container2">
       
        <h4 class="main-text"> Login to {{bank.name}} <br/> Enter your credentials </h4>
        <p class="sub-text">By providing your credentials you are asking Alice to retrieve your financial data and agree to our <a id="tosLink" >terms of service</a>.</p>
        <div class="pb-2">
            <input type="username" required class="form-control" v-model="username" placeholder="Username">
        </div>
        <div class="pb-2">
            <input type="password" required class="form-control" v-model="password" placeholder="Password">
        </div>
        <div id="bottomButtonOuter">
            <button class="btn btn-dark" id="bottomButton" :disabled="username == '' || password == ''" @click="submit">Submit</button>
        </div>
        <!-- <div class="center-text">
            <a id="reset-password-button" class="link-success" >Reset password</a>
        </div> -->
    </div>
</template>

<script>
import api from '../api'
import store from '@/store'
export default {
  name: 'Login',
  components: {
  },
  methods: {
      submit(){
        if(this.username != '' && this.password != ''){
          api.login(this.username, this.password, store.state.bank.id, store.state.bank.name)
            .then(data => {
                store.dispatch('SetJob', data);
            });
        }
      }
  },
  data(){
    return {
        bank: store.state.bank,
        action: store.state.request.action,
        username: '',
        password: ''
    };
  }
}

</script>
<style>
  @import '../css/login.css';
</style>
