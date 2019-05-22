<template>
	<div class="modal fade" id="statsWindow" tabindex="-1" role="dialog"  aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
			<div class="modal-content bg-light border border-primary " 
				style="box-shadow: 0px 0px 20px #666; min-width:280px;">

				<div class="modal-header text-white bg-primary rounded-0">
					<strong class="modal-title">
						Statistics
					</strong>
					<button type="button" class="close text-light" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body">
					<div v-if="preloaded" class="bg-white text-dark border border-primary rounded mb-3 mr-2 ml-2 pt-3">
						
						<div class="form-group col-12  col-sm-6 float-left">
							<label>Total Page Views:</label>
							<div class="text-primary">{{account.Views}}</div>
						</div>
						<div class="form-group col-12  col-sm-6 float-left">
							<label>Total Clicks:</label>
							<div class="text-primary">{{totalClicks}}</div>
						</div>	

						<div id="Chart" class="col-12 d-inline-block">
							<label>Clicks:</label>
							<bars style=""
								type="horizontalBar"
								:data="chartData"
								:options="chartOptions"
								:update-config="{duration: 800, easing: 'easeOutBounce'}">
							</bars>
							<br class="clearfix">
						</div>	
						
						
					</div>	
					<div class="text-right ml-3 mr-3">
						<button type="button" class="btn btn-outline-secondary float-right w-50 " @click="close()">close</button>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import VueChart from 'vuechart';
    export default {
		data() {
			return {
				chartData: {
					labels: [''],
					datasets: [],
				},
				chartOptions: {
					scales: {
						xAxes: [{
							maxBarThickness: 20, 
							barThickness: 'flex', 
							minBarLength: 6,
							gridLines: {offsetGridLines: false}
							}], 
						yAxes: [{
							ticks: {beginAtZero: true}
							}]
					},
					legend: {
							display: true,
							position: "bottom",
							fullWidth: true,
							labels: {boxWidth: 12, fontColor: "#111"}
					}
				},
				totalClicks: 0,
				preloaded: false
			}
		},
		components: {
			bars: VueChart
		},
		mounted(){
			this.initChart()
		},
		computed: {
			...mapGetters([
				"account",
				"sections"
			]),
			valueLabel: function(){
				if(this.section.Type){
					switch (this.section.Type){
						case "0": 
							return "Link"
						case "1": 
							return "Email"
						case "2": 
							return "Number"
						case "3": 
							return "Image URL"
					}
				} else {return "Link"}
			},
		},
		methods: {
			...mapActions([
			]),
			initChart(){
				var ci = 0
				this.sections.forEach(s =>{
					var label =  s.Title.length > 10 ?  s.Title.substring(0, 9) + "..." : s.Title
					var count = s.Clicks ? s.Clicks : 0
					this.totalClicks += count

					var hexes = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080']
					var data = 
						{
								label: label,
								backgroundColor: hexes[ci++],
								data: [
									count
								]
						}
					this.chartData.datasets.push(data)
				})
				setInterval(()=>{
					$("#Chart").css("height", $(".chartjs-render-monitor").css("height"))
				}, 600)
				this.preloaded = true
			},
			open(){
				var tthis = this
				$("#statsWindow").modal({backdrop:false, show: true})
			},
			close(){
				$("#statsWindow").modal("hide")
				$(".chartLabel").remove()
				this.section = {}
				this.advSettings = false
			},
		}
	}
</script>