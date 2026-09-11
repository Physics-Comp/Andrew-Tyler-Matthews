import { careerStartYear } from './experience';

export interface Stat {
	value: string;
	label: string;
}

export const yearsActive = new Date().getFullYear() - careerStartYear;

const companyStartDate = new Date(2026, 0, 1);

/** "8 months" today; grows into "1 year, 2 months" etc. as time passes. */
function tenureSince(start: Date): string {
	const now = new Date();
	let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
	if (now.getDate() < start.getDate()) months -= 1;

	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;
	const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

	if (years === 0) return plural(remainingMonths, 'month');
	if (remainingMonths === 0) return plural(years, 'year');
	return `${plural(years, 'year')}, ${plural(remainingMonths, 'month')}`;
}

/** Derived from the experience data so the numbers never drift from the content. */
export const stats: Stat[] = [
	{ value: `${yearsActive}+`, label: 'Years turning ideas into things' },
	{ value: '10+', label: 'Years making music' },
	{ value: tenureSince(companyStartDate), label: 'Since I started my own company, Hartland Harvest' },
	{ value: '40+', label: 'Homemade recipes stockpiled for a cookbook, someday' }
];
