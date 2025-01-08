// Импорты:
import './pages/index.css';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getCards,
  editProfileApi,
  addNewcardApi,
  deleteCardApi,
  likeCardApi,
  dislikeCardApi,
  avatarChangeApi
} from './components/api.js';

// Глобальные переменные:
const list = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');

const profileButtonEdit = document.querySelector('.profile__edit-button');
const profilePopupEdit = document.querySelector('.popup_type_edit');
const profileFormEdit = document.querySelector('.popup__form[name="edit-profile"]');
const profileInputName = document.querySelector('.popup__input_type_name');
const profileInputDescription = document.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardAddButton = document.querySelector('.profile__add-button');
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const newCardName = document.querySelector('.popup__input_type_card-name');
const newCardLink = document.querySelector('.popup__input_type_url');

const imagePopup = document.querySelector('.popup_type_image');
const imagePopupContent = document.querySelector('.popup__image');
const imagePopupCaption = document.querySelector('.popup__caption');

const profileImage = document.querySelector('.profile__image');
const profileImagePopup = document.querySelector('.popup_type_avatar');
const profileImageForm = document.querySelector('.popup__form[name="avatar"]');
const profileImageInput = document.querySelector('.popup__input_avatar_url');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: '.popup__input_type_error',
    errorClass: 'popup__error_visible',
  };

// API
let currentId;

Promise.all([getUserInfo(), getCards()])
  .then(([userInfo, cards]) => {
    currentId = userInfo._id;
    profileImage.style.backgroundImage = `url(${userInfo.avatar})`;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    renderCards(cards, deleteCard, currentId, deleteCardApi);
    setupEventLisneners();
  })
    .catch((err) => {
      console.log(err);
});

// Слушатели событий:
function setupEventLisneners() {

  profileImage.addEventListener('click', () => {
    openModal(profileImagePopup);
    profileImageInput.value = '';
    clearValidation(validationConfig, profileImageForm);
  })

  profileButtonEdit.addEventListener('click', () => {
    openModal(profilePopupEdit);
    profileInputName.value = profileName.textContent;
    profileInputDescription.value = profileDescription.textContent;
    clearValidation(validationConfig, profileFormEdit);
  });

  newCardAddButton.addEventListener('click', () => {
      openModal(newCardPopup);
      newCardName.value = '';
      newCardLink.value = '';
      clearValidation(validationConfig, newCardForm);
  });



  profileImageForm.addEventListener('submit', submitProfileImageForm);
  newCardForm.addEventListener('submit', submitNewCardForm);
  profileFormEdit.addEventListener('submit', editProfile);
};

// Функции:
async function submitNewCardForm(evt) {
  evt.preventDefault();
  const submitButton = newCardPopup.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  try {
    const newCard = await addNewcardApi(newCardName ,newCardLink);
    const cardRendered = createCard(newCard, deleteCard, likeCardApi, openImage, currentId, deleteCardApi, dislikeCardApi);
    list.prepend(cardRendered);
    newCardForm.reset();
    closeModal(newCardPopup);
  } catch (err) {
    console.log(err)
  } finally { submitButton.textContent = initialText; };
};

async function submitProfileImageForm(evt) {
  evt.preventDefault();
  const submitButton = profileImagePopup.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  try {
    const updatedUser = await avatarChangeApi(profileImageInput);
    profileImage.style.backgroundImage = `url(${updatedUser.avatar})`;
    closeModal(profileImagePopup);
    profileImageForm.reset();
  } catch (err) {
    console.log(err)
  } finally { submitButton.textContent = initialText; };  
};

async function editProfile(evt) {
  evt.preventDefault();
  const submitButton = profilePopupEdit.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  try {
    const updatedUser = await editProfileApi(profileInputName, profileInputDescription);
    profileName.textContent = updatedUser.name;
    profileDescription.textContent = updatedUser.about;
    closeModal(profilePopupEdit);
  } catch (err) {
    console.log(err)
  } finally { submitButton.textContent = initialText };
};

function renderCards(cards, deleteFunc, currentId, deleteCardApi) {
    list.innerHTML = '';
    cards.forEach(element => {
        const cardRendered = createCard(element, deleteFunc, likeCardApi, openImage, currentId, deleteCardApi, dislikeCardApi);
        list.append(cardRendered);
    });
};

function openImage(item) {
  imagePopupContent.src = item.link;
  imagePopupContent.alt = item.name;
  imagePopupCaption.textContent = item.name;
  openModal(imagePopup);
}

popups.forEach(popup => {
    popup.addEventListener('click', (event) => {
        if (event.target.classList.contains('popup__close') || event.target === event.currentTarget) {
            closeModal(popup);
        }
    });
});

enableValidation(validationConfig);
