let active_window = 1;

document.addEventListener("DOMContentLoaded", function () {
    const gridStack = document.querySelector(".grid-stack");

    gridStack.addEventListener("click", function (event) {
        const clickedWindow = event.target.closest(".window");

        if (!clickedWindow) {
            // Клик по пустому месту сбрасывает активные окна
            document.querySelectorAll('.window').forEach(w => {
                w.classList.remove("active");
                w.style.opacity = "1";
            });

            active_window = null;
            return;
        }

        // Клик по окну активирует только одно окно
        if (clickedWindow.classList.contains("active")) return;

        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove("active");
            w.style.opacity = "0.5";
        });

        clickedWindow.classList.add("active");
        clickedWindow.style.opacity = "1";

        active_window = Number(clickedWindow.dataset.window);
        update_window(active_window);
        applyActiveClasses(active_window);
    });
});






function update_window(window_id) {
    // Находим окно по ID, приводим к числу для правильного сравнения
    const win = window_list.find(w => w.id === window_id);
    if (!win) return;

    const list = window_list.find(w => w.id === window_id).switch_ids;
    
    const switch_list = getSwitchesById(switches, list);

    const filteredSwitches = filterSwitches(switch_list, win.filters);

    createBarChartWindow(window_id, filteredSwitches);
    renderSwitchList(filteredSwitches, window_id);
}

function getSwitchesById(switches, list) {
    return switches.filter(sw => list.includes(Number(sw.id)));
}

function getSwitchesPriceById(switches_price, selectedIds) {
    return switches_price.filter(sw => selectedIds.includes(sw.id));
}
