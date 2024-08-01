const mongoose = require('mongoose');
const { Schema } = mongoose;

const universitySchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: {
        type: String,
        required: true
    },
    neptunUrl: {
        type: String,
        required: true
    }
}, { collection: 'Universities' });

const University = mongoose.model('Universities', universitySchema);
export default University;


