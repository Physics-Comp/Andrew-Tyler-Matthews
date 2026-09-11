export const site = {
	name: 'Andrew Matthews',
	firstName: 'Andrew',
	tagline: 'Software Engineer, Data Scientist, Creator',
	description: 'Personal website of Andrew Matthews: software engineer, data scientist, creator.',
	contactEmail: 'andrew.matthews31@gmail.com',
	businessEmail: 'andrew.tyler.matthews.biz@gmail.com',
	launchYear: 2023
} as const;

export const navLinks = [
	{ href: '/experience', label: 'Experience/Skills' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/services', label: 'Services' }
] as const;

export const socialLinks = [
	{ href: 'https://www.linkedin.com/in/andrew-matthews-426511162/', label: 'LinkedIn' },
	{ href: 'https://twitter.com/home', label: 'Twitter' },
	{ href: 'https://github.com/Physics-Comp', label: 'GitHub' }
] as const;
