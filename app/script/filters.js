

// Функция для фильтрации данных
function filterSwitches(switches, filters) {
    const filtered = switches.filter(switchItem => {
        // Проверка по компании
        if (filters.company && filters.company.length && !filters.company.includes(switchItem.company)) {
            return false;
        }
        // Проверка по UPS
        if (filters.ups && filters.ups.length && !filters.ups.includes(switchItem.ups)) {
            return false;
        }
        // Проверка по Managed
        if (filters.managed && filters.managed.length && !filters.managed.includes(switchItem.managed)) {
            return false;
        }
        // Проверка по PoE
        if (filters.PoE && filters.PoE.length && !filters.PoE.includes(switchItem.PoE)) {
            return false;
        }
        // Проверка по SFP
        if (filters.SFP && filters.SFP.length && !filters.SFP.includes(switchItem.SFP)) {
            return false;
        }
        // Проверка по статусу "current"
        if (filters.current !== undefined && filters.current.length && !filters.current.includes(switchItem.current)) {
            return false;
        }
        return true;
    });

    // Сортировка по цене
    if (sort_switch_price) return filtered.sort((a, b) => a.price - b.price);
    return filtered;
}

