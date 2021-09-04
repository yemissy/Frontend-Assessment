// Your application goes here
const BASE_URL = 'https://putsreq.com/RWhI8ht10y5kqfmemrML';

let labelTags = document.getElementsByClassName('label-tag');
let inputTags = document.getElementsByClassName('input-label')
let field = document.getElementById('field-set');
let legendTag = document.getElementById('legend');
let radioLabels = document.getElementsByClassName('radio-label');
let radioInputs = document.getElementsByClassName('radio-input');


function handleValueUpdate(){
    let tags = document.querySelectorAll('input');
    tags.forEach(inputField => {
        inputField.addEventListener('input', (e) => {
            inputField.setAttribute('value', e.target.value)
        })
    })
}
function alertBox(){

}

function snackbarStyle(div){
    let main = document.querySelector('main')
    let h2 = document.createElement('h2')
   
    h2.innerText = 'Thank You For your Submission...'
    h2.style.position = 'relative'
    h2.style.top = '25%'

    div.appendChild(h2)
    div.style.width = '30%'
    div.style.height = '20%'
    div.style.backgroundColor = '#ACDF87'
    div.style.color = '#000000'
    div.style.borderRadius = '5px'
    div.style.position = 'absolute'
    div.style.left = '50%'
    div.style.top = '45%'
    div.style.transform = 'translate(-50%, -50%)'
    div.style.margin = 'auto'
    div.style.textAlign = 'center'
    div.style.display = 'none'
    main.appendChild(div)
    return div
}


document.addEventListener('submit', (event) =>{
    event.preventDefault()
    let snackDiv = document.createElement('div')
    let el = snackbarStyle(snackDiv)

    el.addEventListener('click', (e) => {
        e.target.style.display = 'none'
    })

    
    let dataArray = serializeForm()
    fetch(`${BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(dataArray),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((response) => {
        if(response.status === 200){
            el.style.display = 'block'
        }
    })
    .then((data) => {
        console.log(data)
    })
    .catch((err) => console.log(err))
})

function serializeForm(){
    let formDataArr = []
    let obj = {name: '', value: ''}
    let form = document.getElementById('form')
    let formData = new FormData(form);
    for(let [key, value] of formData.entries()){
        obj.name = key
        obj.value = value
        formDataArr.push(obj)
        obj = {}
    }
    return formDataArr
}

//GET DATA FROM ENDPOINT
function get(){
    window.fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
    })
    .then((response )=> response.json())
    .then((data )=> {
        getReturnedData(data)
    })
    .catch((err) => console.log(err))
}
get();

function getReturnedData(data){
    let attrs = Object.keys(data[0]).filter(val => val !== "label");
    data.forEach((question, indx) => {

        //check for question with option 
        if(question.type === 'radio'){
            let options = question.options
            legendTag.innerText = question.legend
            showRadioOption(options, data, attrs)
        }else{
            labelTags[indx].innerText = question.label

        }
    });
    addAttributes(labelTags, inputTags, data, attrs)
}

function addAttributes(labelTags, inputsTags, questions, attrs){

    for(let i = 0; i < inputsTags.length; i++){
        if( i !== inputsTags.length - 1){
            labelTags[i].setAttribute('for', questions[i].name)
            inputTags[i].setAttribute('value', '')

            if(questions[i].name === 'contactPhone') {
                inputTags[i].setAttribute('pattern', questions[i].pattern)
            }

            attrs.forEach(attr => {
                //solve for radio and solves for adding true false to required attribute
                if(attr  !== 'required' ){
                    inputsTags[i].setAttribute(attr, questions[i][attr])
                }
                else{
                    if(questions[i][attr] === 1){
                        inputsTags[i].setAttribute(attr, 'true') 
                    }               
                    else{
                        inputsTags[i].setAttribute(attr, 'false')
                    }
                }
            })
        }
        else{ //submit button attr
            inputsTags[i].setAttribute('type', 'submit')
            inputsTags[i].setAttribute('value', 'Submit')
        }
    }
    handleValueUpdate()
}

function showRadioOption(radioOptions, questions, attrs){
    let optionAttrs = Object.keys(radioOptions[0]).filter(val => val !== "label");

    //Get index of question with type radio; Works well if there is just one radio question
    let questionIndex = questions.findIndex(question => question.type === 'radio')

    //SET ATTRIBUTE FOR FIELDSET
    attrs.forEach(attr => {
        if(attr  !== 'required'){
            field.setAttribute(attr, questions[questionIndex][attr])
        }
        else{
            if(questions[questionIndex][attr] === 1){
                field.setAttribute(attr, 'true') 
            }               
            else{
                field.setAttribute(attr, 'false')
            }
        }
    })

    //SET ATTRIBUTE FOR RADIO INPUT
    for(let i = 0; i < radioInputs.length; i++){

        radioLabels[i].innerText = radioOptions[i].label // THIS COULD GO OUT OF BOUND IF the length of 'optionAttrs' keys is greater than how many radio options exist in total"        
        radioInputs[i].setAttribute('type', 'radio')
        
        optionAttrs.forEach((attr, indx )=> {
            radioInputs[i].setAttribute(attr, radioOptions[i][attr])       
            radioInputs[i].setAttribute('name', questions[questionIndex].name)
            radioInputs[i].setAttribute('required', questions[questionIndex].required)   
        })
    }
}