import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Sudoku = new Schema({
    sudokuContent: { type: String },
})

export default model("Sudoku", Sudoku)