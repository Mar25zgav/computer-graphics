export class Bernstein {

    constructor(n, k) {
        // zgradi Bernsteinov polinom Bn,k (polinom je na Wikipediji označen z Bν,n, kjer je ν = k)
        this.v = k;
        this.n = n;
    }

    value(x) {
        // vrne vrednost polinoma v točki x
        return this._binom(this.n, this.v) * Math.pow(x, this.v) * Math.pow(1 - x, this.n - this.v);
    }

    derivative(x) {
        // vrne odvod polinoma v točki x
        return this.n * (new Bernstein(this.n - 1, this.v - 1).value(x) - new Bernstein(this.n - 1, this.v).value(x));
    }

    _binom(n, k) {
        if(k < 0 || k > n) return 0
        if(k === 0 || k === n) return 1
        if(k === 1 || k === n - 1) return n
      
        let rez = n;
        for(let i = 2; i <= k; i++){
          rez *= (n - i + 1) / i;
        }
      
        return Math.round(rez);
      }
}