<template>
  <div>
    <h6>Sorry something unexpected happened:</h6>
    <p>{{ message || 'Unspecific Error'}}</p>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'Error',
  data(){
    return {
      message: store.state.error
    }
  }
}
</script>