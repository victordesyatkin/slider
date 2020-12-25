<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Демо-проект Slider</h1>
    <h4><a href="https://victordesyatkin.github.io/slider/dist/index.html" target="_blank">Online demo</a></h4>
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
    <h4>Заметки:</h4>
    <p>
        Для демонстрации надо сверстать демо-страницу, где будет одновременно подключено больше трёх слайдеров, каждый с разными параметрами.
    </p>
    <ul>
        <li>Рядом с каждым слайдером разместить панель конфигурирования, чтобы можно было на лету менять параметры. </li>
        <li>Рядом с каждым слайдером разместить инпут, в котором всегда будет синхронизировано значение слайдера — <strong>при изменении инпута на анфокус слайдер тоже меняет значение</string>. И наоборот, при изменении слайдера, в инпут устанавливается сразу значение.</li>
        <li></li>
    </ul>
    <h4>JavaScript-библиотеки</h4>
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
            <span>and then go to <a href="http://localhost:8080/" target="_blank" rel="noopener">http://localhost:8080/</a></span>
        <h5>3. Запуск тестов</h5>
            <code>npm t</code>
    <h4>Ручная Инициализация</h4>
        <h5>Инициализация</h5>
            <code>$(<span style="color: #df5000;">'#my-element'</span>).slider([options])</code>
        <h5>Доступ к экземпляру объекта</h5>
            <code>$(<span style="color: #df5000;">'#my-element'</span>).data(<span style="color: #df5000;">'slider'</span>)</code>
    <h4 id="api">API</h4>
    <table>
        <tr>
            <th>Имя</th>
            <th>Тип</th>
            <th>Поумолчанию</th>
            <th>Описание</th>
        </tr>
        <tr>
            <td>values</td>
            <td>number[]</td>
            <td>[0]</td>
            <td>Значение для каждого handle</td>
        </tr>
        <tr>
            <td>className</td>
            <td>string</td>
            <td>''</td>
            <td>Имя класса, которое добавляется к главному родительскому узлу слайдера</td>
        </tr>
        <tr>
            <td>min</td>
            <td>number</td>
            <td>0</td>
            <td>Минимальное значение для слайдера</td>
        </tr>
        <tr>
            <td>max</td>
            <td>number</td>
            <td>100</td>
            <td>Максимальное значение для слайдера</td>
        </tr>
        <tr>
            <td>step</td>
            <td>number</td>
            <td>0</td>
            <td>Шаг для хода handle слайдера, отображения dot, mark</td>
        </tr>
        <tr>
            <td>vertical</td>
            <td>boolean</td>
            <td>false</td>
            <td>Ориентация слайдера если vertical true, то слайдер будет вертикальным</td>
        </tr>
        <tr>
            <td>reverse</td>
            <td>boolean</td>
            <td>false</td>
            <td>Направление компонентов слайдера если reverse true, то компоненты отображаются реверсивно</td>
        </tr>
        <tr>
            <td>disabled</td>
            <td>boolean</td>
            <td>false</td>
            <td>Отключение слайдера</td>
        </tr>
        <tr>
            <td>onBeforeChange</td>
            <td>Function</td>
            <td>noop</td>
            <td>Функция будет срабатывать перед началом движения handle, когда его подняли</td>
        </tr>
        <tr>
            <td>onChange</td>
            <td>Function</td>
            <td>noop</td>
            <td>Функция будет срабатывать при движения handle</td>
        </tr>
        <tr>
            <td>onAfterChange</td>
            <td>Function</td>
            <td>noop</td>
            <td>Функция будет срабатывать после движения handle, когда его отпустили</td>
        </tr>
        <tr>
            <td>handle</td>
            <td>object</td>
            <td>{}</td>
            <td>Ручка,<br/>
            {<br/>
                classNames?: string[] = [] - имя класса для каждой ручки,<br/>
                styles: style[] = [] стиль для каждой ручки,<br/>
            }
            </td>
        </tr>
        <tr>
            <td>track</td>
            <td>object</td>
            <td>{on: true}</td>
            <td>Трек,<br/>
            {<br/>
                classNames?: string[] = [] - имя класса для каждого трека,<br/>
                styles: style[] = [] стиль для каждого трека,<br/>
                on?: boolean = true - вкл/выкл,<br/>
            }
            </td>
        </tr>
        <tr>
            <td>rail</td>
            <td>object</td>
            <td>{on: true}</td>
            <td>Рельс, <br/>
            {<br/>
                className?: string = '' - имя класса рельсы,<br/>
                styles: style[] = [] - стиль рельсы,<br/>
                on?: boolean = true - вкл/выкл,<br/>
            }
            </td>
        </tr>
        <tr>
            <td>dot</td>
            <td>object</td>
            <td>{}</td>
            <td>Точки-отметки отображаются при наличие значения step,<br/>
            {<br/>
                on?: boolean = false - вкл/выкл,<br/>
                wrapClassName?: string = '' - имя класса для родительского класса точек-отметок,<br/>
                style?: {"backgound": "red"} - стиль для точек-отметок,<br/>
                className?: string = '' - имя класса для точек-отметок,<br/>
            }</td>
        </tr>
        <tr>
            <td>mark</td>
            <td>object</td>
            <td>{}</td>
            <td>Отметки-шкала, <br/>
            {<br/>
                on?: boolean = false - вкл/выкл,<br/>
                wrapClassName?: string = '' - имя класса для родительского класса отметок-шкалы,<br/>
                style?: {"backgound": "red"} - стиль для отметок-шкалы,<br/>
                className?: string = '' - имя класса для отметок-шкалы,<br/>
                render?: (value: number) => | string | JQuery<HTMLElement> | JQuery<HTMLElement>[] | HTMLElement | HTMLElement[] | undefined; - функция для изменения отображения отметок-шкалы,<br/>
                values?: number[] - дополнительные значения отметок-шкалы отображаются внезависимости от значения step,<br/>
                dot?: boolean = false, вкл/выкл точек-меток для дополнительных значений отметок-шкалы,<br/>
            }
            </td>
        </tr>
        <tr>
            <td>tooltip</td>
            <td>object</td>
            <td>{}</td>
            <td>Всплывающие подсказки,<br/>
            {<br/>
                on?: boolean = false - вкл/выкл,<br/>
                style?: {"backgound": "red"} - стиль для подсказки,<br/>
                className?: string = '' - имя класса для подсказки,<br/>
                render?: (value: number) => | string | JQuery<HTMLElement> | JQuery<HTMLElement>[] | HTMLElement | HTMLElement[] | undefined; - функция для изменения отображения подсказки,<br/>
                always?: boolean = false, вкл/выкл постоянного отображения подсказок, если установлено значение false подсказки отображаются только при наведении на handle<br/>
            }
            </td>
        </tr>
    </table>
</body>
</html>
