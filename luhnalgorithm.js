
// SELECT DOM ELEMENTS 
let testingFieldValue
const missingValuesNoOfTimes = document.getElementById('missingValuesNoOfTimes'), 
    testingField = document.getElementById('testingField'),
    validateWithLuhnButton = document.getElementById('validateWithLuhnButton'),  
    checkMissingValuesButton = document.getElementById('checkMissingValuesButton'),
    generateLuhnNumberButton = document.getElementById('generateLuhnNumberButton'),
    lengthOfGeneratedValuesField = document.getElementById('lengthOfGeneratedValuesField'),
    numberOfLuhnToGenerateField = document.getElementById('numberOfLuhnToGenerateField'), 
    allFields = document.getElementsByTagName('input')

    // DISPLAY BOX 
const displayBox = document.getElementById('displayField')

const log = (mystring) => {
    console.log(mystring)
}

// array.push(6)
const workOnInputedNumbers = (numbers) => {
    if(typeof numbers !== 'string') {
        log(numbers)
        throw new Error('value must be a string')
    }
    let numbersToArray = numbers.split('')
    numbersToArray = numbersToArray.map((stringNumber) => {
         if(stringNumber === '*'){
             return undefined
         }else {
            return parseInt(stringNumber)
         }        
    })
    return numbersToArray
}


// to generate random numbers 
const random = (min = 0, max = 9) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// to generate an array of random numbers with range of length between 14 and 16
const generateArray = (maxRange) => {
    const array = []
    if(typeof maxRange !== 'number'){
        throw new Error('range must be a number')
    }

    for(let i=0; i<maxRange; i++){
        array.push(random())
    }
    // console.log(array.length)
    return array
}

// to validate a luhn array
const validateWithLuhn = (array) => {
    let edittedArray = array.reverse()
    .map((item, itemIndex, items) => {
        if (itemIndex%2 !== 0){
             return item*2
        } else {
            return item
        }
    })
    .map((item, itemIndex, items) => {
        if (item > 9){
            return parseInt(item.toString().substr(0,1)) + parseInt(item.toString().substr(1, 1))
        }else {
            return item
        }
    })
    .reduce((total, item) => total + item, 0);
    
    return (edittedArray%10 === 0) ? true : false;
}


let count = 0
// to generate a valid luhn number 
const generateLuhnNumber = (maxValue) => {

    const maximumRange = parseInt(maxValue)    
    const freshArray = generateArray(maximumRange);
    const checkArrayValidity = validateWithLuhn(freshArray);
    if (checkArrayValidity === true){
        return freshArray.reverse()
    } 
    return generateLuhnNumber(maxValue)
}


// to run the generate luhn number n no of times 
const runGenerateLuhnNumberNTimes = (desiredLengthofNumber, numberOfItems) => {
    
    const itemNo = parseInt(numberOfItems)
    
    let LengthNo = parseInt(desiredLengthofNumber)
    const thisArrays = []
    for(let i=1; i<=itemNo; i++){
        thisArrays.push(generateLuhnNumber(LengthNo)) 
    }

    return thisArrays.map((item) => {
        return item.join("")
    })
}
// let possibleNumbers = 0
// function to replace missing numbers
const replaceMissingNumbers = (array, i) => {
    if (!Array.isArray(array, i)){
        throw new Error('number must be an array')
    }
    
    let possibleSolution = []
    // const answers = []
    // log(i)
       possibleSolution.push(array.map((item) => {
            if(typeof item !== 'undefined'){
                return item
            }else {
                return i
            }
        }))
        log(possibleSolution)
        const isValid = validateWithLuhn(possibleSolution)
        log(isValid)
        if(isValid) {
            log('this one was valid')
         return possibleSolution.reverse()
        } 

    }

// perform the missing values n times 
const generateMissingNumbersNTimes = (stringToTest) => {  
    const stringToArray = workOnInputedNumbers(stringToTest)
    const thisArrays = []
    const arraysToJoin = []
    for(let n=0; n<=9; n++){
        thisArrays.push(replaceMissingNumbers(stringToArray, n))
        // log(i, )
        // log(replaceMissingNumbers(stringToArray, n))
        // log(thisArrays)    
    }
    // log(thisArrays)
    thisArrays.forEach((array) => {
        if(array !== 'undefined'){
            arraysToJoin.push(thisArrays.map((item) => {
                return item.join("")
            }))
        }
    })
    return arraysToJoin
}



// ============== EVENT HANDLERS 

// test Numbers with Luhn handler 
const testNumbersWithLuhnHandler = (event, inputtedString, field) => {
    event.preventDefault()
    let inputtedStringValue = inputtedString.value.trim();
    field.innerHTML = ""
    log(inputtedStringValue)
    const generatedArray = workOnInputedNumbers(inputtedStringValue);
    const passed = validateWithLuhn(generatedArray);
    if(passed) {
        field.innerHTML = `<li class="list-group-item text-success">Number is valid</li>`
        return
    }else{
        field.innerHTML = `<li class="list-group-item text-danger">Not valid</li>`
        return
    }
}

// check for missing values handler 
const checkMissingValuesButtonHandler = (event, stringField, field) => {
    event.preventDefault()
    let stringValue = stringField.value.trim();
    // let numberofTimesValue = numberofTimesField.value.trim()
    field.innerHTML = ""
try{
    const arrayOfPossibleValues = generateMissingNumbersNTimes(stringValue);
    log(arrayOfPossibleValues)
    arrayOfPossibleValues.forEach((value, valueIndex) => {
        
        field.innerHTML += `<li class="list-group-item text-success"><span class="mr-3 text-primary">(${valueIndex+1})</span> ${value}</li>`
    });
    return 
} catch (err){
    console.log(err)
    field.innerHTML += `<li class="list-group-item text-danger">too much value to generate</li>`
}
    
}

// generate LUHN number button handler
const generateLuhnNumberButtonHandler = (event, field, desiredNumberLength, numberOfArrays) => {
    event.preventDefault()
    const desiredNumberLengthValue = desiredNumberLength.value.trim();
    const numberOfArraysValue = numberOfArrays.value.trim();
    let lengthOfString = parseInt(desiredNumberLengthValue)
    let numberOfTheArrays = parseInt(numberOfArraysValue)
    field.innerHTML = ""
    if(lengthOfString < 13 || lengthOfString > 16) {
        log('this should run')
        field.innerHTML = `<li class="list-group-item text-danger">Oops! Length must be within 13 to 16</li>`
    }
    const validLuhnNumbers = runGenerateLuhnNumberNTimes(lengthOfString, numberOfTheArrays)
    field.innerHTML = ""
    validLuhnNumbers.forEach((value, valueIndex) => {
        field.innerHTML += `<li class="list-group-item text-success"><span class="mr-3 text-primary">(${valueIndex+1})</span> ${value}</li>`
    })
}


// assign events to the functions
validateWithLuhnButton.addEventListener('click', (event) => {
    testNumbersWithLuhnHandler(event, testingField, displayBox)
})

checkMissingValuesButton.addEventListener('click', (event) => {
    checkMissingValuesButtonHandler(event, testingField, displayBox, missingValuesNoOfTimes)
})

generateLuhnNumberButton.addEventListener('click', (event) => {    
    generateLuhnNumberButtonHandler(event, displayBox, lengthOfGeneratedValuesField, numberOfLuhnToGenerateField)
})


