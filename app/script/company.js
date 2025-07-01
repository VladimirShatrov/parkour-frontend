function attachButtonListeners() {
  const buttons = document.querySelectorAll('[class*="-button"]');
  buttons.forEach(button => {
    button.addEventListener('click', function () {
      this.classList.toggle('active');
      updateFiltersFromButtons(active_window)
      update_window(active_window)
    });
  });
}