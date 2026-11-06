const internshipList = document.getElementById("internshipList");
const listStatus = document.getElementById("listStatus");
const retryButton = document.getElementById("retryButton");
const internshipSelect = document.getElementById("internship");
const applicationForm = document.getElementById("applicationForm");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");

document.getElementById("year").textContent = new Date().getFullYear();

function setStatus(element, message, type = "") {
  element.textContent = message;
  element.className = `status ${type}`.trim();
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderInternships(internships) {
  internshipList.replaceChildren();
  internshipSelect.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select an internship";
  internshipSelect.appendChild(placeholder);

  internships.forEach((internship) => {
    const option = document.createElement("option");
    option.value = String(internship.id);
    option.textContent = internship.title;
    internshipSelect.appendChild(option);

    const card = document.createElement("article");
    card.className = "internship-card";
    card.appendChild(createTextElement("h3", "", internship.title));
    card.appendChild(createTextElement("p", "company", internship.company));
    card.appendChild(createTextElement("p", "card-detail", `Location: ${internship.location}`));
    card.appendChild(createTextElement("p", "card-detail", `Mode: ${internship.mode}`));
    card.appendChild(createTextElement("p", "card-detail", `Stipend: ${internship.stipend}`));
    card.appendChild(createTextElement("p", "skills", `Skills: ${internship.skills}`));

    const applyButton = createTextElement("button", "apply-card-button", "Apply for this role");
    applyButton.type = "button";
    applyButton.addEventListener("click", () => {
      internshipSelect.value = String(internship.id);
      document.getElementById("apply").scrollIntoView({ behavior: "smooth" });
      internshipSelect.focus();
    });
    card.appendChild(applyButton);
    internshipList.appendChild(card);
  });
}

async function loadInternships() {
  retryButton.hidden = true;
  setStatus(listStatus, "Loading internships...");
  internshipList.replaceChildren();
  internshipSelect.innerHTML = '<option value="">Loading internships...</option>';

  try {
    const response = await fetch("/api/internships");
    if (!response.ok) throw new Error("The server could not load internships.");
    const internships = await response.json();

    if (!Array.isArray(internships) || internships.length === 0) {
      internshipSelect.innerHTML = '<option value="">No internships available</option>';
      setStatus(listStatus, "No internships are available right now.");
      return;
    }

    renderInternships(internships);
    setStatus(listStatus, `${internships.length} internship opportunities found.`);
  } catch (error) {
    internshipSelect.innerHTML = '<option value="">Unable to load internships</option>';
    setStatus(listStatus, "Unable to load internships. Check your connection and try again.", "error");
    retryButton.hidden = false;
  }
}

retryButton.addEventListener("click", loadInternships);

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(formStatus, "");

  if (!applicationForm.reportValidity()) return;

  const formData = new FormData(applicationForm);
  const payload = Object.fromEntries(formData.entries());

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Application could not be submitted.");

    setStatus(formStatus, result.message, "success");
    applicationForm.reset();
  } catch (error) {
    setStatus(formStatus, error.message || "Something went wrong. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit application";
  }
});

loadInternships();
