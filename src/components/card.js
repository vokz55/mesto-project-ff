export function createCard(item, deleteCard, likeCard, openImage) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    // captionPopup.textContent = item.name;
    cardImage.src = item.link;
    cardImage.alt = item.name;
    cardTitle.textContent = item.name;

    deleteButton.addEventListener('click', () => {
        deleteCard(cardElement);
    });

    likeButton.addEventListener('click', () => {
        likeCard(likeButton);
    });

    cardImage.addEventListener('click', () => {
        openImage(item);
    });

    return cardElement;
};

export function deleteCard(card) {
    card.remove();
};

export function likeCard(element) {
    element.classList.toggle('card__like-button_is-active');
};