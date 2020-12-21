<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Демо-проект Slider</h1>
    <h4><a href=" https://victordesyatkin.github.io/slider/dist/index.html" target="_blank">Online demo</a></h4>
    <h4>Проект выполнялся для получения:</h4>
    <ul>
        <li>Базовые навыки typescript.</li>
        <li>Базовые навыки проектирования (ООП, вариации MVC-архитектуры, разделение ответственности). В частности pub/sub, mvp, mvc</li>
        <li>Навыки по созданию удобных библиотек с удобным API (интерфейсом использования для других разработчиков). В частности jquery плагин.</li>
        <li>Навыки разделения конфигурирования и бизнес-логики.</li>
        <li>Умение документировать свой продукт (описывать заложенную архитектуру, визуализировать её через UML-диаграммы).</li>
        <li>Навыки автоматического unit-тестирования (включая TDD).</li>
    </ul>
    <h4>Архитектура приложения:</h4>
    <p>
        В приложении использовался архитектурный шаблон проектирования MVP.
        Чтобы отвязать слои <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener">View</a>, <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener" target="_blank">Model</a> от внешних зависимостей использовался поведенческий шаблон проектирования Pub/Sub.
        Передача данных между <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener">View</a> и <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener" target="_blank">Model</a> осуществляется при помощи слоя <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener" target="_blank">Presenter</a>
        Все свойства передаются от <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener">Model</a> к <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener">View</a>, а затем все свойства и обработчики в <a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener">SubView</a>. 
    </p>
    <h4>UML Diagram</h4>
    <ul>
        <li><a href="./docs/uml_diagram_bind.png" target="_blank" rel="noopener">UML Diagram Bind</a></li>
        <li><a href="./docs/uml_diagram_interfaces.png" target="_blank" rel="noopener">UML Diagram Interface</a></li>
        <li><a href="./docs/uml_diagram_types.png" target="_blank" rel="noopener">UML Diagram Data Types</a></li>
    </ul>
    <h4>Тестирование</h4>
    <p>
        Тестирование осуществляется с помощью фреймворка для тестирования JavaScript <a href="https://jestjs.io/Jest" target="_blank" rel="noopener">Jest</a>
    </p>
    <h4>JavaScript-библиотеки и jQuery-плагины</h4>
    <ul>
        <li><a href="https://www.npmjs.com/package/jquery" target="_blank" rel="noopener">jquery</a></li>
        <li><a href="https://www.npmjs.com/package/lodash" target="_blank" rel="noopener">lodash</a></li>
        <li><a href="https://www.npmjs.com/package/classnames" target="_blank" rel="noopener">classnames</a></li>
    </ul>
    <h4>Установка</h4>
        <h5>1. Клонированить репозиторий</h5>
            <code>git clone git@github.com:victordesyatkin/slider.git</code>
        <h5>2. Установить зависимости</h5>
            <code>npm i</code>
        <h5>3. Запуск демо</h5>
            <code>npm run start</code>
        <h5>3. Запуск тестов</h5>
            <code>npm t</code>
    <h4>Ручная Инициализация</h4>
    <code>
        <span style="color: #969896;">
            // Инициализация
        </span>
        $(<span style="color: #df5000;">'#my-element'</span>).slider([options])
        <span style="color: #969896;">
            // Доступ к экземпляру объекта
        </span>
        $(<span style="color: #df5000;">'#my-element'</span>).data(<span style="color: #df5000;">'slider'</span>)
    </code>
    <h4>API</h4>
    <table>
        <tr>
            <th>Название</th>
            <th>Тип</th>
            <th>Поумолчанию</th>
            <th>Описание</th>
        </tr>
        <tr>
            <th>Название</th>
            <th>Тип</th>
            <th>Поумолчанию</th>
            <th>Описание</th>
        </tr>
    </table>
</body>
</html>
