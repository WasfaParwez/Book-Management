// { 
//     title: {string, mandatory, enum[Mr, Mrs, Miss]},
//     name: {string, mandatory},
//     phone: {string, mandatory, unique},
//     email: {string, mandatory, valid email, unique}, 
//     password: {string, mandatory, minLen 8, maxLen 15},
//     address: {
//       street: {string},
//       city: {string},
//       pincode: {string}
//     },
//     createdAt: {timestamp},
//     updatedAt: {timestamp}
//   }

const mongoose = require('mongoose');

const UserModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 15
    },
    address: {
      street: {
        type: String
      },
      city: {
        type: String
      },
      pincode: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports =  mongoose.model('User', UserModel);
