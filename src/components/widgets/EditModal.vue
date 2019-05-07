<template>
	<div v-if="section" class="modal fade" id="modalWindow" tabindex="-1" role="dialog"  aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered"  role="document">
			<div class="modal-content bg-light border border-primary" 
				style="box-shadow: 0px 0px 20px #666; min-width:280px;">
				<div class="modal-header text-white bg-primary rounded-0">
					<strong class="modal-title">
						Link settings
					</strong>
					<button type="button" class="close text-light" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<form class="modal-body">
					<div class="bg-white text-dark clearfix">
						<div class="form-group col-12 col-sm-6  col-md-4 float-left">
							<label>Type</label>
							<select v-model="section.Type" class="form-control">
								<option value="0">Link</option>
								<option value="1">Email</option>
								<option value="2">Number</option>
								<option value="3">Image</option>
							</select>	
						</div>	
						<div v-show="section.Type != 3" class="form-group col-12  col-sm-6 col-md-4 float-left">
							<label>Title</label>
							<input v-model="section.Title" type="text" class="form-control"  placeholder="Enter a title..."/>
						</div>
						<div class="form-group col-12  col-sm-6 col-md-4 float-left">
							<label>{{valueLabel ? valueLabel : "Link"}}</label>
							<input v-model="section.Value" type="text" class="form-control" :placeholder="valuePlaceholder" />
						</div>	
						
						<div v-show="!advSettings" class="form-group col-12 float-left p-0 m-0 ml-1">
							<button type="button" class="form-control btn btn-sm text-left text-primary" @click="advOpen">Size settings</button>
						</div>

						<div class="col-12" v-show="advSettings" >
							<label class="col-12 ml-n3">Size settings</label>
							<div class="col-11 p-0 border rounded d-inline-block pt-2">
								<div class="form-group float-left col-12 col-md-6  ml-n2">
									<label>Width </label>
									<select v-model="section.Width" class="form-control">
										<option value="3">Full</option>
										<option value="2">Half</option>
										<option value="1">Third</option>
									</select>	
									<i><small class="pl-1">(not shown on small devices)</small></i>
								</div>	
								<div class="form-group float-left col-12 col-md-6  ml-n2">
									<label>Height</label>
									<select v-model="section.Height" class="form-control">
										<option value="1">Short</option>
										<option value="2">Medium</option>
										<option value="3">Tall</option>
									</select>	
								</div>	
							</div>	
					  </div>	
					</div>
					<div class="text-right row ml-3 mr-3 justify-content-between">
						<button type="button" class="btn btn-outline-danger d-absolute col-12 col-sm-3 mr-3 mt-3" @click="remove()">Delete</button>
						<button type="button" class="btn btn-outline-secondary offset-sm-2 col-12 col-sm-3 mt-3" @click="close()">Cancel</button>
						<button type="button" class="btn btn-primary col-12 col-sm-3 mt-3" @click="save()">Save</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
    export default {
		data() {
			return {
				advSettings: false,
				section: null,
			}
		},
		mounted(){
		},
		computed:{
			...mapGetters([
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
			valuePlaceholder(){
				if(this.section.Type){
					switch (this.section.Type){
						case "0": 
							return "http://www.example.com..."
						case "1": 
							return "example@example.com..."
						case "2": 
							return "1-555-555-5555"
						case "3": 
							return "http://www.example.com/image.jpg..."
					}
				} else {return "Link"}
			}			
		},
		methods: {
			...mapActions([
				'getSections',
				'updateSection',
				'deleteSection',
				'loading1',
				'loading0'

			]),
			open(){
				$("#modalWindow").modal({backdrop:false, show: true})
			},
			advOpen(){
				this.advSettings = true
			},
			close(){
				$("#modalWindow").modal("hide")
				this.section = {}
				this.advSettings = false
			},
			save(){
				var tthis = this
				this.loading1()
				var fieldSets = [
					["Type", this.section.Type],
					["Title", this.section.Title ? this.section.Title : "."],
					["Value", this.section.Value],
					["Height", this.section.Height],
					["Width", this.section.Width],
				]
				this.updateSection({doc: this.section.id, fieldSets: fieldSets})
					.then(()=>{
						//setTimeout(function(){
						tthis.getSections().then(()=>{
							$("#modalWindow").modal("hide")
							tthis.section = {}
							tthis.advSettings = false
							tthis.loading0()
						})
						//}, 400)
					})
			},
			remove(){
				var tthis = this
				this.loading1()
				this.deleteSection(this.section.id)
					.then(()=>{
						tthis.getSections().then(()=>{
							$("#modalWindow").modal("hide")
							tthis.section = {}
							tthis.advSettings = false
							tthis.loading0()
						})
					})
			},
		}
	}
</script>