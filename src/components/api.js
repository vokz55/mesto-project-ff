const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-29',
  headers: {
    authorization: 'aedd4a3c-a725-44ae-aa16-b18a395a978d',
    'Content-Type': 'application/json'
  }
};

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

const request = (endpoint, options = {}) => {
  return fetch(`${config.baseUrl}${endpoint}`, {
    headers: config.headers,
    ...options,
  }).then(handleResponse);
};

export const getUserInfo = () => request('/users/me');

export const getCards = () => request('/cards');

export const editProfileApi = (inputNameProfile, inputJobProfile) => {
  return request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({
      name: inputNameProfile.value,
      about: inputJobProfile.value,
    }),
  });
};

export const addNewcardApi = (newCardName, newCardLink) => {
  return request('/cards', {
    method: 'POST',
    body: JSON.stringify({
      name: newCardName.value,
      link: newCardLink.value,
    }),
  });
};

export const deleteCardApi = (cardId) => {
  return request(`/cards/${cardId}`, {
    method: 'DELETE',
  });
};

export const likeCardApi = (cardId) => {
  return request(`/cards/likes/${cardId}`, {
    method: 'PUT',
  });
};

export const dislikeCardApi = (cardId) => {
  return request(`/cards/likes/${cardId}`, {
    method: 'DELETE',
  });
};

export const avatarChangeApi = (inputAvatarUrl) => {
  return request('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({
      avatar: inputAvatarUrl.value,
    }),
  });
};