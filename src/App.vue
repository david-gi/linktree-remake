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
        <div class="row no-gutters">
            <div v-show="msg" class="w-25 rounded-top text-center p-2 pt-4 pb-4 text-white fixed-bottom msg bg-primary">{{msg}}</div>
        </div>
        <div class="row no-gutters">
            <div v-show="error" class="col-12x text-center text-white fixed-bottom error bg-danger">{{error}}</div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import H from './utils/helpers';
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
	    font-family: Verdana, Geneva, Tahoma, sans-serif;
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
</style>
