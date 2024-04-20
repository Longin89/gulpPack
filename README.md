![gulp logo](gulp.png)
# GulpPack by EvanLongin version 1.3!
##### Обновление до версии 1.3: добавлено обнуление отступов некоторых элементов, папка media для медиафайлов (mp3), а так-же описание на английском языке ([English description](#table-of-contents))

## Оглавление
1. [Структура папок](#структура-папок)
2. [Инициализация и начало работы](#инициализация-и-начало-работы)
3. [Команды запуска сборки и npm-скриптов](#команды-запуска-сборки-и-npm-скриптов)
4. [Работа с HTML](#работа-с-html)
5. [Работа с (S)CSS](#работа-с-scss)
6. [Работа с JavaScript](#работа-с-javascript)
6. [Работа с изображениями (кроме SVG)](#работа-с-изображениями-кроме-svg)
7. [Работа с SVG](#работа-с-svg)
8. [Работа со шрифтами](#работа-со-шрифтами)
9. [Splide js](#splide-js)

## Структура папок
Проект имеет структуру вида:

### dev/ - папка разработки &#8594;
#### ./css - папка с основным файлом стилей.
#### ./fonts - папка со шрифтами.
#### ./html - папка с html-файлами.
#### ./images - папка с изображениями.
#### ./js - папка с javascript-файлами.
#### ./scss - папка с scss-файлами.
#### ./index.html - основной html-файл.
***
### dist/ - папка для скомпилированного проекта.
***
#### ./gulpfile.js - файл с настройками и функциями gulp.
#### ./package.json - файл со списком установленных пакетов.
#### ./README.md - этот файл Вы читаете в данный момент
#### ./webpack.config.js - файл настройки webpack.
***
## Инициализация и начало работы
Для начала работы со сборкой следует скопировать содержимое репозитория на компьютер с помощью команды:

```git clone https://github.com/Longin89/gulpPack.git```

и после этого в папке сборки выполнить команду:
```npm i```

## Команды запуска сборки и npm-скриптов
```gulp``` - запуск сборки в режиме разработки. В этом режиме запускается BrowserSync (для отслеживания изменений онлайн), а так-же функции из файла **gulpfile.js** для работы с проектом. Все файлы (кроме изображений и [main.bundle.js](#работа-с-javascript)) в папке **dev/** не минифицируются и не конкатенируются.

```gulp build``` - запуск сборки в режиме production. В этом режиме проект компилируется в папку **dist/** для передачи заказчику, либо загрузки на хостинг. Файлы стилей, html-документы и изображения минифицируются, файлы js проходят через webpack и Babel, минифицируются и конкатенируются.

```gulp backend``` (**тестовая функция**) - запуск сборки в режиме backend. В этом режиме сборка из папки **dev/** в папку **dist/** с конкатенированными файлами стилей, html и js. Минификация к файлам не применяется, изображения оптимизируются.

```fonts``` - конвертация шрифтов из ttf в woff2. Исходники шрифтов следует положить в папку **dev/fonts/src**. После выполнения команды искомые шрифты появятся в папке **dev/fonts**

```zipfiles``` - архивация папки **dist/**. Одноименный архив сохраняется в корне проекта.

```npm run html``` - скрипт проверки html-файлов на W3C-валидаторе. Проверяются все файлы, находящиеся в корне папки **dev/**.

## Работа с HTML
В основную страницу с помощью плагина *[gulp-file-include](https://www.npmjs.com/package/gulp-file-include)*  уже вставлены части(**partials**) других файлов (```footer.html```, ```head.html```, ```footer.html```). Встраивание в документ происходит с помощью директивы ```@@include``` (например ```@@include('partials/head.html')```). Вы так-же можете создавать свои страницы и оперировать с ними тем-же образом.

**Важно!** Для корректной работы сборки все html-файлы должны находится в директории **dev/html**.

**Важно №2** В файле ```head.html``` помимо стандартных настроек прописан тэг вида ```<link rel="preload"...``` - он нужен для предзагрузки используемых Вами шрифтов, необходимо прописать туда полное имя файла(ов), находящихся в папке **dev/fonts**. Предзагрузка опциональна, при желании отключается простым удалением тэга.

## Работа с (S)CSS
Для работы используется препроцессор sass в синтаксисе scss. Во время процесса разработки, работа со стилями происходит в директории **dev/scss**. файлы в которой, в свою очередь разделены на секции:

**style.scss** - основной файл стилей, в который по умолчанию импортируются все остальные.

**./components/_defaults.scss** - файл со стилями по умолчанию для базового проекта (как то - ширина ограничительного контейнера, размер и семейство базового шрифта, прижатие футера к низу страницы и т.д.)

**./components/_fonts.scss** - файл, в который через директиву ```@incliude``` импортируются пользовательские шрифты.

**./components/_footer.scss** - файл для "подвала" проекта.

**./components/_header.scss** - файл для "шапки" проекта.

**./components/_mixins.scss** - файл для хранения "примесей". По умолчанию уже хранит в себе миксина для быстрого добавления / использования шрифтов, а так-же градиентов.

**./components/_normalize.scss** - файл нормализации, версия 8.0.1.

**./components/_vars.scss** - файл для хранения переменных.

При разработке проекта, компилируемый на выходе **style.min.css** хранит в себе стили из всех вышеперечисленных файлов в неминифицированном виде. Отдельным файлом создается **style.min.css.map**, содержащий в себе карты стилей, полученные с помощью плагина *[gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)*.

## Работа с JavaScript
Для работы с js в сборке используется webpack и babel. Файлы так-же разделены на секции:

**main.js** - основной файл для разработки, не прошедший через webpack и babel.

**main.bundle.js** - основной файл после webpack, babel и конкатенации.

**./components/_functions.js** - файл для хранения функций.

**./components/_vars.js** - файл для хранения переменных.

Режим сборки запускается при разработке проекта (команда ```gulp```), в нем файлы не проходят транспилляцию и минификацию, 1 строка каждого входного файла на выходе начинается с комментария, в котором указывается информация об исходнике.

В режиме продакшена (команда ```gulp build```) конечный файл проходит транспилляцию через babel и минификацию.

В последней версии сборки для построения карт js-файлов используется webpack (файл **main.bundle.js.map** генерируется в корне папки **js/**).

## Работа с изображениями (кроме SVG)
Все изображения (кроме ```*.svg``` и ```*.ico```) следует помещать в папку **dev/images/src** - на выходе в папке **dev/images** Вы будете получать оптимизированные файлы в форматах ```*.jpeg``` и ```*.webp```.
Для добавления изображения на страницу используйте тэг ```<img>``` - при компиляции документа он, с помощью *[gulp-webp-html](https://www.npmjs.com/package/gulp-webp-html)* будет преобразован в тэг ```<picture>```, в котором, в зависимости от поддержки браузера будет использован ```jpeg``` или ```webp```-файл.

## Работа с SVG
Для конвертации SVG-файлов используется папка **dev/images/src/svg** - в нее помещаются исходники, которые после запуска разработки конвертируются и помещаются в папку **dev/images/svg_out**.

## Работа со шрифтами
С помощью плагина *[gulp-ttf2woff2](https://www.npmjs.com/package/gulp-ttf2woff2)* в сборке реализована возможность конвертации шрифтов из ttf в woff2 (описана [выше](#команды-запуска-сборки-и-npm-скриптов)). Рекомендуется подготавливать шрифты заранее.

## Splide JS
В последней версии сборки для реализации слайдера Swiper был заменен на *[Splide JS](https://splidejs.com/)*, т.к. на мой взгляд последний работает гораздо стабильнее. По умолчанию js и css-файлы слайдера выключены в сборке, для их включения раскомментируйте соответствующие строки в файлах **gulpfile.js** и **webpack.config.js**.

## PS
Это моя первая сборка, идею позаимствовал у *[MaxGraph](https://github.com/maxdenaro)* (надеюсь, что он не против и спасибо ему).
Сборка по возможности будет допиливаться, пополняться, обо всех проблемах просьба сообщать в issues.
Peace <3

# GulpPack by EvanLongin version 1.3!
##### Update to version 1.3: added zeroing of margin of some elements, a 'media' folder for mp3-files, and description in English language

## Table of contents
1. [Folder structure](#folder-structure)
2. [Initialization and getting started](#initialization-and-getting-started)
3. [NPM-commands for launching builds and scripts](#npm-commands-for-launching-builds-and-scripts)
4. [Working with HTML](#working-with-html)
5. [Working with (S)CSS](#working-with-scss)
6. [Working with JavaScript](#working-with-javascript)
6. [Working with images (except SVG)](#working-with-images-except-svg)
7. [Working with SVG](#working-with-svg)
8. [Working with fonts](#working-with-fonts)
9. [Splide js eng](#splide-js-eng)

## Folder structure
The project has a structure like:

### dev/ - development folder &#8594;
#### ./css - folder with the main style file.
#### ./fonts - folder with fonts.
#### ./html - folder with html-files.
#### ./images - folder with images.
#### ./js - folder with javascript-files.
#### ./scss - folder with scss-files.
#### ./index.html - main html-file.
***
### dist/ - folder for the compiled project.
***
#### ./gulpfile.js - gulp configuration file.
#### ./package.json - file with a list of installed packages.
#### ./README.md - this file you are currently reading.
#### ./webpack.config.js - webpack configuration file.
***
## Initialization and getting started
To start working with this pack, copy the contents of the repository to your computer using the command:

```git clone https://github.com/Longin89/gulpPack.git```

and after that in the build folder run the command:
```npm i```

## NPM-commands for launching builds and scripts
```gulp``` - run the build in development mode. In this mode, BrowserSync is launched (to track changes online), as well as functions from the **gulpfile.js** to work with the project. All files (except images and [main.bundle.js](#working-with-javascript)) in the **dev/** folder are not minified or concatenated.

```gulp build``` - run the build in production mode. In this mode, the project is compiled into the folder **dist/** for transfer to the customer, or uploading to hosting. Style files, html documents and images are minified, js files go through webpack and Babel, minified and concatenated.

```gulp backend``` (**test mode**) - run the build in backend mode. In this mode, build from a folder **dev/** to the **dist/** folder with concatenated style files, html and js. Minification is not applied to files, images are optimized.

```fonts``` - converting fonts from ttf to woff2. Font sources should be placed in a folder **dev/fonts/src**. After executing the command, the searched fonts will appear in the **dev/fonts** folder.

```zipfiles``` - archiving the **dist/** folder. The archive of the same name is saved in the project root..

```npm run html``` - script for checking html files on the W3C validator. All files located in the root of the **dev/** folder will be scanned.

## Working with HTML
To the main page with *[gulp-file-include](https://www.npmjs.com/package/gulp-file-include)*   **partials** of other files have already been inserted (```footer.html```, ```head.html```, ```footer.html```). Embedding into a document occurs using a directive ```@@include``` (e.g. ```@@include('partials/head.html')```). You can also create your own pages and operate with them in the same way.

**Important!** For the correct work of pack, all html files must be located in the  **dev/html** directory.

**Important №2** In the ```head.html``` file in addition to the standard settings, a tag like ```<link rel="preload"...``` needed to preload the fonts you use, you need to write there the full name of the file(s) located in the **dev/fonts** folder. Preloading is optional, it can be disabled by simply removing the tag.

## Working with (S)CSS
The pack uses the sass preprocessor in scss syntax. During the development process, work with styles occurs in the **dev/scss** directory. Files are divided into sections:

**style.scss** - main file, into which all others are imported by default.

**./components/_defaults.scss** - file with default styles for the base project (such as the width of the bounding container, the size and family of the base font, pressing the footer to the bottom of the page, etc.).

**./components/_fonts.scss** - file into which custom fonts are imported via the ```@incliude``` directive.

**./components/_footer.scss** - file for footer of project.

**./components/_header.scss** - file for header of project.

**./components/_mixins.scss** - file for storing mixins. By default, it already contains a mixin for quickly adding / using fonts and gradients.

**./components/_normalize.scss** - file for normalize, v.8.0.1.

**./components/_vars.scss** - variable storage file.

During the development , the compiled output **style.min.css** stores the styles from all of the above files in an unminified form. **style.min.css.map** is created as a separate file, containing style maps obtained using the plugin *[gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)*.

## Working with JavaScript
To work with js, this pack uses webpack and babel. The files are also divided into sections:

**main.js** -  main file for development, not passed through webpack and babel.

**main.bundle.js** - main file after webpack, babel and concatenation.

**./components/_functions.js** - file for storing functions.

**./components/_vars.js** - file for storing variables.

The build mode is launched during project development (the ```gulp``` command), in which the files do not undergo transpilation and minification, 1 line of each input file in the output begins with a comment, which indicates information about the source.

In production mode (command ```gulp build```) the file is transpiled through babel and minified.

The latest version of the pack uses webpack to build js file maps (the **main.bundle.js.map** file is generated in the root of the **js/** folder).

## Working with images (except SVG)
All images (except ```*.svg``` and ```*.ico```) should be placed in the **dev/images/src** folder - the output images will be in the **dev/images** folder. You will receive optimized files in ```*.jpeg``` and ```*.webp``` formats.
To add an image to the page, use the ```<img>``` tag - when compiling the document, it is using *[gulp-webp-html](https://www.npmjs.com/package/gulp-webp-html )* will be converted to a ```<picture>``` tag, in which, depending on browser support, a ```jpeg``` or ```webp``` file will be used.

## Working with SVG
To convert SVG files, the **dev/images/src/svg** folder is used - the sources are placed in it, which, after starting development, are converted and placed in the **dev/images/svg_out** folder.

## Working with fonts
Using the plugin *[gulp-ttf2woff2](https://www.npmjs.com/package/gulp-ttf2woff2)* the pack implements the ability to convert fonts from ttf to woff2. It is recommended to prepare fonts in advance.

## Splide JS eng
In the latest version of the pack for implementing the slider, Swiper was replaced by *[Splide JS](https://splidejs.com/)*, because IMHO, the latter works much more stable. By default, the js and css files of the slider are disabled in the pack; to enable it, uncomment the corresponding lines in the **gulpfile.js** and **webpack.config.js** files.

## PS
This is my first pack, I borrowed the idea from *[MaxGraph](https://github.com/maxdenaro)* (I hope he doesn’t mind and thanks to him).
If possible, the pack will be completed and replenished; please report any problems in issues.
Мир <3