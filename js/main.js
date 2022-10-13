
let container = document.getElementById('root');
let gorest = 'https://gorest.co.in/public-api/posts';

//Загрузка данных
async function loadList(gorest) {
    document.body.classList.remove('loaded');
    const response = await fetch(gorest);
    const data = await response.json();
    if (!data) return
    createList(data);
    paginationBtn(data);
    document.body.classList.add('loaded');
    /* console.log(data) */
}

//Создание списка
function createList(data) {
    data.data.forEach(el => {
        let link = document.createElement('a');
        let li = document.createElement('li');
        link.href = `post.html?id=${el.id}`;
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
        btn.classList.add('btn');
        btn.classList.add('btn-primary');
        btn.type = 'button';
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

//Получение данных для детальной страницы
async function loadDetail(gorest, pageParams) {
    document.body.classList.remove('loaded');
    const response = await fetch(gorest + `/${pageParams.get('id')}`);
    const data = await response.json();
    const responeComment = await fetch(`https://gorest.co.in/public-api/comments?post_id=${pageParams.get('id')}`);
    const dataComment = await responeComment.json();
    if (!data) return;
    document.body.classList.add('loaded');
    createDetail(data, dataComment);
}

//Отрисовка детальной страницы
function createDetail(data, dataComment) {
    let detailPage = document.getElementById('detail');
    let head = document.createElement('h1');
    let paragraph = document.createElement('p');
    head.textContent = data.data.title;
    paragraph.textContent = data.data.body;
    detailPage.append(head);
    detailPage.append(paragraph);
    console.log(dataComment.data)
    if (dataComment.data) {
        let ul = document.createElement('ul');
        dataComment.data.forEach(el => {
            let li = document.createElement('li');
            li.innerHTML = `<b>Имя:</b> ${el.name}, <b>Email:</b> ${el.email}, <b>Комментарий:</b> ${el.body}`;
            ul.append(li);
        })
        detailPage.append(ul);
    }
}

// Получение гет параметра с детальной страницы
const pageParams = new URLSearchParams(window.location.search);
if (pageParams.get('id')) {
    loadDetail(gorest, pageParams);
}

document.addEventListener('DOMContentLoaded', function () {
    if (container) {
        loadList(gorest);
    }
})