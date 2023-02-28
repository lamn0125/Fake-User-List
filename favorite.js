const BASAL_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASAL_URL + "/api/v1/users/";
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || [];
let dataPanel = document.querySelector("#data-panel");
const userInfo = document.querySelector('#userInfo')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredUsers = [];

//search users by entering name or surname
searchForm.addEventListener('submit', function onSearchFormSubmitted (event){
  event.preventDefault();
  let keyword = searchInput.value.trim().toLowerCase();

  filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(keyword) ||
    user.surname.toLowerCase().includes(keyword) 
  )
  if (filteredUsers.length === 0 ) {
    return alert ('No found users') 
  }
  renderUserList(filteredUsers)
})

function showUserModal(id) {
  const userName = document.querySelector("#userName");
  const userDescription = document.querySelector("#userDescription");
  const userAvatar = document.querySelector("#userAvatar");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;

    userName.innerText = data.name + " " + data.surname;
    userAvatar.innerHTML = `
      <img src="${data.avatar}" alt="user avatar" class="img-fluid">
    `
    userDescription.innerHTML = `
      <p>Email: ${data.email}</p>
      <p>Gender: ${data.gender}</p>
      <p>Age: ${data.age}</p>
      <p>Region: ${data.region}</p>
      <p>Birthday: ${data.birthday}</p>
      <button type="button" class="btn btn-danger remove-user-btn" data-id=${data.id} data-bs-dismiss="modal">Remove Friend!</button>
    `
  });
}

//remove from favorite
userInfo.addEventListener('click', function onRemoveUserButtonClicked(event){
  if (event.target.matches('.remove-user-btn')){
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function removeFromFavorite(id){
  if (!users) return 
  
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
  if (users == 0) {
    localStorage.removeItem('favoriteUsers')
  }

}

//search 
dataPanel.addEventListener("click", function onAvatarClicked(event) {
  if (event.target.matches(".userAvatar")) {
    showUserModal(event.target.dataset.id);
  } 
});

function renderUserList(user) {
  let rawHTML = "";
  user.forEach((item) => {
    rawHTML += `
    <div class="col-sm-2">
      <div class="user card mb-2">
        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#userInfo">
              <img class="card-img-top userAvatar" src="${item.avatar
      }" data-id="${item.id}" alt="User Avatar">
            </button>
            <div class="card-body">
              <p class="card-text">${item.name + ' ' + item.surname}</p>             
            </div>
      </div>
    </div>  
  `;
    dataPanel.innerHTML = rawHTML;
  });
}

 renderUserList(users)