import { site } from './site';

export interface Project {
	title: string;
	description: string;
	image: string;
	alt: string;
	/** Optional fixed image height, for images whose aspect ratio differs from the rest of the row. */
	imageHeight?: number;
	action: { label: string; href: string };
}

export interface ProjectGroup {
	heading: string;
	projects: Project[];
}

const requestAccess = (project: string) => ({
	label: 'Request Access',
	href: `mailto:${site.businessEmail}?subject=${encodeURIComponent(`Request access: ${project}`)}`
});

export const projectGroups: ProjectGroup[] = [
	{
		heading: 'Physics',
		projects: [
			{
				title: 'Gas Kinematics',
				description:
					'Simulating molecule interactions confined in a finite volume over some period of time.',
				image: '/images/pbox.gif',
				alt: 'gas kinetics',
				action: {
					label: 'GitHub',
					href: 'https://github.com/Physics-Comp/Gas-Kinematic-Simulation'
				}
			},
			{
				title: 'Gravity Simulation',
				description: 'Simulating the motion of small objects around the solar system.',
				image: '/images/solar.jpg',
				alt: 'gravity project',
				action: { label: 'GitHub', href: 'https://github.com/Physics-Comp/Gravity-Simulation' }
			},
			{
				title: 'Atmospheric Collisions',
				description:
					'Using Monte Carlo simulations to model the behavior of high energy particles.',
				image: '/images/partcoll.gif',
				alt: 'atmosphere',
				action: { label: 'GitHub', href: 'https://github.com/Physics-Comp/Atmopheric-Collision' }
			}
		]
	},
	{
		heading: 'Mathematics',
		projects: [
			{
				title: 'Modeling Fish Populations',
				description:
					'Using numerical approximation methods to simulate the population of fish given varying conditions.',
				image: '/images/fish.png',
				alt: 'fish',
				action: { label: 'GitHub', href: 'https://github.com/Physics-Comp/Fish-Population' }
			},
			{
				title: 'Image Compression',
				description:
					'Using 1D and 2D Discrete Sine Transform (DST) to compress JPEG images and determine at what points does image compression cause severe degradation to image clarity.',
				image: '/images/compress2.svg',
				alt: 'image compression diagram',
				imageHeight: 202,
				action: {
					label: 'GitHub',
					href: 'https://github.com/Physics-Comp/Simple-Image-Compression'
				}
			}
		]
	},
	{
		heading: 'Personal Projects',
		projects: [
			{
				title: 'Health Tracker',
				description: 'Evaluating and tracking health metrics to maintaining a healthy lifestyle.',
				image: '/images/health3.png',
				alt: 'Health',
				action: requestAccess('Health Tracker')
			},
			{
				title: 'Finance Tracker',
				description:
					'Developing a financial dashboard to track, monitor and automate investments and finances.',
				image: '/images/assistant.png',
				alt: 'Finance',
				action: requestAccess('Finance Tracker')
			},
			{
				title: 'A.I Assistant',
				description:
					'A personal assistant application designed to manage my schedules and streamline planning.',
				image: '/images/robot_cartoon.jpeg',
				alt: 'A.I. assistant',
				action: requestAccess('A.I Assistant')
			}
		]
	}
];
