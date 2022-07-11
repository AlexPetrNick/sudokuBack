import express from 'express'
import {getSudokuVariable} from "../common/Controller/sudokuController.js";


const router = new express.Router();

router.get('/get_sudoku_variant', getSudokuVariable)


export default router;
