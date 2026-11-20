// Run script once the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get page elements
  const supportModal = document.getElementById("supportModal");
  const supportCard = document.querySelector('[data-bs-target="#supportModal"]');
  const supportForm = document.getElementById("supportEmailForm");
  const closeButtons = supportModal ? supportModal.querySelectorAll('[data-bs-dismiss="modal"]') : [];

  // Open modal when card is clicked
  if (supportCard && supportModal) {
    supportCard.addEventListener("click", () => {
      supportModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  }

  // Hide modal and restore scrolling
  const closeModal = () => {
    if (!supportModal) return;
    supportModal.classList.remove("show");
    document.body.style.overflow = "";
  };

  // Close modal on cancel/X button click
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  // Close modal when clicking outside the box
  if (supportModal) {
    supportModal.addEventListener("click", (e) => {
      if (e.target === supportModal) closeModal();
    });
  }

  // Handle form submit
  if (supportForm) {
    supportForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form inputs
      const recipient = "hello@examplewebsite142.com";
      const name = document.getElementById("senderName").value.trim();
      const subject = document.getElementById("emailSubject").value.trim();
      const message = document.getElementById("emailMessage").value.trim();

      // Build mailto link
      const fullBody = `Name: ${name}\n\n${message}`;
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

      // Trigger default email app
      const tempLink = document.createElement("a");
      tempLink.href = mailtoUrl;
      tempLink.style.display = "none";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Close modal after sending
      closeModal();
    });
  }
});