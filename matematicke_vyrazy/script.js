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
 * Tokenize an expression string into numbers and operators (+, -, *, /, //, **, %).
 */
function tokenizeExpression(expr) {
  const tokens = [];
  let i = 0;
  const s = String(expr).replace(/\s/g, '');
  while (i < s.length) {
    if (/[\d.]/.test(s[i])) {
      let num = '';
      while (i < s.length && /[\d.]/.test(s[i])) num += s[i++];
      tokens.push(parseFloat(num));
    } else if (s.substring(i, i + 2) === '//') {
      tokens.push('//');
      i += 2;
    } else if (s.substring(i, i + 2) === '**') {
      tokens.push('**');
      i += 2;
    } else if ('+-*/%'.includes(s[i])) {
      tokens.push(s[i]);
      i++;
    } else {
      i++;
    }
  }
  return tokens;
}

/**
 * Evaluate a single expression (no "="). Supports +, -, *, /, //, **, % with standard precedence.
 * ** is right-associative; *, /, //, % and +, - are left-associative.
 */
function evaluateExpression(exprStr) {
  let tokens = tokenizeExpression(exprStr);
  if (tokens.length === 0) return NaN;
  if (tokens.length === 1 && typeof tokens[0] === 'number') return tokens[0];

  while (tokens.includes('**')) {
    const idx = tokens.lastIndexOf('**');
    const a = tokens[idx - 1];
    const b = tokens[idx + 1];
    if (typeof a !== 'number' || typeof b !== 'number') return NaN;
    const result = Math.pow(a, b);
    tokens = tokens.slice(0, idx - 1).concat(result).concat(tokens.slice(idx + 2));
  }

  const mulOps = ['*', '/', '//', '%'];
  while (tokens.some((t) => mulOps.includes(t))) {
    const idx = tokens.findIndex((t) => mulOps.includes(t));
    const op = tokens[idx];
    const a = tokens[idx - 1];
    const b = tokens[idx + 1];
    if (typeof a !== 'number' || typeof b !== 'number') return NaN;
    let result;
    if (op === '*') result = a * b;
    else if (op === '/') result = a / b;
    else if (op === '//') result = Math.floor(a / b);
    else if (op === '%') result = ((a % b) + b) % b;
    tokens = tokens.slice(0, idx - 1).concat(result).concat(tokens.slice(idx + 2));
  }

  while (tokens.some((t) => t === '+' || t === '-')) {
    const idx = tokens.findIndex((t) => t === '+' || t === '-');
    const op = tokens[idx];
    const a = tokens[idx - 1];
    const b = tokens[idx + 1];
    if (typeof a !== 'number' || typeof b !== 'number') return NaN;
    const result = op === '+' ? a + b : a - b;
    tokens = tokens.slice(0, idx - 1).concat(result).concat(tokens.slice(idx + 2));
  }

  return tokens[0];
}

/**
 * Evaluate an equation string like "10-3+8=15" or "1+5=2*3".
 * Splits on "=", evaluates left and right, returns true if they are equal (within float tolerance).
 */
function evaluateEquationString(str) {
  const parts = String(str)
    .split('=')
    .map((p) => p.trim());
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') return false;
  const left = evaluateExpression(parts[0]);
  const right = evaluateExpression(parts[1]);
  if (isNaN(left) || isNaN(right)) return false;
  return Math.abs(left - right) < 1e-9;
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
 * Builds a string from each equation (e.g. "10-3+8=15") and evaluates it; supports any size and +, -, *, /, //, **, %.
 * Empty unknowns are marked red. Only equations with no empty cells count as correct; correct-but-incomplete (other equation empty/wrong) → orange.
 * Colors: green = correct in every equation (all equations complete and true), orange = some correct some not, red = none correct or empty.
 * @returns {boolean} true only when every unknown is filled and green (all equations complete and correct); enables Next level.
 */
function computeEquations(container) {
  const idToInput = equationIdToInputMap(container);
  const eqNumbers = [...new Set([...idToInput.keys()].map((id) => id.replace(/\D/g, '') || id.charAt(0)))].sort(
    (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })
  );

  const allUnknownInputs = new Set();
  const correctCount = new Map();
  const totalCount = new Map();

  for (const eqNum of eqNumbers) {
    const ids = [...idToInput.keys()].filter((id) => (id.replace(/\D/g, '') || id.charAt(0)) === eqNum).sort((a, b) => a.localeCompare(b));
    const cells = ids.map((id) => ({ equationId: id, input: idToInput.get(id) })).filter((c) => c.input);

    let eqStr = cells.map((c) => (c.input.value || c.input.placeholder || '').toString().trim()).join('');
    eqStr = eqStr.replace(/×/g, '*').replace(/÷/g, '/');
    if (!eqStr.includes('=')) continue;

    const unknowns = cells.filter((c) => c.input.classList.contains('unknown'));
    const hasEmpty = unknowns.some(({ input }) => !(input.value || '').toString().trim());

    for (const { input } of unknowns) {
      allUnknownInputs.add(input);
      totalCount.set(input, (totalCount.get(input) || 0) + 1);
    }

    if (!hasEmpty && evaluateEquationString(eqStr)) {
      for (const { input } of unknowns) {
        correctCount.set(input, (correctCount.get(input) || 0) + 1);
      }
    }
  }

  for (const input of allUnknownInputs) {
    const isEmpty = !(input.value || '').toString().trim();
    if (isEmpty) {
      input.style.backgroundColor = 'red';
    } else {
      const total = totalCount.get(input) || 0;
      const correct = correctCount.get(input) || 0;
      if (total === 0) {
        input.style.backgroundColor = '';
      } else if (correct === total) {
        input.style.backgroundColor = 'green';
      } else if (correct === 0) {
        input.style.backgroundColor = 'red';
      } else {
        input.style.backgroundColor = 'orange';
      }
    }
  }

  const allGreen =
    allUnknownInputs.size > 0 &&
    [...allUnknownInputs].every((input) => {
      if (!(input.value || '').toString().trim()) return false;
      return (correctCount.get(input) || 0) === (totalCount.get(input) || 0);
    });
  return !!allGreen;
}
