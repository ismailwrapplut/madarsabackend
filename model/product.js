var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const productSchema = new Schema( {
	
	studentprofilepic:String,
	sarparastprofilepic:String,
	formDate:String,  
	formnumber:String,
	sarparastname: String,
	sarparastfathername: String,
	sarparastvillage: String,
	sarparastpost: String,
	sarparasttehseel: String,
	sarparastdistt: String,
	sarparaststate: String,
	sarparastaadharno:Number,
	studentname: String,
	studentfathername: String,
	studentdateofbirth: String,
	studentvillage: String,
	studentpost: String,
	studenttehseel: String,
	studentdistt: String,
	studentstate: String,
	studentaadharno:Number,
	studentname2: String,
	studentfathername2: String,
	studentdateofbirth2: String,
	studentvillage2: String,
	studentpost2: String,
	studenttehseel2: String,
	studentdistt2: String,
	studentstate2: String,
	studentaadharno2:Number,
	shoba:String,
	dateshamsi:String,
	datekamari:String,
	darjarequested:String,
	darjagiven:String,
	beforethis:String,
	talibilmrishta:String,
	sarparastmobileno:String,
	sarparastwhatsappno:String,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
})

product = mongoose.model('product', productSchema);


module.exports = product;

