import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    coach: {
        type: Boolean,
        default: null
    },
    coachId: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    deletedAt: {
        type: Date,
        default: null
    },
});

const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
};

// userSchema.pre('save', (next) => {
//     const user = this;
//     bcrypt.hash(user.password, 10, (err, hash) => {
//         if (err) return next(err);
//
//         user.password = hash;
//         next();
//     })
// });

module.exports = mongoose.model('User', userSchema);