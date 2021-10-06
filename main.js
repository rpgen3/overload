(async () => {
    const {importAll, getScript} = await import(`https://rpgen3.github.io/mylib/export/import.mjs`);
    await getScript('https://code.jquery.com/jquery-3.3.1.min.js');
    const $ = window.$;
    const html = $('body').empty().css({
        'text-align': 'center',
        padding: '1em',
        'user-select': 'none'
    });
    const head = $('<div>').appendTo(html),
          body = $('<div>').appendTo(html),
          foot = $('<div>').appendTo(html);
    const rpgen3 = await importAll([
        'input',
        'hankaku'
    ].map(v => `https://rpgen3.github.io/mylib/export/${v}.mjs`));
    $('<span>').appendTo(head).text('二項演算子チェッカー');
    const addBtn = (h, ttl, func) => $('<button>').appendTo(h).text(ttl).on('click', func);
    const inputOperators = rpgen3.addInputStr(body, {
        label: '検証する演算子',
        textarea: true,
        value: `+
-
*
/
%
**
&
|
^
<<
>>
&&
||`
    });
    const g_fs = [];
    addBtn(body, '検証開始', () => {
        while(g_fs.length) g_fs.pop();
        foot.empty();
        for(const v of inputOperators().split('\n')) {
            if(!v) continue;
            const input = rpgen3.addInputStr(foot, {
                label: `a ${v} b =`
            });
            const f = new Function('a', 'b', `return a ${v} b`);
            g_fs.push((a, b) => {
                try {
                    input(f(a, b));
                    input.elm.css('backgroundColor', 'white');
                }
                catch (err) {
                    input('error');
                    input.elm.css('backgroundColor', 'pink');
                }
            });
        }
    });
    const inputA = rpgen3.addInputStr(body, {
        label: '第一項[A]',
        value: 7
    });
    const inputB = rpgen3.addInputStr(body, {
        label: '第二項[B]',
        value: 3
    });
    for(const input of [inputA, inputB]) input.elm.on('input', () => {
        const [a, b] = [inputA, inputB].map(v => v()).map(Number);
        for(const f of g_fs) f();
    });
})();
