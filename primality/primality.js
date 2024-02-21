let primes = Eratosthenes(1 << 20).map(BigInt);

function Eratosthenes(bound) {
    let arr = Array(bound + 1).fill(true);
    arr[0] = arr[1] = false;
    let p = 0;
    while(p * p <= bound) {
        for(let i = p + 1; i <= bound; i++) {
            if(arr[i]) {
                p = i;
                break;
            }
        }
        for(let i = p * 2; i <= bound; i += p) {
            arr[i] = false;
        }
    }
    return [...Array(bound + 1).keys()].filter(i => arr[i]);
}

function gcd(a, b) {
    if(a * b == 0n) {
        return a + b < 0 ? -(a + b) : a + b;
    } else {
        return gcd(b, a % b);
    }
}

function pow(a, b, mod) {
    let ans = 1n,
        tmp = a;
    while(b) {
        if(b % 2n) {
            ans = ans * tmp % mod;
        }
        b >>= 1n;
        tmp = tmp * tmp % mod;
    }
    return ans;
}

function randBelow(n) {
    let rand = BigInt(parseInt(Math.random() * Number.MAX_SAFE_INTEGER));
    while(rand < n) {
        rand *= BigInt(Number.MAX_SAFE_INTEGER);
        rand += BigInt(parseInt(Math.random() * Number.MAX_SAFE_INTEGER));
    }
    rand %= n;
    return rand ? rand : randBelow(n);
}

function trial(n) {
    for(let p of primes) {
        if(n % p == 0) {
            return n == p;
        }
    }
    return true;
}

function isPrime(n) {
    if(n < 2n || !trial(n)) {
        return false;
    } else if(n < 1n << 20n) {
        return true;
    }
    let k = 1n,
        m = n - 1n;
    while(m % 2n == 0n) {
        k += 1n;
        m >>= 1n;
    }
    let accuracy = 20;
    for(let i = 0; i < accuracy; i++) {
        let a = randBelow(n);
        let tmp = pow(a, m, n);
        let flag = false;
        if(tmp == 1n) {
            continue;
        }
        for(let j = 0; j < k; j++) {
            if(tmp == n - 1n) {
                flag = true;
                break;
            }
            tmp = tmp * tmp % n;
        }
        if(!flag) {
            return false;
        }
    }
    return true;
}

onload = function() {
    let number = document.getElementById('number');
    let time = document.getElementById('time');
    let result = document.getElementById('result');
    number.focus();

    number.onchange = function() {
        time.innerText = result.innerText = '';
        let num = document.getElementById('number').value;
        if(!num) {
            return;
        } else if(parseInt(num) != num) {
            result.innerText = '整数を十進表記で入力してください。';
        } else if(1000 < num.length && 0 < num) {
            result.innerHTML = '10<sup>1000</sup>未満の数を入力してください。';
        } else {
            let start = new Date();
            if(isPrime(BigInt(num))) {
                result.innerText = num + 'はほぼ間違いなく素数です。';
            } else {
                result.innerText = num + 'は素数ではありません。';
            }
            time.innerText = `(${new Date() - start}ms)`;
        }
    };
};