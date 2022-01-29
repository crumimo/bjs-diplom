'use strict'

// Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
}

// Получение информации о пользователе
ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();
function getCourses() {
    ApiConnector.getStocks(response => {
       if (response.success) {
           ratesBoard.clearTable();
           ratesBoard.fillTable(response.data);
       }
    });
}
getCourses();
setInterval(getCourses, 60000);

// Операции с деньгами
const moneyManager = new MoneyManager();

// пополнение баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс успешно пополнен");
        } else {
            moneyManager.setMessage(false, 'Ошибка пополнения баланса: ' + response.error);
        }
    });
}

// конвертация валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация валюты прошла успешно");
        } else {
            moneyManager.setMessage(false, 'Ошибка конвертации валюты: ' + response.error);
        }
    });
}

// перевод валюты
moneyManager.sendMoneyCallback  = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Перевод валюты прошёл успешно");
        } else {
            moneyManager.setMessage(false, 'Ошибка перевода валюты: ' + response.error);
        }
    });
}

// Работа с избранным
const favoritesWidget = new FavoritesWidget();

// начальный список избранного
ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable(response.data);
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

// добавления пользователя в список избранных
favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable(response.data);
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь успешно добавлен в список избранных");
        } else {
            favoritesWidget.setMessage(true, 'Ошибка дабавления пользователя в список избранных: ' + response.error);
        }
    })
}

// удаление пользователя из списока избранных
favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable(response.data);
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь успешно удалён из списока избранных");
        } else {
            favoritesWidget.setMessage(true, 'Ошибка удаления пользователя из скписка избранных: ' + response.error);
        }
    })
} 