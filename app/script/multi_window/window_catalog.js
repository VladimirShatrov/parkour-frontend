// Функция для рендеринга списка для конкретного окна
function renderSwitchList(filteredSwitches, window_id) {
    const listElement = document.querySelector(`.catalog-container-list[data-catalog="${window_id}"]`);
    if (!listElement) {
        console.error(`Не найден элемент с data-catalog="${window_id}"`);
        return;
    }

    // Очищаем список перед рендерингом
    listElement.innerHTML = '';

    // Проходим по фильтрованным свитчам и добавляем их в список
    filteredSwitches.forEach((switchItem) => {
        const li = document.createElement('li');
        li.value = switchItem.id; 
    
        // Создаем квадрат для цвета
        const colorSquare = document.createElement('span');
        colorSquare.classList.add('switch-color-square');
    
        const color = companyColors[switchItem.company];
        if (color) {
            colorSquare.style.backgroundColor = color;
        }
    
        const textNode = document.createTextNode(switchItem.name);
    
        li.appendChild(colorSquare);
        li.appendChild(textNode);
    
        listElement.appendChild(li);
    });
}

// Функция для подсветки элемента списка
function highlightListItem(window_id, index) {
    const listItems = document.querySelectorAll(`.catalog-container-list[data-catalog="${window_id}"] li`);

    listItems.forEach((item, i) => {
        item.classList.remove('highlighted');
        if (i === index) {
            item.classList.add('highlighted');
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Убираем подсветку через 2 секунды
            setTimeout(() => {
                item.classList.remove('highlighted');
            }, 2000);
        }
    });
}

function highlightBarInChart(window_id, index) {
    const chart = charts[window_id];
    if (!chart) return;

    // Если окно не активно — активируем его
    if (active_window !== window_id) {
        const targetWindow = document.querySelector(`.window[data-window="${window_id}"]`);
        if (targetWindow) {
            // Убираем active у всех окон
            document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
            document.querySelector('.main_windows')?.classList.remove('active');

            // Делаем нужное окно активным
            targetWindow.classList.add('active');
            active_window = window_id;

            applyActiveClasses(active_window);
            update_window(active_window);
        }
    }

    // Подсветка столбца на графике
    chart.setActiveElements([{ datasetIndex: 0, index }]);
    chart.update();

    // Подсветка элемента в списке
    highlightListItem(window_id, index);
}


document.addEventListener("click", (event) => {
    const button = event.target.closest(".catalog-controller_list");
    if (!button) return;

    const catalogContainer = button.closest(".catalog-container");
    const list = catalogContainer.querySelector(".catalog-container-list");
    const controllers = catalogContainer.querySelector(".catalog-controllers");
    const controllers_list = catalogContainer.querySelector(".catalog-controllers-list");

    const isNarrow = catalogContainer.classList.contains("narrow");

    if (isNarrow) {
        catalogContainer.classList.remove("narrow");
        button.classList.remove("hidden");
        list.classList.remove("hidden");
        controllers.classList.remove("hidden");
        controllers_list.classList.remove("hidden");
    } else {
        catalogContainer.classList.add("narrow");
        button.classList.add("hidden");
        list.classList.add("hidden");
        controllers.classList.add("hidden");
        controllers_list.classList.add("hidden");
    }
});



document.addEventListener("click", (e) => {
    if (e.target.closest("li") && e.target.closest(".catalog-container-list")) {
        const li = e.target.closest("li");
        li.classList.toggle("selected");
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("catalog-controller_selected_all")) {
        const activeWindow = e.target.closest(".window.active");
        if (!activeWindow) return;

        const listItems = activeWindow.querySelectorAll(".catalog-container-list li");
        
        listItems.forEach((li) => {
            if (!li.classList.contains("selected")) {
                li.classList.add("selected");
            }
        });
    }
});


function getSelectedSwitchIds(windowId) {
    const list = document.querySelector(`.catalog-container-list[data-catalog="${windowId}"]`);
    if (!list) return [];

    const selectedItems = list.querySelectorAll("li.selected");

    const selectedIds = Array.from(selectedItems).map(li => parseInt(li.value, 10));
    return selectedIds;
}

function deleteSwitchIds(windowId, selectedIds) {
    // Находим окно по ID
    const windowObj = window_list.find(w => w.id === windowId);
    if (!windowObj) return;

    // Удаляем из switch_ids все элементы, которые есть в selectedIds
    windowObj.switch_ids = windowObj.switch_ids.filter(id => !selectedIds.includes(id));

    // Обновляем отображение окна
    update_window(windowId);
}

function saveSwitchIds(windowId, selectedIds) {
    // Находим окно по ID
    const windowObj = window_list.find(w => w.id === windowId);
    if (!windowObj) return;

    // Обновляем switch_ids, оставляя только те ID, которые есть в selectedIds
    windowObj.switch_ids = selectedIds.slice(); // Копируем selectedIds в switch_ids

    // Обновляем отображение окна
    update_window(windowId);
}


function visualSwitchIds(window_id, selectedIds) {
    // Находим окно по ID, приводим к числу для правильного сравнения
    const win = window_list.find(w => w.id === window_id);
    if (!win) return;
    
    const switch_list = getSwitchesById(switches, selectedIds);

    const filteredSwitches = filterSwitches(switch_list, win.filters);

    createBarChartWindow(window_id, filteredSwitches);
    renderSwitchList(filteredSwitches, window_id);
}

function priceDynamicsSwitchIds(window_id, selectedIds) {
    // Находим окно по ID, приводим к числу для правильного сравнения
    const win = window_list.find(w => w.id === window_id);
    if (!win) return;

    const switch_list = getSwitchesById(switches, selectedIds);
    const filteredSwitches = filterSwitches(switch_list, win.filters);
    renderSwitchList(filteredSwitches, window_id);

    const switches_price_filtered = getSwitchesPriceById(switches_price, selectedIds);
    createPriceHistoryChart(window_id, switches_price_filtered);
    
}

function rebootSwitchIds(windowId){
    // Находим окно по ID
    const windowObj = window_list.find(w => w.id === windowId);
    if (!windowObj) return;

    const all_ids = switches.map(sw => sw.id);
    windowObj.switch_ids = all_ids;

    // Обновляем отображение окна
    update_window(windowId);
}

document.addEventListener("click", (e) => {
    // Удаление только выделенных
    if (e.target.classList.contains("catalog-controller_delete")) {
        const selectedIds = getSelectedSwitchIds(active_window);
        if (selectedIds.length === 0) return;

        deleteSwitchIds(active_window, selectedIds);
    }

    // Сохранение только выделенных
    if (e.target.classList.contains("catalog-controller_save")) {
        const selectedIds = getSelectedSwitchIds(active_window);
        if (selectedIds.length === 0) return;

        saveSwitchIds(active_window, selectedIds);
    }


    // Показать только выделенных
    if (e.target.classList.contains("catalog-controller_visual")) {
        const selectedIds = getSelectedSwitchIds(active_window);
        if (selectedIds.length === 0) return;
        visualSwitchIds(active_window, selectedIds);
    }

    // Динамика цен комутаторов
    if (e.target.classList.contains("catalog-controller_price_dynamics")) {
        const selectedIds = getSelectedSwitchIds(active_window);
        if (selectedIds.length === 0) return;

        priceDynamicsSwitchIds(active_window, selectedIds);
    }

    // Первоначальный список
    if (e.target.classList.contains("catalog-controller_reboot")) {
        rebootSwitchIds(active_window);
    }
});