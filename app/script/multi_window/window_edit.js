function applyActiveClasses(window_id) {
    const win = window_list.find(w => w.id === Number(window_id));
    if (!win) return;

    const filters = win.filters;

    // Удаляем все active у кнопок
    document.querySelectorAll('button.active').forEach(btn => btn.classList.remove('active'));

    // === Булевые фильтры ===
    ['ups', 'managed', 'current'].forEach(key => {
        filters[key].forEach(val => {
            // Явно приводим к строке
            const selector = `.${key}Numb-button[value="${String(val)}"]`;
            const btn = document.querySelector(selector);
            if (btn) {
                btn.classList.add('active');
            } else {
                console.warn(`Кнопка не найдена для фильтра ${key}:`, selector);
            }
        });
    });

    // === Фильтр PoE (нижний регистр id) ===
    filters.PoE.forEach(val => {
        const selector = `#poe-buttons button[value="${String(val)}"]`;
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('active');
        } else {
            console.warn(`Кнопка не найдена для фильтра PoE:`, selector);
        }
    });

    // === Фильтр SFP (верхний регистр id) ===
    filters.SFP.forEach(val => {
        const selector = `#SFP-buttons button[value="${String(val)}"]`;
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('active');
        } else {
            console.warn(`Кнопка не найдена для фильтра SFP:`, selector);
        }
    });

    // === Фильтр по компании ===
    filters.company.forEach(company => {
        const selector = `.company-button[value="${company}"]`;
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('active');
        } else {
            console.warn(`Кнопка не найдена для компании ${company}:`, selector);
        }
    });
}


function updateFiltersFromButtons(window_id) {
    const win = window_list.find(w => w.id === window_id);
    if (!win) return;

    // Сброс фильтров окна
    win.filters = {
        company: [],
        ups: [],
        managed: [],
        PoE: [],
        SFP: [],
        current: []
    };

    // Все активные кнопки
    const activeButtons = document.querySelectorAll('.active');

    activeButtons.forEach(button => {
        const value = button.value;

        if (button.classList.contains('company-button')) {
            win.filters.company.push(value);
        } else if (button.classList.contains('upsNumb-button')) {
            win.filters.ups.push(value === 'true');
        } else if (button.classList.contains('managedNumb-button')) {
            win.filters.managed.push(value === 'true');
        } else if (button.classList.contains('PoENumb-button')) {
            win.filters.PoE.push(Number(value));
        } else if (button.classList.contains('SFPNumb-button')) {
            win.filters.SFP.push(Number(value));
        } else if (button.classList.contains('currentNumb-button')) {
            win.filters.current.push(value === 'true');
        }
    });
}

