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
  const buttonConfirm = popupConfirm.querySelector('.popup__button__confirm');
  const cardLikeActive = 'card__like-button_is-active';
  const popupActive = 'popup_is-opened';
  const itemIdApi = item._id;

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  likeCount.textContent = item.likes?.length || 0;

  if (item.owner && item.owner._id === currentId) {
    deleteButton.classList.add(deleteButtonActive);
  }

  deleteButton.addEventListener('click', () => {    
    deleteButtonCard(popupConfirm, popupActive, deleteCard, deleteCardApi, cardElement, itemIdApi, buttonConfirm)
  });

  const isLiked = item.likes.some((user) => user._id === currentId);
  likeButton.classList.toggle(cardLikeActive, isLiked);

  likeButton.addEventListener('click', () => {
    toggleLike(likeCardApi, dislikeCardApi, itemIdApi, likeButton, likeCount, cardLikeActive)
  });

  cardImage.addEventListener('click', () => {
    openImage(item);
  });

  return cardElement;
}

function deleteButtonCard(popupConfirm, popupActive, deleteCard, deleteCardApi, cardElement, itemIdApi, buttonConfirm) {
  popupConfirm.classList.remove(popupActive);
  popupConfirm.classList.add(popupActive);
  const handleConfirmClick = () => {
    deleteCard(cardElement);
    deleteCardApi(itemIdApi);
    popupConfirm.classList.remove(popupActive);
    buttonConfirm.removeEventListener('click', handleConfirmClick);
  };
  buttonConfirm.addEventListener('click', handleConfirmClick);
}

function toggleLike(likeCardApi, dislikeCardApi, itemIdApi, likeButton, likeCount, cardLikeActive) {
  const isLiked = likeButton.classList.contains(cardLikeActive);
  const likeAction = isLiked ? dislikeCardApi : likeCardApi;

  likeAction(itemIdApi)
    .then((updatedCard) => {
      likeButton.classList.toggle(cardLikeActive, !isLiked);
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

export function deleteCard(card) {
  card.remove();
}