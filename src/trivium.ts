class Trivium {
  state: number[] = [];
  constructor(keyHex: string, ivHex: string) {
    const key = hexToBits(changeEndianness(keyHex), 80);
    const iv = hexToBits(changeEndianness(ivHex), 80);

    // initialize the state
    this.state = key
      .concat(new Array(13).fill(0))
      .concat(iv)
      .concat(new Array(4).fill(0))
      .concat(new Array(108).fill(0))
      .concat(new Array(3).fill(1));

    // but first, fast forward to the real bits:
    let streamBit = -4 * 288; // the first bits are weak, remember?
    while (streamBit < 0) {
      this.nextbit();
      streamBit++;
    }
  }

  nextbit(): number {
    let t1 = this.state[65] ^ this.state[92];
    let t2 = this.state[161] ^ this.state[176];
    let t3 = this.state[242] ^ this.state[287];

    const z = t1 ^ t2 ^ t3;

    t1 = t1 ^ (this.state[90] & this.state[91]) ^ this.state[170];
    t2 = t2 ^ (this.state[174] & this.state[175]) ^ this.state[263];
    t3 = t3 ^ (this.state[285] & this.state[286]) ^ this.state[68];

    rotate(this.state);

    this.state[0] = t3;
    this.state[93] = t1;
    this.state[177] = t2;

    return z;
  }

  keystream() {
    const bits = new Array(8).fill(0).map(() => {
      const bit = this.nextbit();
      return bit;
    });

    return bits;
  }
}

export function encrypt(keyString: string, ivString: string, ab: Uint8Array) {
  const T = new Trivium(keyString, ivString);
  return ab.map((v) => {
    let ks = T.keystream().reverse();
    let ksNumber = bitsToNumber(ks);
    return v ^ ksNumber;
  });
}

const bitsToNumber = (bits: number[]): number => {
  let str = '';
  for (let i = 0; i < bits.length; i += 8) {
    const chunk = bits.slice(i, i + 8).join('');
    str += parseInt(chunk, 2);
  }
  return parseInt(str, 10);
};

const hexToBits = (hexString: string, pad = 0): number[] => {
  const str = parseInt(hexString, 16).toString(2).padStart(pad, '0');
  return str.split('').map((v) => +v);
};

const changeEndianness = (string: string) => {
  const result = [];
  let len = string.length - 2;
  while (len >= 0) {
    result.push(string.substr(len, 2));
    len -= 2;
  }
  return result.join('');
};

const rotate = (arr: any[], n: number = 1) => {
  if (n > 0) {
    for (let i = 0; i < n; i++) {
      arr.unshift(arr.pop());
    }
  } else if (n < 0) {
    for (let i = 0; i < Math.abs(n); i++) {
      arr.push(arr.shift());
    }
  }
};
