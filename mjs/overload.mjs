const magicNumber = [21, 3];
const g_map = new Map;
const set = (class1, operator, class2, func) => {
    const m = get(g_map, class1),
          _m = get(m, new Function('a', 'b', `return a ${operator} b`)(...magicNumber));
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
        const operands = [],
              _o = Object.prototype.valueOf,
              _n = Number.prototype.valueOf;
        let i = 0;
        Object.prototype.valueOf = Number.prototype.valueOf = function () {
            operands.push(this);
            return magicNumber[i++];
        };
        return function () {
            Object.prototype.valueOf = _o;
            Number.prototype.valueOf = _n;
            if(operands.length !== 2) throw 'Operation must have 2 operands.';
            const [a, b] = operands;
            const m = get(g_map, a.constructor, () => {
                throw `Left operand type is wrong.`;
            });
            const _m = get(m, Number(this), () => {
                throw 'operator is wrong.';
            });
            const func = get(_m, b.constructor, () => {
                throw `Right operand type is wrong.`;
            });
            return func(a, b);
        };
    }
};
