<template>
		<nav id="Menu" class="navbar fixed-top navbar-expand-sm navbar-light bg-white border" style="min-width:340px;">
		    <div class="navbar-header">
		      <span class="navbar-brand text-success">
                    <a src="/"><img alt="Linkkle.com" src="../../assets/logo.svg" width="120" height="30"/>&nbsp;</a>
                </span>
		    </div>

		    <div class="collapse navbar-collapse clearfix" id="navCollapse">
		      	<ul class="nav navbar-nav justify-content-end col-12">
							
		      		<div class="nav-link" style="cursor:pointer">
                        <a href="/" class="nav-item "><small>Home</small></a>
		      		</div>
		      		<div class="nav-link pl-3" style="cursor:pointer">
                        <a href="/pricing" class="nav-item "><small>Pricing</small></a>
		      		</div>
		      		<div class="nav-link pl-3" style="cursor:pointer">
                        <a href="/login" class="nav-item"><small>Sign Up</small></a>
		      		</div>
		      		<div class="nav-link pl-3" style="cursor:pointer">
                        <a href="/login" class="nav-item btn btn-lg text-white font-weight-bold btn-primary pt-0 pb-1"><small>LOGIN</small></a>
		      		</div>
		      	</ul>
		    </div>

				<button class="navbar-toggler float-right" type="button" data-toggle="collapse"
					data-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				
		</nav>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
    export default {
			...mapGetters([
			]),
            data() {
                return {
                }
            },
			computed: {
			},
			methods: {
				...mapActions([
				]),
			},
			created(){
			},
			mounted(){
			}
	}
</script>
<style>
	.navbar-toggler.on{
		right: 66px;
        
	} 
	.navbar-toggler.off{
		right: 126px;
	}
	.navbar-collapse.show .nav div a{
		padding-left:12px;
	}
    .nav-item.btn{
        font-family: 'Open Sans SemiBold';     
        letter-spacing: 0.04em;   
    }
    .nav-item:not(.btn){
        display: inline-block;
        outline: none;
        color: #519de8;
        font-family: 'Open Sans SemiBold';
        font-size: 1.1em;
        font-weight: bold !important;
        text-decoration: none;
        letter-spacing: 0.04em;
        border-bottom: 2px solid transparent;
        padding: 3px 5px 0 5px;
        text-transform: uppercase;
    }
    .nav-item:not(.btn):hover{
        color: #2e71b4;
        border-bottom: 2px solid #2e71b4;
    }
</style>
