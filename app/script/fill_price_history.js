function fillPriceHistoryWithWeeklyPoints(switches_price) {
    const MS_IN_DAY = 24 * 60 * 60 * 1000;
    const MS_IN_WEEK = 7 * MS_IN_DAY;
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    switches_price.forEach(sw => {
        if (!sw.price_history || sw.price_history.length === 0) return;

        const originalHistory = sw.price_history
            .map(p => ({ price: p.price, date: new Date(p.date) }))
            .sort((a, b) => a.date - b.date);

        const result = [];

        let currentPrice = originalHistory[0].price;
        let currentDate = new Date(originalHistory[0].date);
        let index = 1;

        while (currentDate <= todayMidnight) {
            // Если наступила дата смены цены
            if (index < originalHistory.length && originalHistory[index].date.getTime() <= currentDate.getTime()) {
                // Добавим точку с предыдущей ценой
                result.push({
                    date: originalHistory[index].date.toISOString().split("T")[0],
                    price: currentPrice
                });

                // Обновим текущую цену и добавим новую точку
                currentPrice = originalHistory[index].price;
                result.push({
                    date: originalHistory[index].date.toISOString().split("T")[0],
                    price: currentPrice
                });

                index++;
                continue;
            }

            result.push({
                date: currentDate.toISOString().split("T")[0],
                price: currentPrice
            });

            currentDate = new Date(currentDate.getTime() + MS_IN_WEEK);
        }

        // Проверим наличие точки на сегодня
        const hasToday = result.some(p => {
            const d = new Date(p.date);
            return d.getFullYear() === todayMidnight.getFullYear() &&
                   d.getMonth() === todayMidnight.getMonth() &&
                   d.getDate() === todayMidnight.getDate();
        });

        if (!hasToday) {
            result.push({
                date: todayMidnight.toISOString().split("T")[0],
                price: currentPrice
            });
        }

        // Удалим дубликаты по дате
        const seen = new Set();
        sw.price_history = result.filter(p => {
            if (seen.has(p.date)) return false;
            seen.add(p.date);
            return true;
        });
    });
}
