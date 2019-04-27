export default Helpers = {
	l: (msg) => {
		console.log(msg)
	},
	blackOrWhite(){
		var rgb = ['44', '44', '44'];
		var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
		return (o > 125) ? 'black' : 'white'
	}
}