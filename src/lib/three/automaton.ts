/**
 * Elementary (one-dimensional, two-state, nearest-neighbour) cellular automata in the
 * Wolfram numbering: rule N's binary digits give the next state for each of the eight
 * neighbourhoods 111, 110, ..., 000.
 */

export interface RuleInfo {
	rule: number;
	/** Wolfram's informal classification / what to look for */
	note: string;
}

/** Rules that grow visible complexity from a single seed, in cycling order. */
export const RULES: RuleInfo[] = [
	{ rule: 30, note: 'class 3 · chaotic' },
	{ rule: 110, note: 'class 4 · Turing complete' },
	{ rule: 90, note: 'class 3 · Sierpiński' },
	{ rule: 73, note: 'class 4 · localized structures' },
	{ rule: 150, note: 'class 3 · additive' },
	{ rule: 54, note: 'class 4 · gliders' },
	{ rule: 126, note: 'class 3 · nested' },
	{ rule: 22, note: 'class 3 · nested chaos' }
];

export class ElementaryAutomaton {
	generation = 0;
	current: Uint8Array;
	private next: Uint8Array;

	constructor(
		public readonly width: number,
		public rule: number
	) {
		this.current = new Uint8Array(width);
		this.next = new Uint8Array(width);
		this.seed();
	}

	/** Reset to the classic initial condition: one live cell in the middle. */
	seed(): void {
		this.current.fill(0);
		this.current[this.width >> 1] = 1;
		this.generation = 0;
	}

	setRule(rule: number): void {
		this.rule = rule & 0xff;
		this.seed();
	}

	/** Advance one generation with periodic (wrap-around) edges. */
	step(): void {
		const { width, current, next, rule } = this;
		for (let i = 0; i < width; i++) {
			const l = current[(i - 1 + width) % width];
			const c = current[i];
			const r = current[(i + 1) % width];
			next[i] = (rule >> ((l << 2) | (c << 1) | r)) & 1;
		}
		this.current = next;
		this.next = current;
		this.generation++;
	}
}
