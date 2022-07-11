import metaModel from "../../models/MetaModel.js";
import Sudoku from "../../models/Sudoku.js";

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const numberSudoku = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const drawFirstRandomBox = () => {
    const tempNumberSudoku = [...numberSudoku]
    const tempArray = []
    for (const i in numberSudoku) {
        const lenArray = tempNumberSudoku.length
        const randomIndex = getRandomInt(lenArray - 1)
        tempArray.push(tempNumberSudoku.splice(randomIndex, 1)[0])
    }
    return tempArray
}

const getArrayRow = (arrayNumbers, indexArrayRow, indexArrayCol) => {
    const tempArray = []
    const indexArrayRowCur = Math.floor(indexArrayRow % 3) //Получение индекса блока в ряду общее
    const indexArrayColCur = Math.floor(indexArrayCol % 3) //Получение номер элемента в блоке по ряду
    const indexArrayInAllRows = Math.floor(indexArrayRow / 3) * 3 //Получение начального индекса массива где брать ряд
    const cntGetElem = indexArrayRowCur * 3 + indexArrayColCur
    const rowElementInBlock = Math.floor((indexArrayCol) / 3)// Какой ряд у элемента в блоке
    let tempI = 1
    let indexArrayOriginal = indexArrayInAllRows
    for (let i = 1; i < cntGetElem + 1; i++) {
        let elementGetNumber = ((tempI - 1) + rowElementInBlock * 3)
        tempArray.push(arrayNumbers[indexArrayOriginal][elementGetNumber])
        if (i % 3 === 0) {
            indexArrayOriginal++
            tempI = tempI - 3
        }
        tempI++
    }
    return tempArray
}


const getArrayCol = (arrayNumbers, indexArrayRow, indexArrayCol) => {
    const tempArray = []
    const rowArrayInALl = Math.floor(indexArrayRow / 3) //Какой ряд у масссива
    const heightElementsAboveCurrent = Math.floor(indexArrayCol / 3) //Высота элементов над текущим в 1 ряду
    const cntGetElement = rowArrayInALl * 3 + heightElementsAboveCurrent //Количество элементов необходимых взять
    const startColIndex = indexArrayCol % 3
    let tempI = startColIndex
    let startArrayGetElement = indexArrayRow % 3
    for (let i = 1; i < cntGetElement + 1; i++) {
        tempArray.push(arrayNumbers[startArrayGetElement][tempI])
        tempI = tempI + 3
        if ([9, 10, 11].includes(tempI)) {
            tempI = startColIndex
            startArrayGetElement = startArrayGetElement + 3
        }
    }
    return tempArray
}


const drawAllNumberSudoku = () => {
    const tempArray = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    for (let i = 0; i < 9; i++) {
        let haveUndefined = false
        for (let j = 0; j < 9; j++) {
            const startNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            const numberInRowCurrentCell = getArrayRow(tempArray, i, j)
            const numberInColCurrentCell = getArrayCol(tempArray, i, j)
            const currentCell = tempArray[i]
            const allNumber = numberInRowCurrentCell.concat(numberInColCurrentCell, currentCell)
            const clearNumber = [...new Set(allNumber)]
            const readyNumber = startNumber.filter(value => !clearNumber.includes(value))
            const randomIndexArray = getRandomInt(readyNumber.length)
            const selectedNumber = readyNumber[randomIndexArray]
            if (selectedNumber === undefined) {
                haveUndefined = true
            }
            tempArray[i][j] = selectedNumber
        }
    }
    return tempArray
}


export const generateSudoku = async (cntSudoku) => {
    const arraySudoku = []
    let step = 1
    while (arraySudoku.length < cntSudoku) {
        let haveUndefined = false
        const tempArray = drawAllNumberSudoku()
        tempArray.forEach(elem => {
            elem.forEach((elem2) => {
                if (elem2 === undefined) {
                    haveUndefined  = true
                }
            })
        })
        if (!haveUndefined) {
            console.log(`success ${step}`)
            step++
            arraySudoku.push(tempArray)
            await Sudoku.insertMany([{
                sudokuContent: JSON.stringify(tempArray)
            }])
        }
    }
}

const getRandomIntNumber = (max) => {
    return Math.floor(Math.random() * max);
}

export const getSudokuVariable = async (req, res) => {
    try {
        const sudokuAll = await Sudoku.find()
        const randomIndex = await getRandomIntNumber(sudokuAll.length)
        res.json({sudoku:sudokuAll[randomIndex]})
    } catch (e) {
        console.log(e)
    }
}