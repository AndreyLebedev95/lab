$(document).ready(function() {
    var
        $alphaInput = $('#simbol-alpha'),
        $betaInput = $('#simbol-beta'),
        $gammaInput = $('#simbol-gamma'),
        $deltaInput = $('#simbol-delta'),
        $nInput = $('#simbol-n'),
        $stepSizeInput = $('#stepSize'),
        $sizeAInput = $('#pointA'),
        $sizeBInput = $('#pointB'),
        $sizeCInput = $('#pointC'),
        $sizeDInput = $('#pointD'),
        $acceptDrawButton = $('#acceptDraw'),
        $mainFunctionInput = $('#f'),
        $polinomFunctionInput = $('#P'),
        $raznFunctionInput = $('#R');

        alpha = 1,
        beta = 1,
        gamma = 1,
        delta = 1,
        n = 1,
        stepSize = 1,
        sizeA = 1,
        sizeB = 1,
        sizeC = 1,
        sizeD = 1,
        table = [],
        fWindow = {};

    /**
     * Проверяет корректность введенного коэфициента
     * @param $symbolInput Поле коэфициента
     */
    var checkSymbolIntput = function($symbolInput) {
        var inputVal = parseInt($symbolInput.val());
        if (isNaN(inputVal) || inputVal < -100 || inputVal > 100) {
            alert('Не корректный ввод');
            $symbolInput.val('');
        }
    };
    /**
     * Проверяет корректность введенной длинны шага
     */
    var checkStepSizeInput = function() {
        var inputVal = parseFloat($stepSizeInput.val());
        if (isNaN(inputVal) || inputVal > 1) {
            alert('Вы ввели не верную длинну шага');
            $stepSizeInput.val('');
        }
    };
    /**
     * Проверяет корректность введенных размеров окна
     * @param $sizeInput Поле размера окна
     */
    var checkSizeInput = function($sizeInput) {
        var inputVal = parseInt($sizeInput.val());
        if (isNaN(inputVal) || inputVal < -200 || inputVal > 200) {
            if ($sizeInput.val() === '-') return;
            alert('Некорректный ввод');
            $sizeInput.val('');
        }
    };
    /**
     * Подписываеся на события
     */
    $alphaInput.on('input', checkSymbolIntput.bind(this, $alphaInput));
    $betaInput.on('input', checkSymbolIntput.bind(this, $betaInput));
    $gammaInput.on('input', checkSymbolIntput.bind(this, $gammaInput));
    $deltaInput.on('input', checkSymbolIntput.bind(this, $deltaInput));
    $nInput.on('input', checkSymbolIntput.bind(this, $nInput));
    /**
     * Рисует графики
     */
    var reDraw = function() {
        if (!readSymols() || !readSize()) {
            return;
        };
        countTalbe();
        console.log(table);
        var points = [];
        for (var i = sizeA; i < sizeB; i+=0.1) {
            points.push([i, myFunction(i)]);
        }
        var polinomPoints = [];
        for (var i = sizeA; i <= sizeB; i+=0.1) {
            polinomPoints.push([i, besselPolinom(i)]);
        };
        var raznPoints = [];
        for (var i = 0; i < polinomPoints.length; i++) {
            raznPoints.push([polinomPoints[i][0], points[i][1] - polinomPoints[i][1]])
        }
        //polinomPoints.forEach(function(elem ,index) {
        //    var needPointsIndex = 0;
        //    for (var i = 0; i < points.length; i++) {
        //        if (Math.floor(points[i][0]) == elem[0]) {
        //            needPointsIndex = elem[0];
        //        }
        //    }
        //    if (sizeA < 0) {
        //        needPointsIndex -= sizeA;
        //    }
        //    raznPoints.push([needPointsIndex, points[needPointsIndex][1] - elem[1]]);
        //});
        console.log(raznPoints);
        var data = [];
        if ($mainFunctionInput.prop("checked")) {
            data.push({
                data: points,
                lines: {show: true},
                label: 'моя функция'
            });
        }
        if ($polinomFunctionInput.prop("checked")) {
            data.push({
                data: polinomPoints,
                lines: {show: true},
                label: 'Интероляция Бесселя'
            });
        }
        if ($raznFunctionInput.prop("checked")) {
            data.push({
                data: raznPoints,
                lines: {show: true},
                label: 'функция разности'
            });
        }
        $.plot($("#graph"), data, {
            yaxis: {
                min: sizeC, max: sizeD,  tickSize: (sizeD - sizeC) / 20
            },
            xaxis: {
                min: sizeA, max: sizeB, tickSize: (sizeB - sizeA) / 20
            }
        });
    };
    $stepSizeInput.on('input', checkStepSizeInput);
    $sizeAInput.on('input', checkSizeInput.bind(this, $sizeAInput));
    $sizeBInput.on('input', checkSizeInput.bind(this, $sizeBInput));
    $sizeCInput.on('input', checkSizeInput.bind(this, $sizeCInput));
    $sizeDInput.on('input', checkSizeInput.bind(this, $sizeDInput));
    $acceptDrawButton.on('click', reDraw);

    /**
     * Считывает символы для функции из полей ввода
     * return false если какой то из символов не считан
     */
    var readSymols = function() {
        alpha = parseInt($alphaInput.val());
        beta = parseInt($betaInput.val());
        gamma = parseInt($gammaInput.val());
        delta = parseInt($deltaInput.val());
        n = parseInt($nInput.val());
        stepSize = parseFloat($stepSizeInput.val());
        if (isNaN(alpha) || isNaN(beta) || isNaN(gamma) || isNaN(delta)
            || isNaN(n) || isNaN(stepSize)) {
            alert('Введите все значения');
            return false;
        }
        return true;
    };
    /**
     * Считывает размеры поля
     * @returns {boolean} Возрващает false если какой то из размеров не удалось считать
     */
    var readSize = function() {
        sizeA = parseInt($sizeAInput.val());
        sizeB = parseInt($sizeBInput.val());
        sizeC = parseInt($sizeCInput.val());
        sizeD = parseInt($sizeDInput.val());
        if (isNaN(sizeA) || isNaN(sizeB) || isNaN(sizeC) || isNaN(sizeD)) {
            return false;
        }
        return true;
    };
    /**
     * Считает функцию из лабы
     * @param argumentX
     * @returns {number} Значение функции в точке X
     */
    myFunction = function (argumentX) {
        return (alpha + Math.cos(Math.pow(Math.abs(argumentX), beta)) ) * gamma * Math.sin(delta * argumentX);
    };
    var factorial = function(number) {
        var result = 1;
        for (var i = 1; i <= number; i++) {
            result *= i;
        }
        return result;
    }
    /**
     * Считает таблицу разностей
     */
    fWindow.countTalbe = function() {
        table = [];
        table[0] = [];
        var step = (sizeB - sizeA) / (2 * n + 1);
        for (var i = sizeA; i <= sizeB; i+=step) {
            table[0].push(myFunction(i));
        }
        if (table[0].length !== (2 * n + 2)) {
            table[0].push(myFunction(sizeB));
        }
        for (var i = 1; i <= 2 * n + 1; i++) {
            table[i] = [];
            for (var j = 0; j <= 2 * n + 1 - i; j++) {
                table[i].push(table[i - 1][j + 1] - table[i - 1][j]);
            }
        }
    }
    fWindow.besselPolinom = function(argumentX) {
        var result = 0;
        var stepNumber = (argumentX - sizeA) / ((sizeB - sizeA) / (n - 1));
        result+= (table[0][n] + table[0][n - 1]) / 2;
        for (var i = 1; i <= 2 * n + 1; i++) {
            //Выражения q(q-1)(q+1)(q-2)...
            var mnojitel = 1;
            if (i !== 0 && i!== 1) {
                mnojitel *= stepNumber;
            }
            for (var j = 0; j < Math.floor(i / 2); j++ ) {
                if (j === 0) {
                    mnojitel *= (stepNumber - (j + 1));
                } else {
                    mnojitel *= (stepNumber + j);
                    mnojitel *= (stepNumber - (j + 1));
                }
            }
            if (i % 2 === 0) {
                result += ((mnojitel / (2 * factorial(i))) * (table[i][n - Math.floor(i / 2)] + table[i][n - Math.floor(i / 2) + 1]));
            } else {
                mnojitel *= stepNumber - 1/2;
                result += (mnojitel / factorial(i)) * table[i][n - Math.floor(i / 2)];
            }
            if (isNaN(result)) {
                debugger;
            }
        }
        return result;
    }
    lerp = function(x1, y1, x2, y2, x0) {
        return (y1 + (y2 - y1) * ((x0 - x1) / (x2 - x1)));
    }
    var countMyFunction = function (argumentsArray) {
        var result = [];
        for (var i = 0; i < argumentsArray.length; i++) {
            result.push(myFunction(argumentsArray[i]));
        }
        return result;
    }
});