import mongoose from 'mongoose';

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,30})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            trim: true,
            required: true
        },
        lastName: {
            type: String,
            trim: true,
            required: true
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate: [validateEmail, 'Nieprawidłowy format adresu e-mail.']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    coach: {
        type: Boolean,
        default: true
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
        default: new Date(),
        select: false
    },
    deletedAt: {
        type: Date,
        default: null,
        select: false
    },
    activated: {
        type: Boolean,
        default: false
    },
    accepted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('User', userSchema);