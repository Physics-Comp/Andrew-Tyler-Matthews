import { site } from './site';

export interface Service {
	title: string;
	description: string;
	image: string;
	alt: string;
}

export const services: Service[] = [
	{
		title: 'Tutoring',
		description:
			'Offering customized tutoring sessions in physics, mathematics, and programming to high school and university students.',
		image: '/images/tut.jpg',
		alt: 'tutoring'
	},
	{
		title: 'Software Development',
		description:
			"Do you have an idea for a website, app, or standalone business software but don't know how to code or who to consult? Let me help!",
		image: '/images/code.jpg',
		alt: 'Software Development'
	},
	{
		title: 'Data Scientist',
		description:
			'Need to draw inferences from large datasets? Want to gain insights into particular markets as an investor, or improve S.E.O?',
		image: '/images/data.jpg',
		alt: 'atmosphere'
	}
];

export const servicesContact = `mailto:${site.businessEmail}`;
