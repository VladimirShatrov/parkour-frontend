document.addEventListener('DOMContentLoaded', function () {
  const grid = GridStack.init({
    column: 12,
    cellHeight: 100,
    float: false,
    disableOneColumnMode: true,
    margin: 5,
    resizable: {
      handles: 'e, se, s, sw, w'
    }
  });

  window.grid = grid;

  const savedData = localStorage.getItem('grid-data');
  if (savedData) {
    try {
      const layout = JSON.parse(savedData).map(widget => {
        if (!widget.content || !widget.content.includes('create-window')) {
          widget.content = generatePanelContent();
        }
        return widget;
      });
      grid.load(layout);
    } catch (e) {
      console.error('Ошибка при загрузке layout из localStorage:', e);
    }
  } else {
    grid.load([
      {
        x: 0, y: 0, w: 12, h: 10,
        content: generatePanelContent()
      }
    ]);
  }

  grid.on('change', function () {
    saveLayout();
  });

  function saveLayout() {
    const layout = grid.save(false);
    localStorage.setItem('grid-data', JSON.stringify(layout));
  }

  function generatePanelContent() {
    return `<div class="panel">
              <button class="create-window" onclick="new_window(this)">+</button>
            </div>`;
  }

  window.saveLayout = saveLayout;
  window.generatePanelContent = generatePanelContent;
});

window.new_panel = function () {
  if (!window.grid) {
    console.warn('GridStack not initialized yet');
    return;
  }

  const node = {
    w: 4,
    h: 2,
    content: generatePanelContent()
  };

  window.grid.addWidget(node);
  window.saveLayout();
};

window.close_window = function (button) {
  const widgetElement = button.closest('.grid-stack-item');
  if (!widgetElement) {
    console.warn('Не удалось найти grid-stack-item для удаления.');
    return;
  }

  if (window.grid) {
    window.grid.removeWidget(widgetElement);
    window.saveLayout();
  } else {
    console.warn('GridStack не инициализирован.');
  }
};

window.new_window = function () {
  window.new_panel();
};
