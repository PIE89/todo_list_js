let form = document.getElementById("addForm");
let itemsList = document.getElementById("items");
let filter = document.getElementById("filter");
const listItems = document.querySelectorAll(".list-group-item");
// Создание пустого массива для хранения текстовой частей Li
const texts = loadFromLS();

//Проверяем на наличие данных в Localstorage, добавляем данные записанные в хранилище
if (texts) {
  for (let elem of texts) {
    renderTasks(elem);
  }
}

// Создание нового элемента
function renderTasks(task) {
  let markup = `<li class="list-group-item" data-id="${task.id}">
        <span>${task.name}</span>
        <button
            data-action="delete"
            type="button"
            class="btn btn-light btn-sm float-right"
        >
            Удалить
        </button>
      </li>`;
  itemsList.insertAdjacentHTML("beforeend", markup);
}

// Добавление новой задачи прослушка события
form.addEventListener("submit", addItem);

// Удаление элемента - прослушка клика
itemsList.addEventListener("click", removeItem);

// Фильтрация списка дел - прослушка ввода
filter.addEventListener("keyup", filterItems);

// Добавление новой задачи функция
function addItem(e) {
  // Отменяем отправку формы
  e.preventDefault();

  // Находим инпут с текстом для новой задачи
  let newItemInput = document.getElementById("newItemText");
  // Получаем текст из инпута
  let newItemText = newItemInput.value;

  const id = texts.length > 0 ? texts.at(-1).id + 1 : 1;

  const newObj = {
    name: newItemText,
    id: id,
  };
  renderTasks(newObj);
  texts.push(newObj);

  // добавляем данные из массива в Localstorage
  saveLS();

  // Очистим поле добавления новой задачи
  newItemInput.value = "";
}

// Удаление элемента - ф-я
function removeItem(e) {
  if (
    e.target.hasAttribute("data-action") &&
    e.target.getAttribute("data-action") == "delete"
  ) {
    if (confirm("Удалить задачу?")) {
      e.target.parentNode.remove();
      // Находим наименование задачи и его индекс
      let id = e.target.closest("li").dataset.id;

      const deleteItemIndx = texts.findIndex((task) => task.id === +id);
      // удаляем из массива
      texts.splice(deleteItemIndx, 1);
      // добавляем в Localstorage
      saveLS();
    }
  }
}

// Фильтрация списка дел ф-я
function filterItems(e) {
  // Получаем фразу для поиска и переводим ее в нижний регистр
  let searchedText = e.target.value.toLowerCase();

  // 1. Получаем списко всех задач
  let items = itemsList.querySelectorAll("li");

  // 2. Перебираем циклом все найденные теги li с задачами
  items.forEach(function (item) {
    // Получаем текст задачи из списка и переводим его в нижний регистр
    let itemText = item.firstChild.textContent.toLowerCase();

    // Проверяем вхождение искомой подстроки в текст задачи
    if (itemText.indexOf(searchedText) != -1) {
      // Если вхождение есть - показываем элемент с задачей
      item.style.display = "block";
    } else {
      // Если вхождения нет - скрываем элемент с задачей
      item.style.display = "none";
    }
  });
}

// Получения массива из Localstorage
function loadFromLS() {
  const data = localStorage.getItem("arr");
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
}

// сохраненние нового массива в Localstorage
function saveLS() {
  localStorage.setItem("arr", JSON.stringify(texts));
}
