<template>
    <div id="container2">
        <div id="myProgress">
            <div id="myBar"></div>
        </div>
        <Fish v-if="enabledFishing"></Fish>
    </div>
</template>

<script>
    import Fish from './fish.vue'
    export default {
        data () {
            return {
                //Set to false to disable fishing game
                enabledFishing: true,
            }
        },
        name: 'Progress',
        components: {
            Fish
        },
        methods: {
        },
        mounted(){
            let elemWidth = 0
            let elemWidthTotal = 100
            let countTimeTotal = 40
            let countTime = 40
            let countTimeTotalDecrese = 10
            let elemWidthTotalDecrese = 20
            let updateAmount = elemWidthTotal / countTime
            let mybar = document.getElementById("myBar");
            const elemToWidth = () => {
                if(mybar){
                    mybar.style.width = elemWidth+"%";
                }
            }
            const countDown = () => {
                elemWidth += updateAmount
                elemToWidth()
                if (elemWidth >= 100) {
                    if (countTimeTotal <= 0){
                        elemWidth = 0
                        elemWidthTotal = 100
                        countTimeTotal = 40
                        countTime = 40
                    } else {
                        countTimeTotal -= countTimeTotalDecrese
                        elemWidthTotal -= elemWidthTotalDecrese
                        elemWidth = 100 - elemWidthTotal 
                        countTime = countTimeTotal
                    }
                }
                setTimeout(()=>{countDown()}, 1000)
            }
            countDown();
        }
    }
</script>
<style>
  @import '../css/progress.css';
</style>
