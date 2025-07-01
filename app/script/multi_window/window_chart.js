const charts = {};

const companyColors = {
    "TFortis": "#D68586",
    "OSNOVO": "#BCCC64",
    "MASTERMANN": "#64B9CC",
    "NSGate": "#C364CC",
    "РЕЛИОН": "#1EB05B"
};


function createBarChartWindow(id_canvas, dataSwitches) {
    const canvas = document.querySelector(`[data-canvas="${id_canvas}"]`);
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const labels = dataSwitches.map(switchItem => switchItem.name);
    const prices = dataSwitches.map(switchItem => switchItem.price);
    const colors = dataSwitches.map(switchItem => companyColors[switchItem.company]);

    // Удаляем график, если он уже существует
    if (charts[id_canvas]) {
        charts[id_canvas].destroy();
    }

    charts[id_canvas] = new Chart(context, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: prices,
                backgroundColor: colors,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const sw = dataSwitches[index];
                            return [
                                `${sw.company}`,
                                `Цена: ${sw.price.toLocaleString()}`,
                                `PoE: ${sw.PoE}`,
                                `SFP: ${sw.SFP}`,
                                `UPS: ${sw.ups ? 'Да' : 'Нет'}`,
                                `Управляемый: ${sw.managed ? 'Да' : 'Нет'}`,
                                `В наличии: ${sw.current ? 'Да' : 'Нет'}`
                            ];
                        }
                    }
                },
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: '#686868',
                    font: {
                        family: 'Inter',
                        size: 10,
                        weight: 'normal'
                    },
                    rotation: labels.length > 10 ? -90 : 0,
                    formatter: function(value) {
                        return `${value.toLocaleString()}р`;
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...prices) * 1.3,
                    ticks: {
                        callback: value => value.toLocaleString()
                    }
                },
                x: {
                    ticks: {
                        callback: function(value, index) {
                            const label = this.getLabelForValue(value);
                            return label.length > 30 ? label.slice(10, 30) + "…" : label;
                        },
                        maxRotation: 90,
                        minRotation: 0,
                        align: 'start'
                    }
                }
            },
            onClick: function(evt, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    highlightBarInChart(id_canvas, index);
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function createPriceHistoryChart(id_canvas, switches_price_filtered) {
    const canvas = document.querySelector(`[data-canvas="${id_canvas}"]`);
    if (!canvas) return;
     if (!switches_price_filtered?.length) {
    console.error('Данные отсутствуют или пусты');
    return;
  }

    const context = canvas.getContext('2d');

    if (charts[id_canvas]) {
        charts[id_canvas].destroy();
    }

    const allDatesSet = new Set();
    switches_price_filtered.forEach(sw => {
        sw.price_history.forEach(p => allDatesSet.add(p.date));
    });
    const allDates = Array.from(allDatesSet).sort();

    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 40 + Math.floor(Math.random() * 20);
        const lightness = 40 + Math.floor(Math.random() * 10);  
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }


    const datasets = switches_price_filtered.map(sw => {
        const color = getRandomColor();

        const priceMap = new Map(sw.price_history.map(p => [p.date, p.price]));
        const data = allDates.map(date => priceMap.get(date) ?? null);

        return {
            label: sw.name,
            data: data,
            borderColor: color,
            backgroundColor: color,
            tension: 0.2,
            spanGaps: true
        };
    });

    charts[id_canvas] = new Chart(context, {
        type: 'line',
        data: {
            labels: allDates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const price = context.raw;
                            return price ? `${context.dataset.label}: ${price.toLocaleString()}₽` : null;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Цена (₽)' },
                    beginAtZero: false,
                    ticks: {
                        callback: value => value.toLocaleString()
                    }
                },
                x: {
                    title: { display: true, text: 'Дата изменения' },
                    ticks: {
                        callback: (val, idx) => {
                            const label = allDates[val];
                            return label?.length >= 10 ? label.slice(0, 10) : label;
                        }
                    }
                }
            }
        }
    });
}


