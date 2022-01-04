<template>
  <div id="container2">
        <h4 class="main-text"> Sorry something went wrong </h4>
        <p class="sub-text">{{ message || 'Unspecific Error'}}</p>
       
        <div id="bottomButtonOuter">
            <button class="btn btn-dark" id="bottomButton" @click="close">Close and Try again</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'Error',
  data(){
    return {
      message: (store.state.error || '').replace('$CONTACT', store.state.preference.contactEmail)
    }
  },
  methods:
  {
    close(){
      store.dispatch('close', this.$route.name);
    }
  }
}
</script>