//resume downloading

const button = document.createElement("button")
button.classList.add(["resume-button"])
button.textContent = "Resume"

button.addEventListener('mouseover', () => {

});

button.addEventListener('mouseout', () => {
    //
});

const resumeUrl = "https://yashuranparia.000webhostapp.com/assests/resume/YashuRanparia.pdf";

button.addEventListener("click", function () {

    const downloadLink = document.createElement("a");
    downloadLink.href = resumeUrl;
    downloadLink.target = "_blank";
    downloadLink.click();
});

const welcome_sec = document.getElementById("welcome")
welcome_sec.appendChild(button)

//-------------------------------------------------About Me section-------------------------------------------------------

const about_me = document.createElement("p")

my_intro = `My name is Yashu Ranparia. Currently I am pursuing my B.Tech degree in Computer Science and Engineering from Charotar University of Science and Technology (CHARUSAT - change). I have gained good skills in Machine Learning and Deep Learning applications. I am interested to explore these technologies along with Artificial Intelligence in upcoming oppertunities. My hobbies include playing cricket and competitive programming.`

about_me.textContent = my_intro

const profile_info = document.getElementById("my_intro")
profile_info.appendChild(about_me)


//-------------------------------------------------Education Section-------------------------------------------------------
const education = document.getElementById("education")

const edus = document.createElement("div")
edus.classList.add(["education-container"])

const education_data = {
    "hse": {
        "name": "Higher Secondary Education",
        "school": "Utkarsh School of Excellence - (2019-2021)",
        "location": "Rajkot, Gujarat",
        "score": `Score - 89.9%`
    },
    "degree": {
        "name": "B. Tech in Computer Science and Engineering",
        "school": "Charotar University of Science and Technology",
        "location": "Changa, Anand, Gujarat",
        "score": "CGPA - 9.54"
    }
}

for (var key in education_data) {
    const study_card = document.createElement("div")
    study_card.classList.add(["study-card"])

    const study_name = document.createElement("p")
    study_name.classList.add(["study-name"])
    study_name.textContent = education_data[key]["name"]

    const study_school = document.createElement("p")
    study_school.classList.add(["study-school"])
    study_school.textContent = education_data[key]["school"]

    const study_score = document.createElement("p")
    study_score.classList.add(["study-score"])
    study_score.textContent = education_data[key]["score"]

    study_card.appendChild(study_name)
    study_card.appendChild(study_school)
    study_card.appendChild(study_score)

    edus.appendChild(study_card)
}

education.children[0].appendChild(edus)


//-------------------------------------------------Experience Section-------------------------------------------------------

const experience = document.getElementById("experience")

const exp = document.createElement("div")
exp.classList.add(["experience-container"])

const experience_data = {
    "internship_1": {
        "company": "Internauts Infotech LLP",
        "role": "Flutter Developer Intern",
        "duration": "May 2023 - June 2023"
    },
    "internship_2": {
        "company": "Celebal Technology",
        "role": "Data Science Intern",
        "duration": "Current"
    }
}

for (const key in experience_data) {
    const job_card = document.createElement("div")
    job_card.classList.add(["job-card"])

    const role = document.createElement("p")
    role.classList.add(["job-role"])
    role.textContent = experience_data[key]["role"]

    const company_name = document.createElement("p")
    company_name.classList.add(["company-name"])
    company_name.textContent = experience_data[key]["company"]

    const duration = document.createElement("p")
    duration.classList.add(["job-duration"])
    duration.textContent = experience_data[key]["duration"]

    job_card.appendChild(role)
    job_card.appendChild(company_name)
    job_card.appendChild(duration)

    exp.appendChild(job_card)
}

experience.children[0].appendChild(exp)



//------------------------------------------------- Project Section -------------------------------------------------------
const skills_sec = document.getElementById("skills")

const skill_container = document.createElement("div")
skill_container.classList.add(["skill-container"])

technologies = {
    "python": "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
    "r": "https://icon.icepanel.io/Technology/svg/R-.svg",
    "cpp": "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg",
    "javascript": "https://icon.icepanel.io/Technology/svg/JavaScript.svg",
    "scikit-learn": "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
    "pandas": "https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/pandas/pandas-original.svg",
    "matplotlib": "https://icon.icepanel.io/Technology/svg/Matplotlib.svg",
    "seaborn": "https://seaborn.pydata.org/_images/logo-mark-lightbg.svg",
    "opencv": "https://www.vectorlogo.zone/logos/opencv/opencv-icon.svg",

    "keras": "https://icon.icepanel.io/Technology/svg/Keras.svg",
    "tensorflow": "https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg",
    "git": "https://icon.icepanel.io/Technology/svg/Git.svg",
    // "flask": "https://www.vectorlogo.zone/logos/pocoo_flask/pocoo_flask-icon.svg",
    "flutter": "https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg",
    // "kotlin": "https://www.vectorlogo.zone/logos/kotlinlang/kotlinlang-icon.svg",
    
}


for (const key in technologies) {
    const tech_logo_card = document.createElement("div")
    tech_logo_card.classList.add(["tech-logo-card"])

    const tech_logo = document.createElement("img")
    tech_logo.classList.add(["tech-logo"])
    tech_logo.src = technologies[key]

    if(key == "flask"){
        tech_logo.style.color = "white"
    }

    // tech_logo_card.appendChild(tech_logo)

    skill_container.appendChild(tech_logo)
}

skills_sec.children[0].appendChild(skill_container)



//------------------------------------------------- Project Section -------------------------------------------------------

const projects = document.createElement("div")
projects.classList.add(["project-cards"])



project_dict = [
    { "name": "Customer Segmentation - Clustering", "link": "https://github.com/YashuRanparia/customer_segmentation" },
    { "name": "Customer Churn Prediction", "link": "https://github.com/YashuRanparia/customer_churn_prediction" },
    { "name": "A Smart Presentation Controller using Hand Gesture Recognition", "link": "https://github.com/YashuRanparia/SGP4" },
    { "name": "Real Time Object Detection for Visually Impaired Person", "link": "https://github.com/YashuRanparia/SGP3" },
    // "Surat Transit - Mobile Application",
    // "Easy Read - Web Extension",
    // "Comming soon",
    // "Comming soon"
]

function project_map(project_dicto) {
    project_dicto.forEach(p => {
        const project_card = document.createElement("div")
        project_card.classList.add(["cards"])

        const project_name = document.createElement("p")
        project_name.style.fontSize = "20px"
        project_name.style.color = "white"
        project_name.style.textAlign = "center"

        project_name.textContent = p["name"]
        project_card.appendChild(project_name)

        const project_link = document.createElement("a")
        project_link.href = p["link"]
        project_link.textContent = "Github Link"
        project_link.textAlign = "center"
        project_link.style.textDecoration = "none"
        project_link.style.color = "#ADD8E6"
        project_link.style.fontSize = "20px"
        project_link.style.display = "none"

        project_card.appendChild(project_link)

        projects.appendChild(project_card)


        project_card.addEventListener('mouseover', () => {
            project_card.children[0].style.display = "none"
            project_card.children[1].style.display = "block"
            project_card.children[1].href = p["link"]
        });

        project_card.addEventListener('mouseout', () => {
            project_card.children[0].style.display = "block"
            project_card.children[1].style.display = "none"
            project_card.children[1].href = ""
        });
    });
}

project_map(project_dict)

const project_sec = document.getElementById("projects")
project_sec.appendChild(projects)


//------------------------------------------------- Contact Section -------------------------------------------------------
// const contact = document.getElementById("contact")

// const left = document.createElement("div")
// left.style.width = "50%"
// const right = document.createElement("div")




//------------------------------------------------- Footer -------------------------------------------------------

const footer = document.getElementById("footer")
footer.classList.add(["footer"])

const links = document.createElement("div")
links.classList.add(["media-links"])

media_links_dict = {
    "linkedin":{"link":"https://www.linkedin.com/in/yashu-ranparia-5487a8229","icon_class":["bi", "bi-linkedin", "link-icons"]},
    "github":{"link":"https://github.com/YashuRanparia","icon_class":["bi", "bi-github", "link-icons"]},
    "twitter":{"link":"https://twitter.com/R__Yashu?t=ZLoD9O2oIiiG4wGB0MIJYw&s=09","icon_class":["bi", "bi-twitter", "link-icons"]},
}

for (const key in media_links_dict) {
    const link = document.createElement("a");
    link.classList.add(["contact-icon-link"])
    link.href = media_links_dict[key]["link"];

    const icon = document.createElement("span");
    media_links_dict[key]["icon_class"].forEach(element => {
        icon.classList.add(element)
    });

    link.appendChild(icon);

    links.appendChild(link)
}


const madeby = document.createElement("p")
madeby.classList.add(["made-by-me"])
madeby.textContent = "Created by - Yashu Ranparia"

const contact_heading = document.createElement("p")
contact_heading.classList.add(["contact-heading"])
contact_heading.textContent = "Contact"

const contact_detail = document.createElement("div")
contact_detail.classList.add(["contact-detail"])

contact_dict = {
    "email": {"text": "yashuranparia136@gmail.com", "icon_class": ["bi", "bi-envelope"]},
    "phone_number": {"text": "+91-942-6573-656", "icon_class": ["bi", "bi-telephone"]}
}

for (const key in contact_dict) {
    const contact_card = document.createElement("div")
    contact_card.classList.add(["contact-card"])

    const contact_text = document.createElement("p")
    contact_text.classList.add(['contact-text'])
    contact_text.textContent = contact_dict[key]["text"]

    const contact_icon = document.createElement("i");
    contact_icon.classList.add(["contact-icon"])
    contact_dict[key]["icon_class"].forEach(element => {
        contact_icon.classList.add(element)
    });

    contact_card.appendChild(contact_icon)
    contact_card.appendChild(contact_text)

    contact_detail.appendChild(contact_card)
}


footer.appendChild(contact_heading)
footer.appendChild(contact_detail)
footer.appendChild(links)
footer.appendChild(madeby)



const sections = document.querySelectorAll("section");

const options = {
    threshold: 0.3,
};


function animateSectionStart(section) {
    section.classList.add("rise-up");
}

function animateSectionEnd(section) {
    setTimeout(() => {
        section.classList.add("in-view");
    }, 100);
}


sections.forEach((section) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            animateSectionStart(section);
            // observer.unobserve(section);
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                animateSectionEnd(section);
                observer.unobserve(section);
            }
        });
    }, options);
    observer.observe(section);
});
