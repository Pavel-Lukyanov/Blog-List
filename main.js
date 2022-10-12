//Прелоадер
window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 500);
}

let container = document.getElementById('root');
let gorest = 'https://gorest.co.in/public-api/posts';

//Загрузка данных
async function loadList(gorest) {
  const response = await fetch(gorest);
  const data = await response.json();
  createList(data);
  paginationBtn(data);
  /* console.log(data); */
}

//Создание списка
function createList(data) {
  data.data.forEach(el => {
    let link = document.createElement('a');
    let li = document.createElement('li');
    link.href = '#';
    li.classList.add('list-group-item');
    link.textContent = el.title;
    li.append(link);
    container.append(li);
  });
}

//Отрисовка кнопок пагинации
function paginationBtn(data) {
  let pagination = document.getElementById('pagination');
  pages = data.meta.pagination.pages;
  for (let i = 1; i <= pages; i++) {
    let btn = document.createElement('button');
    btn.textContent = i;
    pagination.append(btn);
  }
  listenerPagination();
}

//Слушатель на кнопках пагинации
function listenerPagination() {
  let btns = document.querySelectorAll('button');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      let container = document.getElementById('root');
      let btns = document.getElementById('pagination');
      btns.innerHTML = '';
      container.innerHTML = '';
      loadList(gorest + `?page=${btn.textContent}`);
    })
  });
}

document.addEventListener('DOMContentLoaded', function () {

  loadList(gorest);
})
