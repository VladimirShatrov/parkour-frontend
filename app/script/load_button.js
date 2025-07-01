function load_button_PoE(switches) {
    // Уникальные значения PoE
    const uniquePoEValues = [...new Set(switches.map(switchItem => switchItem.PoE))].sort((a, b) => a - b);

    // Родительский элемент
    const poeButtonsContainer = document.getElementById("poe-buttons");

    // Добавляем кнопки
    uniquePoEValues.forEach(poeValue => {
        const button = document.createElement("button");
        button.classList.add("PoENumb-button");
        button.value = poeValue;
        button.textContent = poeValue;

        poeButtonsContainer.appendChild(button);
    });
}

function load_button_SFP(switches) {
    // Уникальные значения SFP
    const uniqueSFPValues = [...new Set(switches.map(switchItem => switchItem.SFP))].sort((a, b) => a - b);

    // Родительский элемент
    const SFPButtonsContainer = document.getElementById("SFP-buttons");

    // Добавляем кнопки
    uniqueSFPValues.forEach(SFPValue => {
        const button = document.createElement("button");
        button.classList.add("SFPNumb-button");
        button.value = SFPValue;
        button.textContent = SFPValue;

        SFPButtonsContainer.appendChild(button);
    });
}