const BASAL_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASAL_URL + "/api/v1/users/";
const users = [];
let dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const userInfo = document.querySelector('#userInfo')
let pagination = document.querySelector('.pagination')
// let addUserBtn = document.querySelector('.add-user-btn')
let filteredUsers = [];
const USERS_PER_PAGE = 18;

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
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

function getUsersByPage(page){
  const data = filteredUsers.length? filteredUsers : users 
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)

}

function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1;page <= numberOfPage; page++){
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  pagination.innerHTML = rawHTML
  }
}
pagination.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
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
      <button type="button" class="btn btn-warning add-user-btn" data-id=${data.id} data-bs-dismiss="modal">Add Friend!</button>
    `
  });
}

function addToUserFavorite (id){
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)

  if (list.some((user) => user.id === id)) {
    return alert("You've added this user")
  }
  list.push(user)
   localStorage.setItem('favoriteUsers', JSON.stringify(list))
}
//add user to favorite
  userInfo.addEventListener('click', function onAddUserButtonClicked(event){
    if(event.target.matches('.add-user-btn')){
      addToUserFavorite(Number((event.target.dataset.id)))
    }
  })

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
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1));
  })
  .catch((error) => {
    console.log(error);
  });