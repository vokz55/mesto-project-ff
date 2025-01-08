const isValid = (input, errorVisible) => {
    const errorInput = document.querySelector(`.${input.name}-error`);
    
    if (input.validity.patternMismatch) {
        errorInput.textContent = input.dataset.errorMessage;
        errorInput.classList.add(errorVisible);
    } else if (!input.validity.valid) {
        errorInput.textContent = input.validationMessage;
        errorInput.classList.add(errorVisible);
    } else {
        errorInput.textContent = '';
        errorInput.classList.remove(errorVisible);
    };
}

export function enableValidation(object) {
    const popupForms = document.querySelectorAll(object.formSelector);
    popupForms.forEach((form)=>{
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        const popupInputs = form.querySelectorAll(object.inputSelector);
        const formSumitButton = form.querySelector(object.submitButtonSelector);
        const formSubmitButtonDisabled = object.inactiveButtonClass;
        const errorVisible = object.errorClass;       
        toggleSubmitButton(form, formSumitButton, formSubmitButtonDisabled);
        popupInputs.forEach((input) => {
            input.addEventListener('input', () => {
                isValid(input, errorVisible);
                toggleSubmitButton(form, formSumitButton, formSubmitButtonDisabled);
            });
        });
    });
};

function toggleSubmitButton(form, submitButton, submitButtonDis) {
    if(form.checkValidity()) {
        submitButton.classList.remove(submitButtonDis);
        submitButton.disabled = false;
    } else {
        submitButton.classList.add(submitButtonDis);
        submitButton.disabled = true;
    }
}

export function clearValidation(objectSet, formEdit) {
    const popupsInputError = formEdit.querySelectorAll(objectSet.inputErrorClass);
    const errorVisible = objectSet.errorClass;

    const popupSubmitButton = formEdit.querySelector(objectSet.submitButtonSelector);
    const submitButtonsDis = objectSet.inactiveButtonClass;
    
    if(!popupSubmitButton.classList.contains(submitButtonsDis)) {
        popupSubmitButton.classList.add(submitButtonsDis);
    }

    popupsInputError.forEach((inputError) => {
        inputError.textContent = '';
        if(inputError.classList.contains(errorVisible)) {
            inputError.classList.remove(errorVisible);
        }
    })
};