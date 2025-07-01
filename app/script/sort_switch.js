let sort_switch_price = false;

function Sort_Switch(button) {
    sort_switch_price = !sort_switch_price;

    if (sort_switch_price) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }

}


