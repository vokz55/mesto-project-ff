// Импорты:
import './pages/index.css';
import {initialCards} from './scripts/cards.js';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

// Глобальные переменные:
const list = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupNewCardButton = document.querySelector('.profile__add-button');
const popups = document.querySelectorAll('.popup');
const formEditProfile = document.querySelector('.popup__form');
const inputNameProfile = document.querySelector('.popup__input_type_name');
const inputJobProfile = document.querySelector('.popup__input_type_description');
const nameProfile = document.querySelector('.profile__title');
const jobProfile = document.querySelector('.profile__description');
const formCreateNewCard = document.querySelector('.popup__form[name="new-place"]');
const newCardName = document.querySelector('.popup__input_type_card-name');
const newCardLink = document.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup_type_image');
const imagePopup = document.querySelector('.popup__image');
const captionPopup = document.querySelector('.popup__caption');

// Рендер карточек:
function renderCards(cards, deleteFunc) {
    cards.forEach(element => {
        const cardRendered = createCard(element, deleteFunc, likeCard, openImage);
        list.append(cardRendered);
    });
};

renderCards(initialCards, deleteCard);

// Закрытие и открытие модлак
editButton.addEventListener('click', () => {
    openModal(editPopup);
    inputNameProfile.value = nameProfile.textContent;
    inputJobProfile.value = jobProfile.textContent;
});

popupNewCardButton.addEventListener('click', () => {
    openModal(popupNewCard);
    newCardName.value = '';
    newCardLink.value = '';
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
function EditProfile(evt) {
    evt.preventDefault();

    const inputNameProfileValue = inputNameProfile.value;
    const inputJobProfileValue = inputJobProfile.value;

    nameProfile.textContent = inputNameProfileValue;
    jobProfile.textContent = inputJobProfileValue;
    closeModal(editPopup);
}

formEditProfile.addEventListener('submit', EditProfile);

// Создание новой карточки
function submitNewCardForm(evt) {
    evt.preventDefault();

    const nameInputValue = newCardName.value;
    const linkInputValue = newCardLink.value;
    const newCard =
        {
          name: nameInputValue,
          link: linkInputValue,
        };

    createNewCard(newCard, deleteCard);
}

function createNewCard(newCard, deleteFunc) {
    const cardRendered = createCard(newCard, deleteFunc, likeCard, openImage);
    list.prepend(cardRendered);
    closeModal(popupNewCard);
};

formCreateNewCard.addEventListener('submit', submitNewCardForm);