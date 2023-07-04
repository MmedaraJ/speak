const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [
            true,
            "Username is required"
        ],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"]
    },
    password: { 
        type: String,
        required: [
            true,
            "Password is required"
        ],
        unique: true,
        trim: true,
        minlength: [3, "Password must be at least 3 characters"]
    }
}, { timestamps: true });

// add this after UserSchema is defined
UserSchema.virtual('confirmPassword')
    .get( () => this._confirmPassword )
    .set( value => this._confirmPassword = value );

UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

UserSchema.plugin(uniqueValidator);

module.exports.User = mongoose.model('User', UserSchema);