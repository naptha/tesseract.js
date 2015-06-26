importScripts('madeline.js')

var filesizes = {
	"afr": 1079573,
	"ara": 1701536,
	"aze": 1420865,
	"bel": 1276820,
	"ben": 6772012,
	"bul": 1605615,
	"cat": 1652368,
	"ces": 1035441,
	"chi_sim": 17710414,
	"chi_tra": 24717749,
	"chr": 320649,
	"dan-frak": 677656,
	"dan": 1972936,
	"deu-frak": 822644,
	"deu": 991656,
	"ell": 859719,
	"eng": 9453554,
	"enm": 619254,
	"epo": 1241212,
	"equ": 821130,
	"est": 1905040,
	"eus": 1641190,
	"fin": 979418,
	"fra": 1376221,
	"frk": 5912963,
	"frm": 5147082,
	"glg": 1674938,
	"grc": 3012615,
	"heb": 1051501,
	"hin": 6590065,
	"hrv": 1926995,
	"hun": 3074473,
	"ind": 1874776,
	"isl": 1634041,
	"ita": 948593,
	"ita_old": 3436571,
	"jpn": 13507168,
	"kan": 4390317,
	"kor": 5353098,
	"lav": 1843944,
	"lit": 1779240,
	"mal": 5966263,
	"meme": 88453,
	"mkd": 1163087,
	"mlt": 1463001,
	"msa": 1665427,
	"nld": 1134708,
	"nor": 2191610,
	"osd": 4274649,
	"pol": 7024662,
	"por": 909359,
	"ron": 915680,
	"rus": 5969957,
	"slk-frak": 289885,
	"slk": 2217342,
	"slv": 1611338,
	"spa": 883170,
	"spa_old": 5647453,
	"sqi": 1667041,
	"srp": 1770244,
	"swa": 757916,
	"swe": 2451917,
	"tam": 3498763,
	"tel": 5795246,
	"tgl": 1496256,
	"tha": 3811136,
	"tur": 3563264,
	"ukr": 937566,
	"vie": 2195922
}

var recognize = (function createTesseractInstance(){

	var Module = Tesseract304({
		TOTAL_MEMORY: 90e6,
		TesseractProgress: function(percent){
			console.log('recognized',percent+'%')
		}
	})

	var base = new Module.TessBaseAPI()
	var loaded_langs = []
	var loadLanguage = (function(){
		var crc32 = (function() {

	var table = [],
		poly = 0xEDB88320; // reverse polynomial

	// build the table
	function makeTable() {
		var c, n, k;

		for (n = 0; n < 256; n += 1) {
			c = n;
			for (k = 0; k < 8; k += 1) {
				if (c & 1) {
					c = poly ^ (c >>> 1);
				} else {
					c = c >>> 1;
				}
			}
			table[n] = c >>> 0;
		}
	}

	function strToArr(str) {
		// sweet hack to turn string into a 'byte' array
		return Array.prototype.map.call(str, function (c) {
			return c.charCodeAt(0);
		});
	}

	/*
	 * Compute CRC of array directly.
	 *
	 * This is slower for repeated calls, so append mode is not supported.
	 */
	function crcDirect(arr) {
		var crc = -1, // initial contents of LFBSR
			i, j, l, temp;

		for (i = 0, l = arr.length; i < l; i += 1) {
			temp = (crc ^ arr[i]) & 0xff;

			// read 8 bits one at a time
			for (j = 0; j < 8; j += 1) {
				if ((temp & 1) === 1) {
					temp = (temp >>> 1) ^ poly;
				} else {
					temp = (temp >>> 1);
				}
			}
			crc = (crc >>> 8) ^ temp;
		}

		// flip bits
		return crc ^ -1;
	}

	/*
	 * Compute CRC with the help of a pre-calculated table.
	 *
	 * This supports append mode, if the second parameter is set.
	 */
	function crcTable(arr, append) {
		var crc, i, l;

		// if we're in append mode, don't reset crc
		// if arr is null or undefined, reset table and return
		if (typeof crcTable.crc === 'undefined' || !append || !arr) {
			crcTable.crc = 0 ^ -1;

			if (!arr) {
				return;
			}
		}

		// store in temp variable for minor speed gain
		crc = crcTable.crc;

		for (i = 0, l = arr.length; i < l; i += 1) {
			crc = (crc >>> 8) ^ table[(crc ^ arr[i]) & 0xff];
		}

		crcTable.crc = crc;

		return crc ^ -1;
	}

	// build the table
	// this isn't that costly, and most uses will be for table assisted mode
	makeTable();

	var exports = function (val, direct) {
		var val = (typeof val === 'string') ? strToArr(val) : val,
			ret = direct ? crcDirect(val) : crcTable(val);

		// convert to 2's complement hex
		return (ret >>> 0).toString(16);
	};
	exports.direct = crcDirect;
	exports.table = crcTable;

	return exports;
})()	

		var inflate = (function () {
	/* constant parameters */
	var WSIZE = 32768, // Sliding Window size
		STORED_BLOCK = 0,
		STATIC_TREES = 1,
		DYN_TREES = 2,

	/* for inflate */
		lbits = 9, // bits in base literal/length lookup table
		dbits = 6, // bits in base distance lookup table

	/* variables (inflate) */
		slide,
		wp, // current position in slide
		fixed_tl = null, // inflate static
		fixed_td, // inflate static
		fixed_bl, // inflate static
		fixed_bd, // inflate static
		bit_buf, // bit buffer
		bit_len, // bits in bit buffer
		method,
		eof,
		copy_leng,
		copy_dist,
		tl, // literal length decoder table
		td, // literal distance decoder table
		bl, // number of bits decoded by tl
		bd, // number of bits decoded by td

		inflate_data,
		inflate_pos,

/* constant tables (inflate) */
		MASK_BITS = [
			0x0000,
			0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff,
			0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff
		],
		// Tables for deflate from PKZIP's appnote.txt.
		// Copy lengths for literal codes 257..285
		cplens = [
			3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
			35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
		],
/* note: see note #13 above about the 258 in this list. */
		// Extra bits for literal codes 257..285
		cplext = [
			0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
			3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99 // 99==invalid
		],
		// Copy offsets for distance codes 0..29
		cpdist = [
			1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
			257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
			8193, 12289, 16385, 24577
		],
		// Extra bits for distance codes
		cpdext = [
			0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
			7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
			12, 12, 13, 13
		],
		// Order of the bit length code lengths
		border = [
			16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
		];
	/* objects (inflate) */

	function HuftList() {
		this.next = null;
		this.list = null;
	}

	function HuftNode() {
		this.e = 0; // number of extra bits or operation
		this.b = 0; // number of bits in this code or subcode

		// union
		this.n = 0; // literal, length base, or distance base
		this.t = null; // (HuftNode) pointer to next level of table
	}

	/*
	 * @param b-  code lengths in bits (all assumed <= BMAX)
	 * @param n- number of codes (assumed <= N_MAX)
	 * @param s- number of simple-valued codes (0..s-1)
	 * @param d- list of base values for non-simple codes
	 * @param e- list of extra bits for non-simple codes
	 * @param mm- maximum lookup bits
	 */
	function HuftBuild(b, n, s, d, e, mm) {
		this.BMAX = 16; // maximum bit length of any code
		this.N_MAX = 288; // maximum number of codes in any set
		this.status = 0; // 0: success, 1: incomplete table, 2: bad input
		this.root = null; // (HuftList) starting table
		this.m = 0; // maximum lookup bits, returns actual

	/* Given a list of code lengths and a maximum table size, make a set of
	   tables to decode that set of codes. Return zero on success, one if
	   the given code set is incomplete (the tables are still built in this
	   case), two if the input is invalid (all zero length codes or an
	   oversubscribed set of lengths), and three if not enough memory.
	   The code with value 256 is special, and the tables are constructed
	   so that no bits beyond that code are fetched when that code is
	   decoded. */
		var a; // counter for codes of length k
		var c = [];
		var el; // length of EOB code (value 256)
		var f; // i repeats in table every f entries
		var g; // maximum code length
		var h; // table level
		var i; // counter, current code
		var j; // counter
		var k; // number of bits in current code
		var lx = [];
		var p; // pointer into c[], b[], or v[]
		var pidx; // index of p
		var q; // (HuftNode) points to current table
		var r = new HuftNode(); // table entry for structure assignment
		var u = [];
		var v = [];
		var w;
		var x = [];
		var xp; // pointer into x or c
		var y; // number of dummy codes added
		var z; // number of entries in current table
		var o;
		var tail; // (HuftList)

		tail = this.root = null;

		// bit length count table
		for (i = 0; i < this.BMAX + 1; i++) {
			c[i] = 0;
		}
		// stack of bits per table
		for (i = 0; i < this.BMAX + 1; i++) {
			lx[i] = 0;
		}
		// HuftNode[BMAX][]  table stack
		for (i = 0; i < this.BMAX; i++) {
			u[i] = null;
		}
		// values in order of bit length
		for (i = 0; i < this.N_MAX; i++) {
			v[i] = 0;
		}
		// bit offsets, then code stack
		for (i = 0; i < this.BMAX + 1; i++) {
			x[i] = 0;
		}

		// Generate counts for each bit length
		el = n > 256 ? b[256] : this.BMAX; // set length of EOB code, if any
		p = b; pidx = 0;
		i = n;
		do {
			c[p[pidx]]++; // assume all entries <= BMAX
			pidx++;
		} while (--i > 0);
		if (c[0] === n) { // null input--all zero length codes
			this.root = null;
			this.m = 0;
			this.status = 0;
			return;
		}

		// Find minimum and maximum length, bound *m by those
		for (j = 1; j <= this.BMAX; j++) {
			if (c[j] !== 0) {
				break;
			}
		}
		k = j; // minimum code length
		if (mm < j) {
			mm = j;
		}
		for (i = this.BMAX; i !== 0; i--) {
			if (c[i] !== 0) {
				break;
			}
		}
		g = i; // maximum code length
		if (mm > i) {
			mm = i;
		}

		// Adjust last length count to fill out codes, if needed
		for (y = 1 << j; j < i; j++, y <<= 1) {
			if ((y -= c[j]) < 0) {
				this.status = 2; // bad input: more codes than bits
				this.m = mm;
				return;
			}
		}
		if ((y -= c[i]) < 0) {
			this.status = 2;
			this.m = mm;
			return;
		}
		c[i] += y;

		// Generate starting offsets into the value table for each length
		x[1] = j = 0;
		p = c;
		pidx = 1;
		xp = 2;
		while (--i > 0) { // note that i == g from above
			x[xp++] = (j += p[pidx++]);
		}

		// Make a table of values in order of bit lengths
		p = b; pidx = 0;
		i = 0;
		do {
			if ((j = p[pidx++]) !== 0) {
				v[x[j]++] = i;
			}
		} while (++i < n);
		n = x[g]; // set n to length of v

		// Generate the Huffman codes and for each, make the table entries
		x[0] = i = 0; // first Huffman code is zero
		p = v; pidx = 0; // grab values in bit order
		h = -1; // no tables yet--level -1
		w = lx[0] = 0; // no bits decoded yet
		q = null; // ditto
		z = 0; // ditto

		// go through the bit lengths (k already is bits in shortest code)
		for (null; k <= g; k++) {
			a = c[k];
			while (a-- > 0) {
				// here i is the Huffman code of length k bits for value p[pidx]
				// make tables up to required level
				while (k > w + lx[1 + h]) {
					w += lx[1 + h]; // add bits already decoded
					h++;

					// compute minimum size table less than or equal to *m bits
					z = (z = g - w) > mm ? mm : z; // upper limit
					if ((f = 1 << (j = k - w)) > a + 1) { // try a k-w bit table
						// too few codes for k-w bit table
						f -= a + 1; // deduct codes from patterns left
						xp = k;
						while (++j < z) { // try smaller tables up to z bits
							if ((f <<= 1) <= c[++xp]) {
								break; // enough codes to use up j bits
							}
							f -= c[xp]; // else deduct codes from patterns
						}
					}
					if (w + j > el && w < el) {
						j = el - w; // make EOB code end at table
					}
					z = 1 << j; // table entries for j-bit table
					lx[1 + h] = j; // set table size in stack

					// allocate and link in new table
					q = [];
					for (o = 0; o < z; o++) {
						q[o] = new HuftNode();
					}

					if (!tail) {
						tail = this.root = new HuftList();
					} else {
						tail = tail.next = new HuftList();
					}
					tail.next = null;
					tail.list = q;
					u[h] = q; // table starts after link

					/* connect to last table, if there is one */
					if (h > 0) {
						x[h] = i; // save pattern for backing up
						r.b = lx[h]; // bits to dump before this table
						r.e = 16 + j; // bits in this table
						r.t = q; // pointer to this table
						j = (i & ((1 << w) - 1)) >> (w - lx[h]);
						u[h - 1][j].e = r.e;
						u[h - 1][j].b = r.b;
						u[h - 1][j].n = r.n;
						u[h - 1][j].t = r.t;
					}
				}

				// set up table entry in r
				r.b = k - w;
				if (pidx >= n) {
					r.e = 99; // out of values--invalid code
				} else if (p[pidx] < s) {
					r.e = (p[pidx] < 256 ? 16 : 15); // 256 is end-of-block code
					r.n = p[pidx++]; // simple code is just the value
				} else {
					r.e = e[p[pidx] - s]; // non-simple--look up in lists
					r.n = d[p[pidx++] - s];
				}

				// fill code-like entries with r //
				f = 1 << (k - w);
				for (j = i >> w; j < z; j += f) {
					q[j].e = r.e;
					q[j].b = r.b;
					q[j].n = r.n;
					q[j].t = r.t;
				}

				// backwards increment the k-bit code i
				for (j = 1 << (k - 1); (i & j) !== 0; j >>= 1) {
					i ^= j;
				}
				i ^= j;

				// backup over finished tables
				while ((i & ((1 << w) - 1)) !== x[h]) {
					w -= lx[h]; // don't need to update q
					h--;
				}
			}
		}

		/* return actual size of base table */
		this.m = lx[1];

		/* Return true (1) if we were given an incomplete table */
		this.status = ((y !== 0 && g !== 1) ? 1 : 0);
	}


	/* routines (inflate) */

	function GET_BYTE() {
		if (inflate_data.length === inflate_pos) {
			return -1;
		}
		return inflate_data[inflate_pos++] & 0xff;
	}

	function NEEDBITS(n) {
		while (bit_len < n) {
			bit_buf |= GET_BYTE() << bit_len;
			bit_len += 8;
		}
	}

	function GETBITS(n) {
		return bit_buf & MASK_BITS[n];
	}

	function DUMPBITS(n) {
		bit_buf >>= n;
		bit_len -= n;
	}

	function inflate_codes(buff, off, size) {
		// inflate (decompress) the codes in a deflated (compressed) block.
		// Return an error code or zero if it all goes ok.
		var e; // table entry flag/number of extra bits
		var t; // (HuftNode) pointer to table entry
		var n;

		if (size === 0) {
			return 0;
		}

		// inflate the coded data
		n = 0;
		for (;;) { // do until end of block
			NEEDBITS(bl);
			t = tl.list[GETBITS(bl)];
			e = t.e;
			while (e > 16) {
				if (e === 99) {
					return -1;
				}
				DUMPBITS(t.b);
				e -= 16;
				NEEDBITS(e);
				t = t.t[GETBITS(e)];
				e = t.e;
			}
			DUMPBITS(t.b);

			if (e === 16) { // then it's a literal
				wp &= WSIZE - 1;
				buff[off + n++] = slide[wp++] = t.n;
				if (n === size) {
					return size;
				}
				continue;
			}

			// exit if end of block
			if (e === 15) {
				break;
			}

			// it's an EOB or a length

			// get length of block to copy
			NEEDBITS(e);
			copy_leng = t.n + GETBITS(e);
			DUMPBITS(e);

			// decode distance of block to copy
			NEEDBITS(bd);
			t = td.list[GETBITS(bd)];
			e = t.e;

			while (e > 16) {
				if (e === 99) {
					return -1;
				}
				DUMPBITS(t.b);
				e -= 16;
				NEEDBITS(e);
				t = t.t[GETBITS(e)];
				e = t.e;
			}
			DUMPBITS(t.b);
			NEEDBITS(e);
			copy_dist = wp - t.n - GETBITS(e);
			DUMPBITS(e);

			// do the copy
			while (copy_leng > 0 && n < size) {
				copy_leng--;
				copy_dist &= WSIZE - 1;
				wp &= WSIZE - 1;
				buff[off + n++] = slide[wp++] = slide[copy_dist++];
			}

			if (n === size) {
				return size;
			}
		}

		method = -1; // done
		return n;
	}

	function inflate_stored(buff, off, size) {
		/* "decompress" an inflated type 0 (stored) block. */
		var n;

		// go to byte boundary
		n = bit_len & 7;
		DUMPBITS(n);

		// get the length and its complement
		NEEDBITS(16);
		n = GETBITS(16);
		DUMPBITS(16);
		NEEDBITS(16);
		if (n !== ((~bit_buf) & 0xffff)) {
			return -1; // error in compressed data
		}
		DUMPBITS(16);

		// read and output the compressed data
		copy_leng = n;

		n = 0;
		while (copy_leng > 0 && n < size) {
			copy_leng--;
			wp &= WSIZE - 1;
			NEEDBITS(8);
			buff[off + n++] = slide[wp++] = GETBITS(8);
			DUMPBITS(8);
		}

		if (copy_leng === 0) {
			method = -1; // done
		}
		return n;
	}

	function inflate_fixed(buff, off, size) {
		// decompress an inflated type 1 (fixed Huffman codes) block.  We should
		// either replace this with a custom decoder, or at least precompute the
		// Huffman tables.

		// if first time, set up tables for fixed blocks
		if (!fixed_tl) {
			var i; // temporary variable
			var l = []; // 288 length list for huft_build (initialized below)
			var h; // HuftBuild

			// literal table
			for (i = 0; i < 144; i++) {
				l[i] = 8;
			}
			for (null; i < 256; i++) {
				l[i] = 9;
			}
			for (null; i < 280; i++) {
				l[i] = 7;
			}
			for (null; i < 288; i++) { // make a complete, but wrong code set
				l[i] = 8;
			}
			fixed_bl = 7;

			h = new HuftBuild(l, 288, 257, cplens, cplext, fixed_bl);
			if (h.status !== 0) {
				console.error("HufBuild error: " + h.status);
				return -1;
			}
			fixed_tl = h.root;
			fixed_bl = h.m;

			// distance table
			for (i = 0; i < 30; i++) { // make an incomplete code set
				l[i] = 5;
			}
			fixed_bd = 5;

			h = new HuftBuild(l, 30, 0, cpdist, cpdext, fixed_bd);
			if (h.status > 1) {
				fixed_tl = null;
				console.error("HufBuild error: " + h.status);
				return -1;
			}
			fixed_td = h.root;
			fixed_bd = h.m;
		}

		tl = fixed_tl;
		td = fixed_td;
		bl = fixed_bl;
		bd = fixed_bd;
		return inflate_codes(buff, off, size);
	}

	function inflate_dynamic(buff, off, size) {
		// decompress an inflated type 2 (dynamic Huffman codes) block.
		var i; // temporary variables
		var j;
		var l; // last length
		var n; // number of lengths to get
		var t; // (HuftNode) literal/length code table
		var nb; // number of bit length codes
		var nl; // number of literal/length codes
		var nd; // number of distance codes
		var ll = [];
		var h; // (HuftBuild)

		// literal/length and distance code lengths
		for (i = 0; i < 286 + 30; i++) {
			ll[i] = 0;
		}

		// read in table lengths
		NEEDBITS(5);
		nl = 257 + GETBITS(5); // number of literal/length codes
		DUMPBITS(5);
		NEEDBITS(5);
		nd = 1 + GETBITS(5); // number of distance codes
		DUMPBITS(5);
		NEEDBITS(4);
		nb = 4 + GETBITS(4); // number of bit length codes
		DUMPBITS(4);
		if (nl > 286 || nd > 30) {
			return -1; // bad lengths
		}

		// read in bit-length-code lengths
		for (j = 0; j < nb; j++) {
			NEEDBITS(3);
			ll[border[j]] = GETBITS(3);
			DUMPBITS(3);
		}
		for (null; j < 19; j++) {
			ll[border[j]] = 0;
		}

		// build decoding table for trees--single level, 7 bit lookup
		bl = 7;
		h = new HuftBuild(ll, 19, 19, null, null, bl);
		if (h.status !== 0) {
			return -1; // incomplete code set
		}

		tl = h.root;
		bl = h.m;

		// read in literal and distance code lengths
		n = nl + nd;
		i = l = 0;
		while (i < n) {
			NEEDBITS(bl);
			t = tl.list[GETBITS(bl)];
			j = t.b;
			DUMPBITS(j);
			j = t.n;
			if (j < 16) { // length of code in bits (0..15)
				ll[i++] = l = j; // save last length in l
			} else if (j === 16) { // repeat last length 3 to 6 times
				NEEDBITS(2);
				j = 3 + GETBITS(2);
				DUMPBITS(2);
				if (i + j > n) {
					return -1;
				}
				while (j-- > 0) {
					ll[i++] = l;
				}
			} else if (j === 17) { // 3 to 10 zero length codes
				NEEDBITS(3);
				j = 3 + GETBITS(3);
				DUMPBITS(3);
				if (i + j > n) {
					return -1;
				}
				while (j-- > 0) {
					ll[i++] = 0;
				}
				l = 0;
			} else { // j === 18: 11 to 138 zero length codes
				NEEDBITS(7);
				j = 11 + GETBITS(7);
				DUMPBITS(7);
				if (i + j > n) {
					return -1;
				}
				while (j-- > 0) {
					ll[i++] = 0;
				}
				l = 0;
			}
		}

		// build the decoding tables for literal/length and distance codes
		bl = lbits;
		h = new HuftBuild(ll, nl, 257, cplens, cplext, bl);
		if (bl === 0) { // no literals or lengths
			h.status = 1;
		}
		if (h.status !== 0) {
			if (h.status !== 1) {
				return -1; // incomplete code set
			}
			// **incomplete literal tree**
		}
		tl = h.root;
		bl = h.m;

		for (i = 0; i < nd; i++) {
			ll[i] = ll[i + nl];
		}
		bd = dbits;
		h = new HuftBuild(ll, nd, 0, cpdist, cpdext, bd);
		td = h.root;
		bd = h.m;

		if (bd === 0 && nl > 257) { // lengths but no distances
			// **incomplete distance tree**
			return -1;
		}
/*
		if (h.status === 1) {
			// **incomplete distance tree**
		}
*/
		if (h.status !== 0) {
			return -1;
		}

		// decompress until an end-of-block code
		return inflate_codes(buff, off, size);
	}

	function inflate_start() {
		if (!slide) {
			slide = []; // new Array(2 * WSIZE); // slide.length is never called
		}
		wp = 0;
		bit_buf = 0;
		bit_len = 0;
		method = -1;
		eof = false;
		copy_leng = copy_dist = 0;
		tl = null;
	}

	function inflate_internal(buff, off, size) {
		// decompress an inflated entry
		var n, i;

		n = 0;
		while (n < size) {
			if (eof && method === -1) {
				return n;
			}

			if (copy_leng > 0) {
				if (method !== STORED_BLOCK) {
					// STATIC_TREES or DYN_TREES
					while (copy_leng > 0 && n < size) {
						copy_leng--;
						copy_dist &= WSIZE - 1;
						wp &= WSIZE - 1;
						buff[off + n++] = slide[wp++] = slide[copy_dist++];
					}
				} else {
					while (copy_leng > 0 && n < size) {
						copy_leng--;
						wp &= WSIZE - 1;
						NEEDBITS(8);
						buff[off + n++] = slide[wp++] = GETBITS(8);
						DUMPBITS(8);
					}
					if (copy_leng === 0) {
						method = -1; // done
					}
				}
				if (n === size) {
					return n;
				}
			}

			if (method === -1) {
				if (eof) {
					break;
				}

				// read in last block bit
				NEEDBITS(1);
				if (GETBITS(1) !== 0) {
					eof = true;
				}
				DUMPBITS(1);

				// read in block type
				NEEDBITS(2);
				method = GETBITS(2);
				DUMPBITS(2);
				tl = null;
				copy_leng = 0;
			}

			switch (method) {
			case STORED_BLOCK:
				i = inflate_stored(buff, off + n, size - n);
				break;

			case STATIC_TREES:
				if (tl) {
					i = inflate_codes(buff, off + n, size - n);
				} else {
					i = inflate_fixed(buff, off + n, size - n);
				}
				break;

			case DYN_TREES:
				if (tl) {
					i = inflate_codes(buff, off + n, size - n);
				} else {
					i = inflate_dynamic(buff, off + n, size - n);
				}
				break;

			default: // error
				i = -1;
				break;
			}

			if (i === -1) {
				if (eof) {
					return 0;
				}
				return -1;
			}
			n += i;
		}
		return n;
	}

	function inflate(arr) {
		var buff = [], i;

		inflate_start();
		inflate_data = arr;
		inflate_pos = 0;

		do {
			i = inflate_internal(buff, buff.length, 1024);
		} while (i > 0);
		inflate_data = null; // G.C.
		return buff;
	}

	return inflate
})();

		var unzip = (function () {
// magic numbers marking this file as GZIP
	var ID1 = 0x1F,
		ID2 = 0x8B,
		compressionMethods = {
			'deflate': 8
		},
		possibleFlags = {
			'FTEXT': 0x01,
			'FHCRC': 0x02,
			'FEXTRA': 0x04,
			'FNAME': 0x08,
			'FCOMMENT': 0x10
		},
		osMap = {
			'fat': 0, // FAT file system (DOS, OS/2, NT) + PKZIPW 2.50 VFAT, NTFS
			'amiga': 1, // Amiga
			'vmz': 2, // VMS (VAX or Alpha AXP)
			'unix': 3, // Unix
			'vm/cms': 4, // VM/CMS
			'atari': 5, // Atari
			'hpfs': 6, // HPFS file system (OS/2, NT 3.x)
			'macintosh': 7, // Macintosh
			'z-system': 8, // Z-System
			'cplm': 9, // CP/M
			'tops-20': 10, // TOPS-20
			'ntfs': 11, // NTFS file system (NT)
			'qdos': 12, // SMS/QDOS
			'acorn': 13, // Acorn RISC OS
			'vfat': 14, // VFAT file system (Win95, NT)
			'vms': 15, // MVS (code also taken for PRIMOS)
			'beos': 16, // BeOS (BeBox or PowerMac)
			'tandem': 17, // Tandem/NSK
			'theos': 18 // THEOS
		},
		os = 'unix',
		DEFAULT_LEVEL = 6;

	function putByte(n, arr) {
		arr.push(n & 0xFF);
	}

	// LSB first
	function putShort(n, arr) {
		arr.push(n & 0xFF);
		arr.push(n >>> 8);
	}

	// LSB first
	function putLong(n, arr) {
		putShort(n & 0xffff, arr);
		putShort(n >>> 16, arr);
	}

	function putString(s, arr) {
		var i, len = s.length;
		for (i = 0; i < len; i += 1) {
			putByte(s.charCodeAt(i), arr);
		}
	}

	function readByte(arr) {
		return arr.shift();
	}

	function readShort(arr) {
		return arr.shift() | (arr.shift() << 8);
	}

	function readLong(arr) {
		var n1 = readShort(arr),
			n2 = readShort(arr);

		// JavaScript can't handle bits in the position 32
		// we'll emulate this by removing the left-most bit (if it exists)
		// and add it back in via multiplication, which does work
		if (n2 > 32768) {
			n2 -= 32768;

			return ((n2 << 16) | n1) + 32768 * Math.pow(2, 16);
		}

		return (n2 << 16) | n1;
	}

	function readString(arr) {
		var charArr = [];

		// turn all bytes into chars until the terminating null
		while (arr[0] !== 0) {
			charArr.push(String.fromCharCode(arr.shift()));
		}

		// throw away terminating null
		arr.shift();

		// join all characters into a cohesive string
		return charArr.join('');
	}

	/*
	 * Reads n number of bytes and return as an array.
	 *
	 * @param arr- Array of bytes to read from
	 * @param n- Number of bytes to read
	 */
	function readBytes(arr, n) {
		var i, ret = [];
		for (i = 0; i < n; i += 1) {
			ret.push(arr.shift());
		}

		return ret;
	}

	function unzip(data, options) {
		// start with a copy of the array
		var arr = Array.prototype.slice.call(data, 0),
			t,
			compressionMethod,
			flags,
			mtime,
			xFlags,
			key,
			os,
			crc,
			size,
			res;

		// check the first two bytes for the magic numbers
		if (readByte(arr) !== ID1 || readByte(arr) !== ID2) {
			throw 'Not a GZIP file';
		}

		t = readByte(arr);
		t = Object.keys(compressionMethods).some(function (key) {
			compressionMethod = key;
			return compressionMethods[key] === t;
		});

		if (!t) {
			throw 'Unsupported compression method';
		}

		flags = readByte(arr);
		mtime = readLong(arr);
		xFlags = readByte(arr);
		t = readByte(arr);
		Object.keys(osMap).some(function (key) {
			if (osMap[key] === t) {
				os = key;
				return true;
			}
		});

		// just throw away the bytes for now
		if (flags & possibleFlags['FEXTRA']) {
			t = readShort(arr);
			readBytes(arr, t);
		}

		// just throw away for now
		if (flags & possibleFlags['FNAME']) {
			readString(arr);
		}

		// just throw away for now
		if (flags & possibleFlags['FCOMMENT']) {
			readString(arr);
		}

		// just throw away for now
		if (flags & possibleFlags['FHCRC']) {
			readShort(arr);
		}

		if (compressionMethod === 'deflate') {
			// give deflate everything but the last 8 bytes
			// the last 8 bytes are for the CRC32 checksum and filesize
			res = inflate(arr.splice(0, arr.length - 8));
		}

		if (flags & possibleFlags['FTEXT']) {
			res = Array.prototype.map.call(res, function (byte) {
				return String.fromCharCode(byte);
			}).join('');
		}

		crc = readLong(arr);
		if (crc !== parseInt(crc32(res), 16)) {
			throw 'Checksum does not match';
		}

		size = readLong(arr);
		if (size !== res.length) {
			throw 'Size of decompressed file not correct';
		}

		return res;
	}

	return unzip
})()
		// lang ='eng'
		return (function loadLanguage(lang, cb){ // NodeJS style callback
			if(loaded_langs.indexOf(lang) != -1){
				cb(null, lang)		
			}
			else{
				Module.FS_createPath("/","tessdata",true,true)
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/'+lang+'.traineddata.gz', true);
				xhr.responseType = 'arraybuffer';
				xhr.onerror = function(){ cb(xhr, null) }
				xhr.onprogress = function(e){console.log('loading',lang,'language model:',Math.round(e.loaded/filesizes[lang]*100)+'%')}
				xhr.onload = function(){
					if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
						console.log('unzipping language model...')
						var data = new Uint8Array(unzip(new Uint8Array(xhr.response)))
						console.log(lang +".traineddata", 'sucessfully unzipped')
						Module.FS_createDataFile('tessdata', lang +".traineddata", data, true, false);
						loaded_langs.push(lang)
						cb(null, lang)
					} else cb(xhr, null);
				}
				xhr.send(null)
			}
		})
	})()

	function DumpLiterallyEverything(){
			var ri = base.GetIterator();
			var blocks = [];
			var block, para, textline, word, symbol;

			function enumToString(value, prefix){
				return (Object.keys(Module)
					.filter(function(e){ return e.startsWith(prefix + '_') })
					.filter(function(e){ return Module[e] === value })
					.map(function(e){ return e.slice(prefix.length + 1) })[0])
			}

			do {
				if(ri.IsAtBeginningOf(Module.RIL_BLOCK)){
					var poly = ri.BlockPolygon();
					var polygon = null;
					// BlockPolygon() returns null when automatic page segmentation is off
					if(Module.getPointer(poly) > 0){
						var n = poly.get_n(),
							px = poly.get_x(),
							py = poly.get_y(),
							polygon = [];
						for(var i = 0; i < n; i++){
							polygon.push([px.getValue(i), py.getValue(i)]);
						}
						Module._ptaDestroy(Module.getPointer(poly));	
					}
					
					block = {
						paragraphs: [],

						text: ri.GetUTF8Text(Module.RIL_BLOCK),
						confidence: ri.Confidence(Module.RIL_BLOCK),
						baseline: ri.getBaseline(Module.RIL_BLOCK),
						bbox: ri.getBoundingBox(Module.RIL_BLOCK),

						blocktype: enumToString(ri.BlockType(), 'PT'),
						polygon: polygon
					}
					blocks.push(block)
				}
				if(ri.IsAtBeginningOf(Module.RIL_PARA)){
					para = {
						lines: [],

						text: ri.GetUTF8Text(Module.RIL_PARA),
						confidence: ri.Confidence(Module.RIL_PARA),
						baseline: ri.getBaseline(Module.RIL_PARA),
						bbox: ri.getBoundingBox(Module.RIL_PARA),

						is_ltr: !!ri.ParagraphIsLtr()
					}
					block.paragraphs.push(para)
				}
				if(ri.IsAtBeginningOf(Module.RIL_TEXTLINE)){
					textline = {
						words: [],

						text: ri.GetUTF8Text(Module.RIL_TEXTLINE),
						confidence: ri.Confidence(Module.RIL_TEXTLINE),
						baseline: ri.getBaseline(Module.RIL_TEXTLINE),
						bbox: ri.getBoundingBox(Module.RIL_TEXTLINE)
					}
					para.lines.push(textline)
				}
				if(ri.IsAtBeginningOf(Module.RIL_WORD)){
					var fontInfo = ri.getWordFontAttributes(),
						wordDir = ri.WordDirection();
					word = {
						symbols: [],
						choices: [],

						text: ri.GetUTF8Text(Module.RIL_WORD),
						confidence: ri.Confidence(Module.RIL_WORD),
						baseline: ri.getBaseline(Module.RIL_WORD),
						bbox: ri.getBoundingBox(Module.RIL_WORD),

						is_numeric: !!ri.WordIsNumeric(),
						in_dictionary: !!ri.WordIsFromDictionary(),
						direction: enumToString(wordDir, 'DIR'),
						language: ri.WordRecognitionLanguage(),

						is_bold: fontInfo.is_bold,
						is_italic: fontInfo.is_italic,
						is_underlined: fontInfo.is_underlined,
						is_monospace: fontInfo.is_monospace,
						is_serif: fontInfo.is_serif,
						is_smallcaps: fontInfo.is_smallcaps,
						font_size: fontInfo.pointsize,
						font_id: fontInfo.font_id,
						font_name: fontInfo.font_name,
					}
					var wc = new Module.WordChoiceIterator(ri);
					do {
						word.choices.push({
							text: wc.GetUTF8Text(),
							confidence: wc.Confidence()
						})
					} while (wc.Next());
					Module.destroy(wc)
					textline.words.push(word)
				}
				
				var image = null;
				// var pix = ri.GetBinaryImage(Module.RIL_SYMBOL)
				// var image = pix2array(pix);
				// // for some reason it seems that things stop working if you destroy pics
				// Module._pixDestroy(Module.getPointer(pix));

				symbol = {
					choices: [],
					image: image,

					text: ri.GetUTF8Text(Module.RIL_SYMBOL),
					confidence: ri.Confidence(Module.RIL_SYMBOL),
					baseline: ri.getBaseline(Module.RIL_SYMBOL),
					bbox: ri.getBoundingBox(Module.RIL_SYMBOL),

					is_superscript: !!ri.SymbolIsSuperscript(),
					is_subscript: !!ri.SymbolIsSubscript(),
					is_dropcap: !!ri.SymbolIsDropcap(),
				}
				word.symbols.push(symbol)
				var ci = new Module.ChoiceIterator(ri);
				do {
					symbol.choices.push({
						text: ci.GetUTF8Text(),
						confidence: ci.Confidence()
					})
				} while (ci.Next());
				Module.destroy(ci)
			} while (ri.Next(Module.RIL_SYMBOL));
			Module.destroy(ri)

			return {
				text: base.GetUTF8Text(),
				html: base.GetHOCRText(),

				confidence: base.MeanTextConf(),

				blocks: blocks,

				psm: enumToString(base.GetPageSegMode(), 'PSM'),
				oem: enumToString(base.oem(), 'OEM'),
				version: base.Version(),
			}
	}

	function recognize(image, lang, options,cb){
		var width, height;
		if(image.data){
			var src       = image.data;
			width     	  = image.width, height = image.height;
			var dst       = new Uint8Array(width * height);
			var srcLength = src.length | 0, srcLength_16 = (srcLength - 16) | 0;

			var coeff_r = 4899, coeff_g = 9617, coeff_b = 1868;

			for (var i = 0, j = 0; i <= srcLength_16; i += 16, j += 4) {
				// convert to grayscale 4 pixels at a time;
				// add 8192 = 1<<13 so for int n, float k >= .5,  ((n + k)*(1<<14) >> 14) = 1 + ((n)*(1<<14) >> 14)
				dst[j]     = src[i+3] //(((src[i] * coeff_r + src[i+1] * coeff_g + src[i+2] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
				dst[j + 1] = src[i+4+3]//(((src[i+4] * coeff_r + src[i+5] * coeff_g + src[i+6] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
				dst[j + 2] = src[i+8+3]//(((src[i+8] * coeff_r + src[i+9] * coeff_g + src[i+10] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
				dst[j + 3] = src[i+12+3]//(((src[i+12] * coeff_r + src[i+13] * coeff_g + src[i+14] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
			}
			for (; i < srcLength; i += 4, ++j) //finish up
				dst[j] = (src[i] * coeff_r + src[i+1] * coeff_g + src[i+2] * coeff_b + 8192) >> 14;
			
			image = dst;
			// for(var i = 0; i < image.length; i++) image[i] = image[i] > 128;
		}
		else {
			throw 'Expected ImageData'
		}
		var ptr = Module.allocate(image, 'i8', Module.ALLOC_NORMAL);
		
		loadLanguage(lang, function(err, result){
			if(err){
				console.error("error loading", lang);
				cb(err, null)
			}
			base.Init(null, lang)
			for (var option in options) {
			    if (options.hasOwnProperty(option)) {
			        base.SetVariable(option, options[option]);
			        console.log('setting', option, '=', options[option]);
			    }
			}


			base.SetImage(Module.wrapPointer(ptr), width, height, 1, width)
			base.SetRectangle(0, 0, width, height)
			base.GetUTF8Text()
			var everything = DumpLiterallyEverything()
			base.End();
			Module._free(ptr); 
			cb(null, everything)
		})
	}

	// base._simple = _simple
	return recognize
})()

onmessage = function(e) {

	recognize(e.data.image, e.data.lang, e.data.options, function(err, result){
		postMessage({err:err, result: result})	
	})
}