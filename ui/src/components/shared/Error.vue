<template>
  <div id="container2">
        <h4 class="sub-text"> Sorry something went wrong: </h4>
        <p class="sub-text">{{ message || defaultMessage}}</p>
       
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
      message: (store.state.error || '').replace('$CONTACT', store.state.preference.contactEmail),
      defaultMessage:  (store.state.preference.defaultErrorMessage || '').replace('$CONTACT', store.state.preference.contactEmail) || `Unexpected error, please close and try again or contact ${store.state.preference.contactEmail} for assistance`
    }
  },
  methods:
  {
    close(){
      store.dispatch('close', {route: this.$route.name});
    }
  }
}
</script>