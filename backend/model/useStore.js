import mongoose from "mongoose";
const storeschema = new mongoose.Schema({
  img: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  title: {
    type: string,
    require: true,
  },
});

const store = mongoose.Model("store", storeschema);
export default store;
