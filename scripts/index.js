// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const list = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(item, deleteCard) { 
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    cardImage.src = item.link;
    cardImage.alt = item.name;
    cardTitle.textContent = item.name;
    deleteButton.addEventListener('click', () => {
        deleteCard(cardElement);
    });
    return cardElement;
};

// @todo: Функция удаления карточки
function deleteCard(card) {
    card.remove();
};

// @todo: Вывести карточки на страницу
function renderCards(cards, deleteFunc) {
    cards.forEach(element => {
        const cardRendered = createCard(element, deleteFunc);
        list.append(cardRendered);
    });
}

renderCards(initialCards, deleteCard);
































// // @todo: Темплейт карточки
// const cardTemplate = document.querySelector('#card-template').content;

// // @todo: DOM узлы
// const list = document.querySelector('.places__list');

// // @todo: Функция создания карточки
// function createCard (initialCards, deleteCallBack) { 
//     initialCards.forEach(element => {
//         const card = cardTemplate.querySelector('.card').cloneNode(true);
//         const deleteButton = card.querySelector('.card__delete-button');
//         card.querySelector('.card__image').setAttribute('src', element.link);
//         card.querySelector('.card__title').textContent = element.name;
//         list.append(card);
//         deleteButton.addEventListener('click', () => {
//             deleteCallBack(card);
//         });
//     });
// };

// // @todo: Функция удаления карточки
// function deleteCard(cardList) {
//     cardList.remove();
// };

// // @todo: Вывести карточки на страницу
// createCard(initialCards, deleteCard);