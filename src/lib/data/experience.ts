export interface Education {
	school: string;
	dates: string;
	description: string;
}

export interface Job {
	title: string;
	company: string;
	dates: string;
	description: string;
}

export interface Skill {
	name: string;
	/** Proficiency out of 5 */
	rating: number;
}

export const education: Education[] = [
	{
		school: 'University of Colorado at Boulder',
		dates: 'Aug. 2016 - 2019',
		description:
			'I have obtained a major in applied physics complemented with a minor in applied mathematics, focusing on mathematical computation and programming. Through my education, I have acquired a high level of proficiency in utilizing theoretical mathematical concepts to solve practical problems across a range of fields.'
	}
];

export const jobs: Job[] = [
	{
		title: 'Software Engineer',
		company: 'FSC Edge',
		dates: 'Apr. 2022 - Present',
		description:
			'I have developed deep learning tools to automate the extraction of patent information. Additionally, I have designed and developed full-stack applications, implementing feature enhancements to optimize user experience. Moreover, I have developed a robust REST API for the USPTO to improve patent search and validation processes.'
	},
	{
		title: 'Lead Software Engineer',
		company: 'Lex Fridman Podcast',
		dates: 'Feb. 2022 - Jan. 2023',
		description:
			'Created moderation bots for social media platforms to help streamline content moderation. Developed plugins to improve video editing workflow in Adobe Premiere. Directed and implemented automation tasks for the podcast to help the team be more productive.'
	},
	{
		title: 'Software Engineer',
		company: 'PhET Simulations',
		dates: 'May. 2020 - Apr. 2022',
		description:
			'I improved the user interface of the PhET mobile and web platforms, created admin tools and dashboards, and developed physics simulations in quantum mechanics and electromagnetism.'
	},
	{
		title: 'Freelance Software Developer',
		company: 'Boulder Colorado',
		dates: 'Aug. 2015 - Present',
		description:
			'As a developer, I specialize in creating tailored solutions for businesses. This includes custom web pages for small to medium-sized businesses, mobile apps for Android and iOS, and custom desktop applications to meet diverse business needs. In addition to my development work, I offer consultation services in product architecture and design.'
	}
];

/** Two columns of skills, matching the original layout. */
export const skillColumns: Skill[][] = [
	[
		{ name: 'Python', rating: 5 },
		{ name: 'Java', rating: 5 },
		{ name: 'C++', rating: 4 },
		{ name: 'JavaScript', rating: 4 },
		{ name: 'React.js', rating: 5 },
		{ name: 'React Native', rating: 4 },
		{ name: 'Node.js', rating: 4 },
		{ name: 'Express.js', rating: 4 },
		{ name: 'MatLab', rating: 4 }
	],
	[
		{ name: 'R', rating: 5 },
		{ name: 'Tableau', rating: 4 },
		{ name: 'SQL', rating: 4 },
		{ name: 'NoSQL', rating: 4 },
		{ name: 'Django', rating: 4 },
		{ name: 'Flask', rating: 4 },
		{ name: 'MongoDB', rating: 4 },
		{ name: 'Jenkins', rating: 3 },
		{ name: 'Docker', rating: 2 }
	]
];
