window.countTalbe = function() {
    table = [];
    table[0] = [];
    var step = (sizeB - sizeA) / (n - 1);
    for (var i = sizeA; i <= sizeB; i+=step) {
        table[0].push(myFunction(i));
    }
    if (table[0].length !== (n)) {
        table[0].push(myFunction(sizeB));
    }
    for (var i = 1; i < n; i++) {
        table[i] = [];
        for (var j = 0; j < n - i; j++) {
            table[i].push(table[i - 1][j + 1] - table[i - 1][j]);
        }
    }
};
window.besselPolinom = function(argumentX) {
    argumentX = lerp(sizeA, 0, sizeB, n - 1, argumentX);
    var sum = 0, correction = 0;
    for (var k = 0; k < n; ++k)
    {
        // Var. #4: Pairwise-like division
        var prod = 1;

        for (var i = 0; i < k; ++i)
        {
            prod *= (argumentX - i) / (k - i);
        }

        prod *= table[k][0];

        var correctedNextTerm = (prod - correction);
        var newSum = (sum + correctedNextTerm);
        correction = (newSum - sum) - correctedNextTerm;
        sum = newSum;
    }

    return sum;
};