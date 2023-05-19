const fs = require('fs');

function reformatText(inputText) {
  const rawTests = inputText.trim().split('Set ');
  rawTests.shift();
  const tests = rawTests.map((rawTest) => {
    const lines = rawTest.trim().split('\n');
    const name = `Set ${lines[0].substring(0, lines[0].length - 1)}`;

    const keyLine = lines[1].trim();
    const key = keyLine.split('=')[1].trim();

    const ivLine = lines[2].trim();
    const iv = ivLine.split('=')[1].trim();
    const outputs = [];

    for (let i = 3; i < lines.length - 6; i += 4) {
      const rangeLine = lines[i].trim();
      const fromTo = rangeLine.split('[')[1].split(']')[0].split('..');
      const from = parseInt(fromTo[0]);
      const to = parseInt(fromTo[1]);

      let output = '';
      console.log('sss');
      for (let j = i; j <= i + 3; j += 1) {
        const outputLine = j === i ? lines[i].split('=')[1].trim() : lines[j].trim();
        output += outputLine;
      }
      outputs.push({ from, to, output });
    }
    return { name, iv, key, outputs };
  });

  return JSON.stringify(tests, null, 2);
}

// Input text
const inputText = fs.readFileSync('raw.txt', { encoding: 'utf8' });
// console.log(inputText);
const reformattedText = reformatText(inputText);
fs.writeFileSync('fixtures.ts', reformattedText);
