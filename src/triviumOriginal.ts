/*

Trivium in Javascript, 29 April 2009 by Charlie Loyd <c@6jo.org>.

I MAKE NO CLAIMS FOR THE SECURITY OF THIS IMPLEMENTATION. I could easily have
made any number of obvious or subtle errors. If you want something like this for
something important, ask an expert!

This was mostly done in a single hackathon, at the end of which I was leaking
cerebral fluid from my ears (I tried, and gave up on, quite a lot of stupider
implementations than this one). There are probably some horrible bugs here. Feel
free to e-mail me.

Trivium is an extremely simple but (so far) cryptographically fairly strong
cipher. This code is a pretty vanilla translation of the specification and other
references linked from its Wikipedia page, which I found clear and helpful. Like
Trivium, this implementation is free for any use.

Here's the mid-level overview. We have three lists of bits, A, B, C. At every
step, we copy certain bits from near their ends, mash those up with some ands
and xors, and produce 4 new random-looking bits, one for the keystream and one
to append to each list.

At the beginning the bits contain only known state (mostly 0s) plus the key and
IV. This makes the very early output cryptographically weak, so the first 1152
bits of the stream are discarded, after which the state is considered mixed
enough and real output begins.


  Optimization:

I have done no serious cross-browser benchmarking. These opportunities come to
mind:

+ Is it faster to use shifter method 2, below? Perhaps even appending for a
while, then slicing periodically instead of with a bunch of little unshifts?
This would mean rewriting the indices to be positive.

+ Would it be faster to represent bits and booleans (and write an xor function)?
Representing them as floats means they're internally converted to ints for
bitwise operations, which must add up.

+ The little stringy functions at the bottom.


  Remarks on the shift registers:

A, B, C could plausibly be implemented in at least three ways:

1. Ever-growing arrays (up to 2^64 bits, Trivium's limit). Pro: conceptually
clean. Con: for a string of length n bytes, something like 3 lists * 8 bits per
byte = 24n memory consumption, which could get ugly.

2. Shift/unshift arrays. Pro: conceptually clean. Con: (un)shift has tended to
be slow in JS implementations. I have not actually checked this!

3. Arrays with internal pointers emulating loops. Pro: should be fast (despite
the function call overhead), and, because it means writing a getter anyway,
allows us to use the negative indexing with which Trivium is usually described
(which vanilla arrays don't). Con: kind of pointer-arithmetic-in-C-ish.

We're using method 3. The shifter class is an array that only takes negative
indexes and takes care of its own pointer when you shift onto it.


*/

function shifter(this: any, state: any): any {
  var ceil = state.length;
  var ptr = 0;

  this.get = function (n: any) {
    n = (n + ceil + ptr) % ceil;
    return state[n];
  };

  this.shift = function (e: any) {
    state[ptr] = e;
    ptr = (ptr + 1) % ceil;
  };
}

function repeat(e: any, n: any) {
  var r = [];
  for (var i = 0; i < n; i++) {
    r.push(e);
  }
  return r;
}

function trivium_gen(this: any, keys: any, ivs: any) {
  var stream_bit = -1152; // the first bits are weak, remember?
  var key = string_to_bits(keys).slice(0, 80);
  var iv = string_to_bits(ivs).slice(0, 80);
  console.log(key);

  var A: any = new (shifter as any)(repeat(0, 93 - key.length).concat(key));
  var B: any = new (shifter as any)(repeat(0, 84 - iv.length).concat(iv));
  var C: any = new (shifter as any)(repeat(1, 3).concat(repeat(0, 111 - 3)));

  this.nextbit = function () {
    var bit = C.get(-66) ^ C.get(-111) ^ A.get(-66) ^ A.get(-93) ^ B.get(-69) ^ B.get(-84);

    var A_in = C.get(-66) ^ C.get(-111) ^ (C.get(-110) & C.get(-109)) ^ A.get(-69);

    var B_in = A.get(-66) ^ A.get(-93) ^ (A.get(-92) & A.get(-91)) ^ B.get(-78);

    var C_in = B.get(-69) ^ B.get(-84) ^ (B.get(-83) & B.get(-82)) ^ C.get(-87);

    A.shift(A_in);
    B.shift(B_in);
    C.shift(C_in);

    stream_bit++;
    return bit;
  };

  this.nextpoint = function () {
    var bits = [];
    for (var b = 0; b < 16; b++) {
      bits[b] = this.nextbit();
    }
    return bits_to_point(bits);
  };

  this.log = function () {
    console.log('new', stream_bit, A.get(0), B.get(0), C.get(0));
  };

  // but first, fast forward to the real bits:
  while (stream_bit < 0) {
    this.nextbit();
  }
}

export function encrypt(key: any, iv: any, s: any) {
  s = string_to_points(s);
  var plain = [];
  var T = new (trivium_gen as any)(key, iv);
  T.log();
  for (var point = 0; point < s.length; point++) {
    plain[point] = s[point] ^ T.nextpoint();
  }
  return plain;
}

// Now some unsexy (and under-optimized) stuff for
// bits <-> codepoints <-> string conversion.

function string_to_points(str: any) {
  var points = [];
  for (var p = 0; p < str.length; p++) {
    points[p] = str.charCodeAt(p);
  }
  return points;
}

function points_to_string(points: any) {
  return String.fromCharCode.apply(null, points);
}

function bits_to_point(bits: any) {
  var point = 0;
  for (var i = 0; i < 16; i++) {
    if (bits[i]) point += (2 << i) / 2;
  }
  return point;
}

function point_to_bits(point: any) {
  let bits = [];
  for (var i = 0; i < 16; i++) {
    bits.push((point >> i) % 2);
  }
  return bits;
}

function string_to_bits(s: any) {
  return points_to_bits(string_to_points(s));
}

function points_to_bits(pts: any) {
  let bits: any[] = [];
  for (var p = 0; p < pts.length; p++) {
    bits = bits.concat(point_to_bits(pts[p]));
  }
  return bits;
}
