const e = 2.71828;

export class StatisticHelper {
    static calculatePoisson(occurance: number, prob: number) {
        return Math.pow(e, prob * -1) * Math.pow(prob, occurance)/StatisticHelper.factorial(occurance);
    }

    static factorial(num: number) {
        let result = 1;

        if (num === 0)
            return result;
        
        for (let i=num; i>0; i--) {
            result *= i;
        }

        return result;
    }
}