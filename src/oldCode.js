// index.js
// Импорты:
import './pages/index.css';
import {initialCards} from './scripts/cards.js';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

// Глобальные переменные:
// Общие переменные:
const list = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');

// Редактирование профиля:
// profileButtonEdit
// profilePopupEdit
// profileFormEdit
// profileInputName
// profileInputDescription
// profileName
// profileDescription
const editButton = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');
const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const inputNameProfile = document.querySelector('.popup__input_type_name');
const inputJobProfile = document.querySelector('.popup__input_type_description');
const nameProfile = document.querySelector('.profile__title');
const jobProfile = document.querySelector('.profile__description');

// Новая карточка:
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupNewCardButton = document.querySelector('.profile__add-button');
const formCreateNewCard = document.querySelector('.popup__form[name="new-place"]');
const newCardName = document.querySelector('.popup__input_type_card-name');
const newCardLink = document.querySelector('.popup__input_type_url');



const popupImage = document.querySelector('.popup_type_image');
const imagePopup = document.querySelector('.popup__image');
const captionPopup = document.querySelector('.popup__caption');

const avatarEdit = document.querySelector('.popup_type_avatar');
const avatarClick = document.querySelector('.profile__image');
const formAvatar = document.querySelector('.popup__form[name="avatar"]');
const inputAvatarUrl = document.querySelector('.popup__input_avatar_url');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: '.popup__input_type_error',
    errorClass: 'popup__error_visible',
  };

// API  
function getUserInfo() {

    return fetch('https://mesto.nomoreparties.co/v1/wff-cohort-29/users/me', {
      headers: {
        authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
      },
    })
      .then((res) => {
        return res.json();
      })
}

getUserInfo();

function getCards() {

    return fetch('https://mesto.nomoreparties.co/v1/wff-cohort-29/cards', {
      headers: {
        authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
      },
    })
      .then((res) => {
        return res.json();
      })
}

getCards();

function editProfileApi() {
    fetch('https://mesto.nomoreparties.co/v1/wff-cohort-29/users/me', {
      method: 'PATCH',
      headers: {
        authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: inputNameProfile.value,
        about: inputJobProfile.value,
      }),
    })
}

function addNewcardApi() {
  return fetch('https://mesto.nomoreparties.co/v1/wff-cohort-29/cards', {
      method: 'POST',
      headers: {
          authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          name: newCardName.value,
          link: newCardLink.value,
      }),
  })
  .then(res => {
      if (!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json(); // Возвращаем данные созданной карточки
  });
}


function deleteCardApi(cardId) {
    fetch(`https://mesto.nomoreparties.co/v1/wff-cohort-29/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
          'Content-Type': 'application/json',
        }
      })
}

// API: Поставить лайк
function likeCardApi(cardId) {
  return fetch(`https://mesto.nomoreparties.co/v1/wff-cohort-29/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  });
}

// API: Снять лайк
function dislikeCardApi(cardId) {
  return fetch(`https://mesto.nomoreparties.co/v1/wff-cohort-29/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  });
}

function avatarChangeApi() {
  return fetch('https://mesto.nomoreparties.co/v1/wff-cohort-29/users/me/avatar', {
    method: 'PATCH',
    headers: {
      authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar: inputAvatarUrl.value,
    }),
  })
  .then((response) => {
    if (!response.ok) {
      return response.json().then((err) => Promise.reject(err));
    }
    return response.json();
  })
  .catch((error) => {
    console.error('Ошибка при обновлении аватара:', error);
    throw error;
  });
}


// Передаём массив с промисами методу Promise.all
Promise.all([getUserInfo(), getCards()])
  .then(([userInfo, cards]) => {
    // Устанавливаем данные пользователя
    const currentId = userInfo._id;
    avatarClick.style.backgroundImage = `url(${userInfo.avatar})`;
    nameProfile.textContent = userInfo.name;
    jobProfile.textContent = userInfo.about;
    console.log([userInfo, cards]);
    // Рендерим карточки
    renderCards(cards, deleteCard, currentId, deleteCardApi);

    // Обработчик формы добавления новой карточки
    formCreateNewCard.addEventListener('submit', async (evt) => {
      evt.preventDefault();

      const submitButton = popupNewCard.querySelector('.popup__button');
      const initialText = submitButton.textContent;
      submitButton.textContent = 'Сохранение...'; // Показываем пользователю, что идёт загрузка

      try {
        // Добавляем новую карточку через API
        const newCard = await addNewcardApi();
        
        // Рендерим новую карточку
        const cardRendered = createCard(newCard, deleteCard, likeCardApi, openImage, currentId, deleteCardApi, dislikeCardApi);
        list.prepend(cardRendered); // Добавляем в DOM

        // Сбрасываем форму и закрываем попап
        formCreateNewCard.reset();
        closeModal(popupNewCard);
      } catch (err) {
        console.error('Ошибка при добавлении карточки:', err);
        alert('Не удалось добавить карточку. Проверьте данные и попробуйте снова.');
      } finally {
        submitButton.textContent = initialText; // Возвращаем текст кнопки в исходное состояние
      }
    });


    formAvatar.addEventListener('submit', async (evt) => {
      evt.preventDefault();
    
      const submitButton = avatarEdit.querySelector('.popup__button');
      const initialText = submitButton.textContent;
      submitButton.textContent = 'Сохранение...'; // Показываем пользователю, что идёт загрузка
    
      try {
        // Вызываем API для изменения аватара
        const updatedUser = await avatarChangeApi();
    
        // Обновляем аватар в DOM с использованием нового URL
        avatarClick.style.backgroundImage = `url(${updatedUser.avatar})`;
    
        // Закрываем модальное окно
        closeModal(avatarEdit);
    
        // Очищаем форму
        formAvatar.reset();
      } catch (err) {
        console.error('Ошибка при обновлении аватара:', err);
        alert('Не удалось обновить аватар. Проверьте данные и попробуйте снова.');
      } finally {
        submitButton.textContent = initialText; // Возвращаем текст кнопки в исходное состояние
      }
    });
    
  });
  
  avatarClick.addEventListener('click', () => {
    openModal(avatarEdit);
    inputAvatarUrl.value = '';
    clearValidation(validationConfig, formAvatar);
  })

// Рендер карточек:
function renderCards(cards, deleteFunc, currentId, deleteCardApi) {
    list.innerHTML = '';
    cards.forEach(element => {
        const cardRendered = createCard(element, deleteFunc, likeCardApi, openImage, currentId, deleteCardApi, dislikeCardApi);
        list.append(cardRendered);
    });
};



// Закрытие и открытие модлак
editButton.addEventListener('click', () => {
    openModal(editPopup);
    inputNameProfile.value = nameProfile.textContent;
    inputJobProfile.value = jobProfile.textContent;
    clearValidation(validationConfig, formEditProfile);
});

popupNewCardButton.addEventListener('click', () => {
    openModal(popupNewCard);
    newCardName.value = '';
    newCardLink.value = '';
    clearValidation(validationConfig, formCreateNewCard);
});

popups.forEach(popup => {
    popup.addEventListener('click', (event) => {
        if (event.target.classList.contains('popup__close') || event.target === event.currentTarget) {
            closeModal(popup);
        }
    });
});

function openImage(item) {
    imagePopup.src = item.link;
    imagePopup.alt = item.name;
    captionPopup.textContent = item.name;
    openModal(popupImage);
}

// Редактирование профиля
function editProfile(evt) {
    evt.preventDefault();
    editProfileApi()
    nameProfile.textContent = inputNameProfile.value;
    jobProfile.textContent = inputJobProfile.value;
    closeModal(editPopup);
}


formEditProfile.addEventListener('submit', editProfile);


enableValidation(validationConfig);



























// card.js
export function likeCard(likeButton, likeCount, cardId, isLiked) {
  // Определяем запрос в зависимости от состояния лайка
  const likeAction = isLiked ? dislikeCardApi : likeCardApi;

  likeAction(cardId)
    .then((updatedCard) => {
      // Обновляем состояние лайка и счётчик
      likeButton.classList.toggle('card__like-button_is-active', !isLiked);
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error(`Ошибка при изменении лайка: ${err}`);
      alert('Не удалось изменить лайк. Попробуйте снова.');
    });
}  

export function createCard(item, deleteCard, likeCardApi, openImage, currentId, deleteCardApi, dislikeCardApi) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButtonActive = 'card__delete-button_is-active';
  const popupConfirm = document.querySelector('.popup__type__confirm');
  const ButtonConfirm =  document.querySelector('.popup__button__confirm');
  const popupActive = 'popup_is-opened';
  const itemIdApi = item._id;

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;

  if (item.likes && Array.isArray(item.likes)) {
    likeCount.textContent = item.likes.length;
  }

  // Отображаем кнопку удаления только для карточек текущего пользователя
  if (currentId === item.owner._id) {
    deleteButton.classList.add(deleteButtonActive);
  }

  // Логика удаления карточки
  deleteButton.addEventListener('click', () => {    
      popupConfirm.classList.add(popupActive);
      ButtonConfirm.addEventListener('click', () => {
          deleteCard(cardElement);
          deleteCardApi(itemIdApi);
          popupConfirm.classList.remove(popupActive);
      })
  });

  const isLiked = item.likes.some((user) => user._id === currentId); // Проверяем, лайкнул ли текущий пользователь
likeButton.classList.toggle('card__like-button_is-active', isLiked); // Устанавливаем начальное состояние кнопки

likeButton.addEventListener('click', () => {
// Проверяем, лайкнута ли карточка на момент клика
const liked = likeButton.classList.contains('card__like-button_is-active');

// Выбираем нужный API-запрос в зависимости от состояния лайка
const likeAction = liked ? dislikeCardApi : likeCardApi;

// Отправляем запрос на сервер
likeAction(itemIdApi)
  .then((updatedCard) => {
    // Обновляем количество лайков и состояние кнопки
    likeCount.textContent = updatedCard.likes.length;
    likeButton.classList.toggle('card__like-button_is-active', !liked);
  })
  .catch((err) => {
    console.error(`Ошибка при изменении лайка: ${err.message}`);
  });
});


  // Логика открытия изображения
  cardImage.addEventListener('click', () => {
    openImage(item);
  });

  return cardElement;
}

export function deleteCard(card) {
  card.remove();
};


// modal.js
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleKeydown);
};

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleKeydown);
};

function handleKeydown(event) {
  if (event.key === 'Escape') {
      const openPopupElement = document.querySelector('.popup_is-opened');
      if (openPopupElement) {
          closeModal(openPopupElement);
      }
  }
}


// validation.js
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
  } else {
      submitButton.classList.add(submitButtonDis);
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