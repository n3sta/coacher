import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: true
	},
	distance: {
		type: Number
	},
	date: {
		type: Date,
		required: true
	}
})

export default mongoose.model('Competition', competitionSchema);