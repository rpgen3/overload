const magicNumber = [21, 3],
      g_map = new Map;
const set = (class1, operator, class2, func) => {
    const m = get(g_map, class1),
          _m = get(m, new Function('a', 'b', `return a ${operator} b`)(...magicNumber).toString());
    _m.set(class2, func);
};
const get = (map, key, callback = () => map.set(key, new Map)) => {
    if(!map.has(key)) callback();
    return map.get(key);
};
export const over = {
    set load (args) {
        set(...args);
    },
    get load () {
        const _ = [Function, Object, String, Number, BigInt, Boolean, Symbol].map(v => [v, v.prototype.valueOf]),
              operands = [];
        let i = 0;
        for(const [v] of _) v.prototype.valueOf = function () {
            operands.push(this);
            return magicNumber[i++];
        };
        return function () {
            for(const [v, _v] of _) v.prototype.valueOf = _v;
            if(operands.length !== 2) throw 'Operator must have 2 operands.';
            const [a, b] = operands;
            const m = get(g_map, a.constructor, () => {
                throw `Left operand type is wrong.`;
            });
            const _m = get(m, this.toString(), () => {
                throw 'Operator is wrong.';
            });
            const func = get(_m, b.constructor, () => {
                throw `Right operand type is wrong.`;
            });
            return func(a, b);
        };
    }
};
