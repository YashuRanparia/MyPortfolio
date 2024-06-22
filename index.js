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
    // const refer = document.createElement("a")
    // refer.href = "https://drive.google.com/file/d/1Y1V3L-T6o74YJMGWEjk2eBOqhvBglHF4/view?usp=sharing"
    // refer.target = "_blank"
    // refer.click()

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

const projects = document.createElement("div")
projects.classList.add(["project-cards"])

// const anim = document.createElement("div")
// anim.classList.add(["orange-strip"])
// projects.appendChild(anim)




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
footer.style.border = "0.5px solid #7e8c9c"
footer.style.width = "100%"
// footer.style.height = "30vh"
footer.style.margin = "4rem 0px 0px 0px"
// footer.appendChild(footer)

function createSocialLink(href, iconClass) {
    const link = document.createElement("a");
    link.href = href;
    // link.style.fontSize = "1.5rem"

    const icon = document.createElement("span");
    iconClass.forEach(element => {
        icon.classList.add(element)
    });

    link.appendChild(icon);

    return link;
}

const linkedinLink = createSocialLink("https://www.linkedin.com/in/yashu-ranparia-5487a8229", ["bi", "bi-linkedin", "link-icons"]);
const githubLink = createSocialLink("https://github.com/YashuRanparia", ["bi", "bi-github", "link-icons"]);
const twitterLink = createSocialLink("https://twitter.com/R__Yashu?t=ZLoD9O2oIiiG4wGB0MIJYw&s=09", ["bi", "bi-twitter", "link-icons"]);

const links = document.createElement("div")
links.style.width = "100%"
// links.style.height = "30%"
links.style.alignItems = "center"
links.style.display = "flex"
links.style.justifyContent = "center"
links.style.flexDirection = "row"
links.style.flex = "1"
links.style.margin = "3rem 0px"

links.appendChild(linkedinLink)
links.appendChild(githubLink)
links.appendChild(twitterLink)


const madeby = document.createElement("p")
madeby.style.textAlign = "center"
madeby.style.width = "100%"
madeby.style.color = "#7e8c9c"
madeby.style.fontSize = "18px"
madeby.style.letterSpacing = "1px"
madeby.textContent = "Created by - Yashu Ranparia"
madeby.style.verticalAlign = "baseline"


const contact_heading = document.createElement("p")
contact_heading.style.width = "100%"
contact_heading.style.color = "#7e8c9c"
contact_heading.style.fontSize = "30px"
contact_heading.style.margin = "10px"
contact_heading.style.fontWeight = "bold"
contact_heading.style.textAlign = "center"
contact_heading.textContent = "Contact"

const contact_detail = document.createElement("div")
contact_detail.style.width = "100%"
contact_detail.style.color = "#7e8c9c"
contact_detail.style.justifyContent = "center"
contact_detail.style.display = "flex"
contact_detail.style.flexWrap = "wrap"
contact_detail.style.flexDirection = "row"
contact_detail.style.flex = "1"

const email = document.createElement("div")
email.style.color = "#7e8c9c"
email.style.display = "flex"
email.style.justifyContent = "center"
email.style.alignItems = "center"
email.style.margin = "10px"
email.style.width = "100%"

const email_text = document.createElement("p")
email_text.textContent = "yashuranparia136@gmail.com"
email_text.style.fontSize = "20px"
email_text.style.padding = "0px 10px"
email_text.style.margin = "0px"
email_text.style.textAlign = "center"

const email_icon = createSocialLink("", ["bi", "bi-envelope"])
email_icon.style.width = "40px"
email_icon.style.display = "flex"
email_icon.style.justifyContent = "center"
email_icon.style.alignItems = "center"
email_icon.children[0].style.fontSize = "23px"
email_icon.children[0].style.margin = "0"
email_icon.children[0].style.color = "#7e8c9c"
email_icon.style.cursor = "auto"
// email_icon.children[0].style.textAlign = "center"


const phone_text = email_text.cloneNode(true)
phone_text.textContent = "+91-942-6573-656"

const phone_icon = createSocialLink("", ["bi", "bi-telephone"])
phone_icon.style.width = "40px"
phone_icon.style.display = "flex"
phone_icon.style.justifyContent = "center"
phone_icon.style.alignItems = "center"
phone_icon.children[0].style.fontSize = "23px"
phone_icon.children[0].style.margin = "0"
phone_icon.children[0].style.color = "#7e8c9c"
phone_icon.style.cursor = "auto"
// phone_icon.children[0].style.textAlign = "center"


const phone = email.cloneNode(true)

email.appendChild(email_icon)
email.appendChild(email_text)

phone.appendChild(phone_icon)
phone.appendChild(phone_text)

contact_detail.appendChild(email)
contact_detail.appendChild(phone)

footer.appendChild(contact_heading)
footer.appendChild(contact_detail)
footer.appendChild(links)
footer.appendChild(madeby)



const sections = document.querySelectorAll("section");

const options = {
    threshold: 0.3, // Trigger animation when 40% of the section is visible
};

// Function to add animation class to a section
function animateSectionStart(section) {
    section.classList.add("rise-up"); // Replace "fade-in" with your desired animation class
}

function animateSectionEnd(section) {
    setTimeout(() => {
        section.classList.add("in-view");
    }, 100);
}

// Loop through sections and add event listeners
sections.forEach((section) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            animateSectionStart(section);
            // observer.unobserve(section);
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                animateSectionEnd(section);
                observer.unobserve(section); // Unobserve after animation
            }
        });
    }, options);
    observer.observe(section); // Observe each section for visibility
});
