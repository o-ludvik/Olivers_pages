/**
 * Creates number inputs from an array of item configs and appends them to a container.
 * Items are sorted by the first equation id. Equation field can be a single id ("1c") or chained ("1c 2a") so one input belongs to multiple equations.
 * @param {Array<{ equation: string, x: number, y: number, disabled: boolean, placeholder?: string }>} items
 * @param {HTMLElement} [container] - Optional. If omitted, creates a div with class "container" and appends to body.
 * @returns {HTMLElement} The container element.
 */
function createCisloInputs(items, container) {
  const wrap = container ?? (() => {
    const div = document.createElement('div');
    div.className = 'container';
    document.body.appendChild(div);
    return div;
  })();

  const sorted = [...items].sort((a, b) => {
    const firstA = (a.equation || '').trim().split(/\s+/)[0] || '';
    const firstB = (b.equation || '').trim().split(/\s+/)[0] || '';
    return firstA.localeCompare(firstB);
  });

  sorted.forEach((item, index) => {
    const i = index + 1;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'cislo';
    input.id = `cislo${i}`;
    input.dataset.equation = item.equation || '';
    if (item.placeholder !== undefined && item.placeholder !== null) {
      input.placeholder = String(item.placeholder);
      if (item.disabled) {
        const p = String(item.placeholder);
        if (p && !isNaN(parseFloat(p))) input.value = p;
      }
    }
    if (item.disabled) {
      input.disabled = true;
    } else {
      input.classList.add('unknown');
    }
    input.style.left = `${item.x}px`;
    input.style.top = `${item.y}px`;
    wrap.appendChild(input);
  });

  return wrap;
}

/**
 * Equation ids can be chained with spaces (e.g. "1c 2a"). Builds a map from single equation id to the input element.
 */
function equationIdToInputMap(container) {
  const map = new Map();
  const inputs = container.querySelectorAll('.cislo');
  inputs.forEach((input) => {
    const eq = (input.dataset.equation || '').trim();
    if (!eq) return;
    eq.split(/\s+/).forEach((id) => {
      const key = id.trim();
      if (key) map.set(key, input);
    });
  });
  return map;
}

/**
 * Groups equation cells by equation number. One input can appear in multiple equations (e.g. "1c 2a").
 * Assumes structure per equation: left, operator, unknown(s), "=", result.
 * Colors unknown inputs: green if correct in at least one equation, red only if wrong in all.
 * @returns {boolean} true if every unknown input is correct (all equations cleared).
 */
function computeEquations(container) {
  const idToInput = equationIdToInputMap(container);
  const eqNumbers = [...new Set([...idToInput.keys()].map((id) => id.replace(/\D/g, '') || id.charAt(0)))].sort(
    (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })
  );

  const allUnknownInputs = new Set();
  const correctInAny = new Map();

  for (const eqNum of eqNumbers) {
    const ids = [...idToInput.keys()].filter((id) => (id.replace(/\D/g, '') || id.charAt(0)) === eqNum).sort((a, b) => a.localeCompare(b));
    const cells = ids.map((id) => ({ equationId: id, input: idToInput.get(id) })).filter((c) => c.input);

    const n = cells.length;
    if (n < 3) continue;
    const op = String(cells[1].input.value || cells[1].input.placeholder || '').trim();
    if (!op) continue;

    const getVal = (cell) => parseFloat(cell.input.value || cell.input.placeholder || '');
    const leftVal = getVal(cells[0]);
    const middleVal = n > 3 ? getVal(cells[2]) : NaN;
    const resultVal = getVal(cells[n - 1]);

    const unknowns = cells.filter((c) => c.input.classList.contains('unknown'));
    for (const { input } of unknowns) {
      allUnknownInputs.add(input);
      const user = parseFloat(input.value);
      const idx = cells.findIndex((c) => c.input === input);
      let correct = false;

      const isLeft = idx === 0;
      const isMiddle = idx === 2 && n > 3;
      const isResult = idx === n - 1;

      if (op === '+') {
        if (isMiddle) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(resultVal) && Math.abs(user - (resultVal - leftVal)) < 1e-9;
        else if (isResult) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && Math.abs(user - (leftVal + middleVal)) < 1e-9;
        else if (isLeft) correct = !isNaN(user) && !isNaN(middleVal) && !isNaN(resultVal) && Math.abs(user - (resultVal - middleVal)) < 1e-9;
      } else if (op === '-') {
        if (isMiddle) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(resultVal) && Math.abs(user - (leftVal - resultVal)) < 1e-9;
        else if (isResult) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && Math.abs(user - (leftVal - middleVal)) < 1e-9;
        else if (isLeft) correct = !isNaN(user) && !isNaN(middleVal) && !isNaN(resultVal) && Math.abs(user - (middleVal + resultVal)) < 1e-9;
      } else if (op === '*' || op === '×') {
        if (isMiddle) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(resultVal) && resultVal !== 0 && Math.abs(user - resultVal / leftVal) < 1e-9;
        else if (isResult) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && Math.abs(user - leftVal * middleVal) < 1e-9;
        else if (isLeft) correct = !isNaN(user) && !isNaN(middleVal) && !isNaN(resultVal) && middleVal !== 0 && Math.abs(user - resultVal / middleVal) < 1e-9;
      } else if (op === '/' || op === '÷') {
        if (isMiddle) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(resultVal) && resultVal !== 0 && Math.abs(user - leftVal / resultVal) < 1e-9;
        else if (isResult) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && middleVal !== 0 && Math.abs(user - leftVal / middleVal) < 1e-9;
        else if (isLeft) correct = !isNaN(user) && !isNaN(middleVal) && !isNaN(resultVal) && Math.abs(user - middleVal * resultVal) < 1e-9;
      } else if (op === '//') {
        if (isMiddle) correct = !isNaN(user) && user !== 0 && !isNaN(leftVal) && !isNaN(resultVal) && Math.floor(leftVal / user) === resultVal;
        else if (isResult) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && middleVal !== 0 && Math.floor(leftVal / middleVal) === user;
        else if (isLeft) correct = !isNaN(user) && !isNaN(middleVal) && !isNaN(resultVal) && middleVal !== 0 && Math.floor(user / middleVal) === resultVal;
      } else if (op === '**') {
        if (isMiddle) {
          const expected = leftVal > 0 && resultVal > 0 ? Math.log(resultVal) / Math.log(leftVal) : NaN;
          correct = !isNaN(user) && !isNaN(expected) && Math.abs(user - expected) < 1e-9;
        } else if (isResult) {
          correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && Math.abs(user - Math.pow(leftVal, middleVal)) < 1e-9;
        } else if (isLeft) {
          const expected = middleVal !== 0 && resultVal > 0 ? Math.pow(resultVal, 1 / middleVal) : NaN;
          correct = !isNaN(user) && !isNaN(expected) && Math.abs(user - expected) < 1e-9;
        }
      } else if (op === '%') {
        const leftInt = Math.floor(leftVal);
        const resultInt = Math.floor(resultVal);
        const userInt = Math.floor(user);
        if (isMiddle) correct = !isNaN(user) && userInt > 0 && !isNaN(leftVal) && !isNaN(resultVal) && (leftInt % userInt) === resultInt;
        else if (isResult) correct = !isNaN(user) && !isNaN(leftVal) && !isNaN(middleVal) && Math.floor(middleVal) > 0 && (leftInt % Math.floor(middleVal)) === Math.floor(user);
        else if (isLeft) correct = !isNaN(user) && !isNaN(middleVal) && Math.floor(middleVal) > 0 && (Math.floor(user) % Math.floor(middleVal)) === resultInt;
      }

      if (correct) correctInAny.set(input, true);
    }
  }

  for (const input of allUnknownInputs) {
    input.style.backgroundColor = correctInAny.get(input) ? 'green' : 'red';
  }

  const allCorrect = allUnknownInputs.size > 0 && [...allUnknownInputs].every((input) => correctInAny.get(input));
  return !!allCorrect;
}
