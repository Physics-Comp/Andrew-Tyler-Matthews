// Content sourced from Andrew's resume (Skywell version, 2026).

export interface Education {
	school: string;
	shortName: string;
	location: string;
	degree: string;
	field: string;
	description: string;
}

export interface Role {
	title: string;
	company: string;
	location?: string;
	dates: string;
	highlights: string[];
}

export interface RoleGroup {
	heading: string;
	roles: Role[];
}

export interface Skill {
	name: string;
	/** Years of hands-on experience */
	years: number;
}

export interface SkillCategory {
	name: string;
	/** Short label for tight spaces such as the radial chart's sector arcs */
	short: string;
	skills: Skill[];
}

/** First year counted in "N+ years of experience"; the 2026 resume says 9+. */
export const careerStartYear = 2017;

export const profile =
	'Lead software engineer with 9+ years of experience designing and delivering full-stack applications, APIs, automation systems, and data-intensive products. Leads technical initiatives, mentors engineers, and combines systems architecture, applied AI, and UI/UX principles to turn complex data and workflows into intuitive user experiences. Experience spans financial services, intellectual property, healthcare, energy, and education.';

export const education: Education[] = [
	{
		school: 'University of Colorado Boulder',
		shortName: 'CU Boulder',
		location: 'Boulder, CO',
		degree: 'B.A.',
		field: 'Applied Physics',
		description:
			'Focused on mathematical computation and programming: applying theoretical concepts to practical problems across a range of fields.'
	}
];

export const roleGroups: RoleGroup[] = [
	{
		heading: 'Professional experience',
		roles: [
			{
				title: 'Lead Engineer',
				company: 'American Century Investments',
				location: 'Kansas City, MO',
				dates: 'June 2023 – Present',
				highlights: [
					'Lead system and application architecture, partnering with stakeholders to translate business initiatives into scalable technical implementations while mentoring engineers through design and development.',
					'Lead an enterprise AI enablement initiative integrating AI throughout the software development lifecycle, including the design and implementation of internal AI-powered tooling.',
					'Strengthened customer portal security and reduced initial response time by 90%, from 7 seconds to 0.7 seconds.',
					'Developed a customer segmentation and analytics application that enables stakeholders to identify and better understand customer segments.',
					'Built reusable development tooling adopted across the organization to standardize engineering workflows and improve developer productivity.'
				]
			},
			{
				title: 'Senior Software Engineer',
				company: 'FSC Edge',
				location: 'Omaha, NE',
				dates: '2021 – 2023',
				highlights: [
					'Developed and deployed a deep-learning OCR pipeline to automate the extraction of patent information, using PySpark to support scalable data processing.',
					'Designed and deployed a REST API for the USPTO that improved patent search and validation workflows.',
					'Mentored junior and mid-level developers through code reviews and technical guidance, while leading training for operations and production teams.'
				]
			},
			{
				title: 'Software Engineer → Mid-Level Software Engineer',
				company: 'PhET Interactive Simulations',
				location: 'Boulder, CO',
				dates: '2019 – 2021',
				highlights: [
					'Developed physics-engine components for interactive simulations in quantum mechanics and electromagnetism, translating mathematical models into accurate, responsive software behavior.',
					'Modernized legacy Flash simulations using Java for backend functionality and JavaScript and HTML5 for the front end, improving maintainability and platform compatibility.',
					"Contributed to PhET's web and mobile platforms, enabling interactive simulations to be deployed consistently across devices."
				]
			}
		]
	},
	{
		heading: 'Entrepreneurial leadership',
		roles: [
			{
				title: 'Owner and Chief Technology Officer',
				company: 'Hartland Harvest',
				dates: '2025 – Present',
				highlights: [
					'Lead a team of four employees building digital infrastructure that connects growers, markets, buyers, and communities across local food systems.',
					"Own the platform's architecture and development, encompassing payments, communication, product discovery, inventory availability, and role-specific operational tools.",
					'Define product vision and technical direction through direct customer engagement, translating the needs of farmers, markets, grocers, and distributors into intuitive product experiences.',
					'Lead marketing, outreach, and customer relationships to guide adoption and ensure the platform addresses real operational challenges.'
				]
			}
		]
	},
	{
		heading: 'Selected consulting engagements',
		roles: [
			{
				title: 'Data Scientist Consultant',
				company: 'AES',
				dates: '2022 – 2023',
				highlights: [
					'Evaluated and redesigned the architecture of an R-based linear-optimization service used to manage regional battery operating cycles, then led its migration to Python.',
					'Designed and implemented a custom Python optimization library to reproduce required maximization capabilities that were unavailable in an equivalent Python package.',
					'Built a comprehensive test suite to validate functional parity and performance against the legacy R application, while improving the architecture so other applications could integrate with the library.',
					'Advised and trained engineering teams on Agile development practices, expanding the engagement beyond its original technical scope.'
				]
			},
			{
				title: 'Full-Stack Software Engineer Consultant',
				company: 'MMIT',
				dates: '2021 – 2022',
				highlights: [
					'Architected and developed a data-ingestion application that automatically collected, parsed, and aggregated health-plan documents from insurance-provider websites.',
					'Built a customer-facing dashboard that enabled hospitals and clinics to analyze aggregated plan data and determine insurance coverage for patient medications and treatments.',
					"Refined the dashboard's UI/UX through user-group feedback and A/B testing, using observed behavior to guide evidence-based interface improvements."
				]
			}
		]
	}
];

/** Every role across all groups, in display order. */
export const roles: Role[] = roleGroups.flatMap((group) => group.roles);

export const skillCategories: SkillCategory[] = [
	{
		name: 'Programming languages',
		short: 'Languages',
		skills: [
			{ name: 'Java', years: 12 },
			{ name: 'Python', years: 10 },
			{ name: 'C++', years: 8 },
			{ name: 'JavaScript', years: 7 },
			{ name: 'Go', years: 2 },
			{ name: 'Rust', years: 1 }
		]
	},
	{
		name: 'Web & UI frameworks',
		short: 'Web & UI',
		skills: [
			{ name: 'React / React Native', years: 8 },
			{ name: 'Svelte', years: 4 },
			{ name: 'Astro', years: 2 },
			{ name: 'Angular', years: 1 }
		]
	},
	{
		name: 'Backend frameworks',
		short: 'Backend',
		skills: [
			{ name: 'Spring Boot', years: 8 },
			{ name: 'Express', years: 6 },
			{ name: 'Django', years: 6 },
			{ name: 'FastAPI', years: 6 },
			{ name: 'Hono', years: 2 }
		]
	},
	{
		name: 'ML & accelerated computing',
		short: 'ML & GPU',
		skills: [
			{ name: 'Keras', years: 4 },
			{ name: 'TensorFlow', years: 4 },
			{ name: 'CUDA', years: 3 }
		]
	},
	{
		name: 'Cloud platforms',
		short: 'Cloud',
		skills: [
			{ name: 'AWS', years: 8 },
			{ name: 'Cloudflare', years: 4 },
			{ name: 'GCP', years: 2 },
			{ name: 'Azure', years: 1 }
		]
	},
	{
		name: 'Engineering platforms & DevOps',
		short: 'DevOps',
		skills: [
			{ name: 'Git', years: 10 },
			{ name: 'Docker', years: 8 },
			{ name: 'Bash scripting', years: 8 },
			{ name: 'GitHub Actions', years: 4 },
			{ name: 'OpenShift', years: 3 },
			{ name: 'Terraform', years: 2 },
			{ name: 'Jenkins', years: 2 }
		]
	},
	{
		name: 'Observability',
		short: 'Monitoring',
		skills: [
			{ name: 'Grafana', years: 5 },
			{ name: 'DataDog', years: 3 },
			{ name: 'OpenSearch Kibana', years: 2 }
		]
	},
	{
		name: 'Databases',
		short: 'Databases',
		skills: [
			{ name: 'PostgreSQL', years: 8 },
			{ name: 'MongoDB', years: 6 },
			{ name: 'SQLite', years: 5 },
			{ name: 'Couchbase', years: 4 },
			{ name: 'IBM Db2', years: 3 }
		]
	},
	{
		name: 'Design & prototyping',
		short: 'Design',
		skills: [
			{ name: 'Figma', years: 5 },
			{ name: 'Penpot', years: 3 },
			{ name: 'Photoshop', years: 3 }
		]
	}
];

/** Every skill across all categories. */
export const skills: Skill[] = skillCategories.flatMap((category) => category.skills);

/** Longest tenure with any tool. */
export const maxSkillYears = Math.max(...skills.map((skill) => skill.years));
