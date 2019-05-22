<template>
    <div class="container-fluid">
        <topMenu></topMenu>

    	<div class="row pl-4 pr-4" style="min-height:200px;">
            <transition name="slide" mode="out-in" class="">
                <router-view class=""></router-view>
            </transition>
    	</div>
        <br>
    	<div class="row clearfix">
    	</div>

        <div v-show="msg" class="row no-gutters text-center">
            <div class="fixed-top font-weight-bold rounded-top w-75 m-auto text-white p-2 pl-3 pr-3 bg-primary">
                {{msg}}... 
            </div>
        </div>

        <div v-show="error" class="row no-gutters">
            <div class="col-12x text-center text-white fixed-top error bg-danger">{{error}}</div>
        </div>

		<div id="Footer" class="text-center mb-3 col-12">
            <div style="min-width:330px;">
                <a src="/"><img alt="Linkkle.com" src="./assets/logo.svg" width="120" height="30"/>&nbsp;</a>
                <ul class="listMenu">
                    <li><a href="#">Privacy</a></li>
                    <li><a href="mailto:linkkle@gmx.com">Support</a></li>
                </ul>
            </div>
        </div>
        <div class="adBanner ad_container adholder2 ad_box_"></div>

        <div v-show="loading" class="loading">
            <div class="waiting-dots"></div>  
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Menu from './components/widgets/menu.vue'
export default {
    data() {
        return {
        }
    },
    mounted(){
        var tthis = this
        setTimeout(function(){
            if(!$("adBanner, .ad_container, .adholder2, .ad_box_").is(":visible") || !adBlockerEnabled){
                    tthis.errorMsg("Please disable your adblocker or whitelist linkkle.com to continue.")
            }
        }, 1000)
    },
    components: {
        topMenu: Menu,
    },
    computed: {
        ...mapGetters([
        ]),
        isAuth(){
            return this.$store.state.auth
        },
        showMenu(){
            return (document.getElementById("NoMenu") == null)
        },
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
    @font-face { font-family: "Open Sans"; font-style: normal; font-weight: 600; src: local("Open Sans SemiBold"), local("OpenSans-SemiBold"), url("https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOUuhp.woff2") format("woff2"); unicode-range: U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
	body {
		padding: 0;
	    font-family: 16px/1.8 'Open Sans', Helvetica, Arial, sans-serif;
        color: #222;
	}

    .error{
        padding:9px 14px;
    }
    .listMenu li{
        display: inline-block;
        list-style-type: none;
        margin-right: 42px;
    }
    #Footer{
        bottom:0;
        position: static;
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
		border-bottom: 2px solid #666;
		margin-bottom: 6px;
		height: 50px;
		resize: none;
		overflow: hidden;
	}
	.inputLine::placeholder {
		opacity: 1;
    }

    .adBanner {
        height: 1px;
        width: 1px;
        background-color: transparent;
    }

    .loading{
        top:0;
        padding-top:20%;
        background-color: rgba(255, 255, 255, 0.3);
        width: 100%;
        height: 100%;
        margin-left:-30px;
        position: fixed;
        z-index: 9999999;
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
