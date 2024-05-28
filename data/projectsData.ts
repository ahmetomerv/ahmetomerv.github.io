interface Project {
  title: string,
  description: string,
  href?: string,
  imgSrc?: string,
}

const projectsData: Project[] = [
  {
    title: 'Spoticulum',
    description: 'Create your personalized Spotify collection snapshot',
    imgSrc: '/static/images/spoticulum.png',
    href: 'https://spoticulum.xyz/',
  },
]

export default projectsData
