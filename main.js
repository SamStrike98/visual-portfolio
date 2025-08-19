

const navMenu = document.querySelectorAll('.nav-menu')
const projectSection = document.querySelector('.project-section')

const menuItems = [
    {
        title: "Home",
        link: "/"
    },
    {
        title: "Projects",
        link: "projects/"
    }
]

menuItems.forEach(item => {
    const a = document.createElement("a");
    a.setAttribute("href", `${item.link}`);
    a.textContent = item.title;
    navMenu.forEach(menu => {
        menu.appendChild(a);
    });
})



const projects = [
    {
        title: "Starter Project",
        description: "Starter project description.",
        link: "starter/"
    },
    {
        title: "Three Spinning Cubes",
        description: "Three spinning cubes description.",
        link: "three_cubes/"
    },
];

projects.forEach(project => {
    const title = document.createElement("h2")
    title.textContent = project.title;
    const description = document.createElement("p");
    description.textContent = project.description;
    const link = document.createElement("a");
    link.textContent = "View"
    link.setAttribute("class", "btn");
    link.setAttribute("href", `/projects/${project.link}`)
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(link);


    projectSection.appendChild(card);
});