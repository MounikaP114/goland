import mongoose from "mongoose";

const propertyModel = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    city:{
      type:String,
      require:true,
    },
    state:{
      type:String,
      require:true
    },
    zip:{
      type:Number,
      require:true
    },
    regularPrice: {
      type: Number,
      require: true,
    },
    discountPrice: {
      type: Number,
      require: true,
    },
    bathRooms: {
      type: Number,
      require: true,
    },
    bedRooms: {
      type: Number,
      require: true,
    },
    kitchen: {
      type: Boolean,
      require: true,
    },
    hall: {
      type: Boolean,
      require: true,
    },
    parking: {
      type: Boolean,
      require: true,
    },
    furnished: {
      type: Boolean,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    offer: {
      type: Boolean,
      require: true,
    },
    imageUrls: {
      type: Array,
      require: true,
    },
    userRef: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertyModel);

export default Property;
