<template>
    <div id="container2">
    </div>
</template>

<script>
import store from '@/store'
// this is an example of how to switch to a another provider 
function show(){
      alert("Mocked ThirdParty widget shown");
}

export default {
  name: 'ThirdParty',
  mounted(){        
      show(store.state.provider.token);
  }
}
</script>

<style>
  @import '../css/answer.css';
</style>
