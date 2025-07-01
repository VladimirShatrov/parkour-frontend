document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector('.parser-button');

    
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    
    function showToast(message, isSuccess = true) {
        const toast = document.createElement('div');
        toast.className = `toast ${isSuccess ? 'toast-success' : 'toast-error'}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 4000);
    }

    button.addEventListener('click', async () => {
        button.textContent = 'Запуск...';
        button.disabled = true;

        const socket = new SockJS("http://sersh.keenetic.name:8088/ws");
        const stompClient = StompJs.Stomp.over(socket);

        const totalParsers = 5;
        let completedParsers = 0;

        stompClient.connect({}, () => {
            const subscription = stompClient.subscribe("/topic/parser/result", (message) => {
                const result = JSON.parse(message.body);

                showToast(result.message, result.success === true);

                completedParsers++;

                if (completedParsers === totalParsers) {
                    subscription.unsubscribe();
                    stompClient.disconnect();

                    button.textContent = 'Запустить парсер';
                    button.disabled = false;
                }
            });

            fetch('http://sersh.keenetic.name:8088/parser/run', {
                method: 'POST'
            }).catch(err => {
                showToast('Ошибка при запуске парсера: ' + err.message, false);
                subscription.unsubscribe();
                stompClient.disconnect();

                button.textContent = 'Запустить парсер';
                button.disabled = false;
            });
        }, (error) => {
            showToast('⚠️ Не удалось подключиться к серверу WebSocket', false);
            button.textContent = 'Запустить парсер';
            button.disabled = false;
        });
    });
});

