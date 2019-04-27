<template>
    <div class="container-fluid">
    	<div class="row">
            <transition name="slide" mode="out-in" class="position-absolute">
                <router-view class=""></router-view>
            </transition>
    	</div>
        <br>
    	<div class="row clearfix">
    	</div>

        <div v-show="msg" class="row no-gutters">
            <div class="w-25 rounded-top text-center p-2 pt-4 pb-4 text-white fixed-bottom msg bg-primary">{{msg}}</div>
        </div>

        <div v-show="error" class="row no-gutters">
            <div class="col-12x text-center text-white fixed-bottom error bg-danger">{{error}}</div>
        </div>

		<div id="Footer" class="text-center"><img alt="Linkkle.com" src="./assets/logo.svg" width="120" height="30"/></div>
    
        <div v-show="loading" class="loading">
            <div class="waiting-dots"></div>  
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    data() {
        return {
        }
    },
    mounted(){
    },
    components: {
    },
    computed: {
        ...mapGetters([
        ]),
        error(){
            return this.$store.state.error
        },
        msg(){
            return this.$store.state.msg
        },
        loading(){
            return this.$store.state.loading
        }
    },
    methods: {
        ...mapActions([
            'setLoading',
            'errorMsg',
        ]),
    },
    created() {
    }
}
</script>

<style>
	body {
		padding: 0;
	    font-family: 16px/1.8 'Open Sans', Helvetica, Arial, sans-serif;
        color: #222;
	}

    .error, .msg{
        padding:9px;
    }

    .slide-enter-active{
        animation: slide-in 200ms ease-out forwards;
    }
    .slide-leave-active{
        animation: slide-out 200ms ease-out forwards;
    }

    @keyframes slide-in {
        from{
            transform: translateY(-30px);
            opacity: 0;
        }
        to{
            transform: translateY(0);
            opacity: 1;
        }
    }
    @keyframes slide-out {
        from{
            transform: translateY(0);
            opacity: 1;
        }
        to{
            transform: translateY(-30px);
            opacity: 0;
        }
    }
    
    input[type="range"] {
    -webkit-appearance: none;
    background-color: #fff;
    }
    input[type="range"]:focus {
    outline: none;
    }
	.inputLine{
		background-color: transparent;
		color:#555;
		opacity: 1;
		border: 0;
		border-bottom: 2px solid #28A744;
		margin-bottom: 6px;
		height: 50px;
		resize: none;
		overflow: hidden;
	}
	.inputLine::placeholder {
		opacity: 1;
    }
    
    .loading{
        top:0;
        padding-top:10%;
        background-color: rgba(255, 255, 255, 0.3);
        width: 100%;
        height: 100%;
        margin-left:-30px;
        position: fixed;
    }
    /*Typing Loader*/
    .waiting-dots{
        margin:0 auto;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        -webkit-animation: typing 1s linear infinite alternate;
        -moz-animation: Typing 1s linear infinite alternate;
        animation: typing 1s linear infinite alternate;
        position: relative;
    }
    @-webkit-keyframes typing{
        0%{
            background-color: rgb(81, 157, 232, 1);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,0.2), 
                        36px 0px 0px 0px rgba(81, 157, 232,0.2);
        }
        25%{ 
            background-color: rgba(81, 157, 232, 0.4);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,2), 
                        36px 0px 0px 0px rgba(81, 157, 232,0.2);
        }
        75%{ background-color: rgba(81, 157, 232, 0.4);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,0.2), 
                        36px 0px 0px 0px rgba(81, 157, 232,1);
        }
    }

    @-moz-keyframes typing{
        0%{
            background-color: rgba(81, 157, 232, 1);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,0.2), 
                        36px 0px 0px 0px rgba(81, 157, 232,0.2);
        }
        25%{ 
            background-color: rgba(81, 157, 232, 0.4);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,2), 
                        36px 0px 0px 0px rgba(81, 157, 232,0.2);
        }
        75%{ background-color: rgba(81, 157, 232, 0.4);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,0.2), 
                        36px 0px 0px 0px rgba(81, 157, 232,1);
        }
    }

    @keyframes typing{
        0%{
            background-color: rgba(81, 157, 232, 1);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,0.2), 
                        36px 0px 0px 0px rgba(81, 157, 232,0.2);
        }
        25%{ 
            background-color: rgba(81, 157, 232, 0.4);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,2), 
                        36px 0px 0px 0px rgba(81, 157, 232,0.2);
        }
        75%{ background-color: rgba(81, 157, 232, 0.4);
            box-shadow: 18px 0px 0px 0px rgba(81, 157, 232,0.2), 
                        36px 0px 0px 0px rgba(81, 157, 232,1);
        }
    }
</style>
