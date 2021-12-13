<template>
  <div>
    <h6>Sorry there isn't enough information provided to proceed.</h6>
    <p>{{ message || 'Invalid Request'}}</p>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'InvalidRequest',
  data(){
    return {
      message: store.state.error
    }
  }
}
</script>