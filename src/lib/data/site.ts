export const site = {
	name: 'Andrew Matthews',
	firstName: 'Andrew',
	interests: ['Computation', 'Mathematics', 'Neuroscience', 'Physics'],
	description: 'Personal website of Andrew Matthews: software engineer, data scientist, creator.',
	contactEmail: 'andrew.matthews31@gmail.com',
	businessEmail: 'andrew.tyler.matthews.biz@gmail.com'
} as const;

export const navLinks = [
	{ href: '/experience', label: 'Experience' },
	{ href: '/#contact', label: 'Contact' }
] as const;

export const socialLinks = [
	{ href: 'https://www.linkedin.com/in/andrew-matthews-426511162/', label: 'LinkedIn' },
	{ href: 'https://github.com/Physics-Comp', label: 'GitHub' }
] as const;
