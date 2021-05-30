<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Демо-проект Slider</h1>
    <h4><a href="https://victordesyatkin.github.io/slider/index.html" target="_blank">Online demo</a></h4>
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
    <p>В приложении использовался архитектурный шаблон проектирования MVP.</p>
    <p>
        <strong><a href="./docs/uml_diagram_bind.jpg" target="_blank" rel="noopener">View</a></strong> - 
        Вид (Представление) строит интерфейс, добавляет в него данные из Модели и отрисовет его в DOM.
        Пользователь видит информацию и взаимодействует с интерфейсом, в частности с помощью событий мыши.
        Вид перехватывает эти события, обрабатывает их с учетом среды выполнениня кода (браузер) и передаёт (делегирует) их 
        Представителю, публикуя одно из событий: onChange, onBeforeChange или onAfterChange.
    </p>
    <p>
        <strong><a href="./docs/uml_diagram_bind.jpg" target="_blank" rel="noopener" target="_blank">Presenter</a></strong> - 
        Представитель посредник между Видом (Представлением) и Моделью. Подписывается на события onBeforeChange, onAfterChange, 
        onChange, setIndex ожидаемые от Вида и setPropsForView ожидаемое от Модели. 
        При публикации одного из событий Вида (onBeforeChange, onAfterChange, onChange, 
        setIndex) происходит вызов одноименного метода Модели. При публикации события Модели (setPropsForView) 
        происходит вызов метода setProps Вида.
    </p>
    <p>
        <strong><a href="./docs/uml_diagram_bind.jpg" target="_blank" rel="noopener" target="_blank">Model</a></strong>
        - Модель хранит, обрабатывает и обновляет данные. Метод onChange пересчитывает, обновляет данные модели и публикует 
        их через событие setPropsForView. Метод onBeforeChange, onAfterChange вызывают одноименные функции, если они присутсвуют среди данных.
    </p>
    <h4>UML Diagram</h4>
    <ul>
        <li><a href="./docs/uml_diagram_bind.jpg" target="_blank" rel="noopener">UML Diagram Bind</a></li>
        <li><a href="./docs/uml_diagram_interfaces.jpg" target="_blank" rel="noopener">UML Diagram Interface</a></li>
        <li><a href="./docs/uml_diagram_types.jpg" target="_blank" rel="noopener">UML Diagram Data Types</a></li>
    </ul>
    <h4>Тестирование</h4>
    <p>
        Тестирование осуществляется с помощью фреймворка для тестирования JavaScript <a href="https://jestjs.io/Jest" target="_blank" rel="noopener">Jest</a>
    </p>
    <h4>Заметки:</h4>
    <ul>
        <li>Для демонстрации надо сверстать демо-страницу, где будет одновременно подключено больше трёх слайдеров, каждый с разными параметрами.</li>
        <li>Рядом с каждым слайдером разместить панель конфигурирования, чтобы можно было на лету менять параметры. </li>
        <li>Рядом с каждым слайдером разместить инпут, в котором всегда будет синхронизировано значение слайдера — <strong>при изменении инпута на анфокус слайдер тоже меняет значение. И наоборот, при изменении слайдера, в инпут устанавливается сразу значение.</strong></li>
    </ul>
    <h4>JavaScript-библиотеки</h4>
    <ul>
        <li><a href="https://www.npmjs.com/package/jquery" target="_blank" rel="noopener">jquery 3.5.1</a></li>
        <li><a href="https://www.npmjs.com/package/bind-decorator" target="_blank" rel="noopener">bind-decorator</a></li>
        <li><a href="https://www.npmjs.com/package/classnames" target="_blank" rel="noopener">classnames</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.isfunction" target="_blank" rel="noopener">lodash.isfunction</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.isobject" target="_blank" rel="noopener">lodash.isobject</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.isstring" target="_blank" rel="noopener">lodash.isstring</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.isundefined" target="_blank" rel="noopener">lodash.isundefined</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.merge" target="_blank" rel="noopener">lodash.merge</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.orderby" target="_blank" rel="noopener">lodash.orderby</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.pick" target="_blank" rel="noopener">lodash.pick</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.set" target="_blank" rel="noopener">lodash.set</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.trim" target="_blank" rel="noopener">lodash.trim</a></li>
        <li><a href="https://www.npmjs.com/package/lodash.uniq" target="_blank" rel="noopener">lodash.uniq</a></li>
    </ul>
    <h4>Установка</h4>
        <ol>
            <li>Установить совместимую версию Node.js v14.x (например v14.17.0 LTS)</li>
            <li>Клонированить репозиторий <code>git clone git@github.com:victordesyatkin/slider.git</code></li>
            <li>Установить зависимости <code>npm i</code></li>
            <li>Запуск демо <code>npm run start</code>, затем перейте по адресу в браузере <a href="http://localhost:8080/" target="_blank" rel="noopener">http://localhost:8080/</a></li>
            <li>Запуск тестов <code>npm t</code></li>            
        </ol>
    <h4>Ручная Инициализация</h4>
        <h5>Инициализация</h5>
            <code>$(<span style="color: #df5000;">'.my-selector'</span>).slider([options]);</code>
        <h5>Доступ к экземпляру объекта</h5>
            <code>$(<span style="color: #df5000;">'.my-selector'</span>).data(<span style="color: #df5000;">'slider'</span>);</code>
        <h5>Подписаться на обновления</h5>
            <p>Для подписки на обновления необходимо передать в параметрах функцию обратного вызова (при инициализации 
            или при дальнейшей работе приложения) для одной из функций onBeforeChange, onChange, onAfterChange ((values: number[]) => void)</p>
            <p>Инициализация с функциями для подписки на обновления</p>
            <pre>
                <code>
$(<span style="color: #df5000;">'.my-selector'</span>).slider({
    onChange: (values: number[]) => { ... },
    onBeforeChange: (values: number[]) => { ... },
    onAfterChange: (values: number[]) => { ... },
});
                </code>
            </pre>
            <p>Измененние функциий для подписки на обновления (в любом месте приложения получаем доступ к экземпляру)</p>
            <pre>
                <code>
const slider = $(<span style="color: #df5000;">'.my-selector'</span>).data(<span style="color: #df5000;">'slider'</span>)
<span style="color: #df5000;">slider</span>).setProps({
    onChange: (values: number[]) => { ... },
    onBeforeChange: (values: number[]) => { ... },
    onAfterChange: (values: number[]) => { ... },
});
                </code>
            </pre>
        <h5>Отписаться от обновлений</h5>
            <p>Для того чтобы отписаться от обновлений необходимо передать в параметрах для функций onBeforeChange, onChange, onAfterChange (для которой была передана функция обратного вызова) null или noop (например () => undefined)</p>
            <p>В любом месте приложения получаем доступ к экземпляру</p>
            <pre>
                <code>
const slider = $(<span style="color: #df5000;">'.my-selector'</span>).data(<span style="color: #df5000;">'slider'</span>);
<span style="color: #df5000;">slider</span>.setProps({
    onChange: null,
    onBeforeChange: null,
    onAfterChange: null,
});
                </code>
            </pre>
            <p>Для того чтобы отписаться от обновлений, дополнительно возможно использовать метод unsubscribe(action), где action - имя одной из функций onBeforeChange, onChange, onAfterChange (для которой была передана функция обратного вызова)</p>
            <p>В любом месте приложения получаем доступ к экземпляру</p>
            <pre>
                <code>
const slider = $(<span style="color: #df5000;">'.my-selector'</span>).data(<span style="color: #df5000;">'slider'</span>);
<span style="color: #df5000;">slider</span>.unsubscribe('onBeforeChange');
<span style="color: #df5000;">slider</span>.unsubscribe('onChange');
<span style="color: #df5000;">slider</span>.unsubscribe('onAfterChange');
                </code>
            </pre>
            <p>Для того чтобы отписаться от всех обновлений, дополнительно возможно использовать метод unsubscribeAll()</p>
            <p>В любом месте приложения получаем доступ к экземпляру</p>
            <pre>
                <code>
const slider = $(<span style="color: #df5000;">'.my-selector'</span>).data(<span style="color: #df5000;">'slider'</span>);
<span style="color: #df5000;">slider</span>.unsubscribeAll();
                </code>
            </pre>
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
            <td>style</td>
            <td>object</td>
            <td>{}</td>
            <td>style: {"backgound": "red"} дополнительный стиль для корневого узла слайдера</td>
        </tr>
        <tr>
            <td>classNames</td>
            <td>string[]</td>
            <td>[]</td>
            <td>Имена классов, которые добавляются к корневому узлу слайдера</td>
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
            <td>isFocused</td>
            <td>boolean</td>
            <td>false</td>
            <td>Режим с фокусированием на handle, с которым уже производились действия (например если двигался handle ближе к min, то если фокус не был снят, то при клике ближе к max, то двигаться будет именно тот handle который в фокусе)</td>
        </tr>
        <tr>
            <td>precision</td>
            <td>number</td>
            <td>0</td>
            <td>Порядок точности для значений tooltip, mark, если шаг отсутствует</td>
        </tr>
        <tr>
            <td>indent</td>
            <td>number</td>
            <td>0</td>
            <td>Отступ между handles</td>
        </tr>
        <tr>
            <td>index</td>
            <td>number</td>
            <td>0</td>
            <td>Номер handle, который будет в фокусе при инициализации, если isFocused используется (слева направо)</td>
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
            <td>Функция будет срабатывать перед началом движения handle, когда его подняли ((values: number[]) => void)</td>
        </tr>
        <tr>
            <td>onChange</td>
            <td>Function</td>
            <td>noop</td>
            <td>Функция будет срабатывать при движения handle ((values: number[]) => void)</td>
        </tr>
        <tr>
            <td>onAfterChange</td>
            <td>Function</td>
            <td>noop</td>
            <td>Функция будет срабатывать после движения handle, когда его отпустили ((values: number[]) => void)</td>
        </tr>
        <tr>
            <td>handle</td>
            <td>object</td>
            <td>{}</td>
            <td>Ручка,<br/>
            {<br/>
                classNames?: string[] = [] - имя класса для каждой ручки,<br/>
                styles: style[] = [] стиль для каждой ручки, где style: {"backgound": "red"},<br/>
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
                styles: style[] = [] стиль для каждого трека, где style: {"backgound-color": "yellow"},<br/>
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
                styles: style[] = [] - стиль рельсы, где style: {"backgound-color": "green"},<br/>
                on?: boolean = true - вкл/выкл,<br/>
            }
            </td>
        </tr>
        <tr>
            <td>dot</td>
            <td>object</td>
            <td>{}</td>
            <td>Точки отметки отображаются при наличие значения step,<br/>
            {<br/>
                on?: boolean = false - вкл/выкл,<br/>
                wrapClassName?: string = '' - имя класса для родительского класса точек отметок,<br/>
                style?: {"backgound": "red"} - стиль для точек отметок,<br/>
                className?: string = '' - имя класса для точек отметок,<br/>
            }</td>
        </tr>
        <tr>
            <td>mark</td>
            <td>object</td>
            <td>{}</td>
            <td>Отметки шкалы, <br/>
            {<br/>
                on?: boolean = false - вкл/выкл,<br/>
                wrapClassName?: string = '' - имя класса для родительского класса отметок шкалы,<br/>
                style?: {"backgound": "red"} - стиль для отметок шкалы,<br/>
                className?: string = '' - имя класса для отметок шкалы,<br/>
                render?: (value: number) => | string | JQuery<HTMLElement> | JQuery<HTMLElement>[] | HTMLElement | HTMLElement[] | undefined; - функция для изменения отображения отметок шкалы,<br/>
                values?: number[] - дополнительные значения отметок шкалы отображаются внезависимости от значения step,<br/>
                dot?: boolean = false, вкл/выкл точек-меток для дополнительных значений отметок шкалы,<br/>
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
