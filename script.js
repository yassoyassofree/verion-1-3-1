function sendEmail() {
    const userusername = document.getElementById("reg-username").value.trim();
    const userEmail = document.getElementById("yassin.hussein@capital-schools.com").value.trim();

    if (!userName || !userEmail) {
        alert("Please fill in both fields.");
        return;
    }

    const templateParams = {
        user_name: userName,
        user_email: "sinoking2003@gmail.com",
        admin_email: "admin@example.com", // Admin email address
        to_email: userEmail // The user receives the email at their email address
    };

    // Send email using EmailJS
    emailjs.send('service_qpztxp8', 'template_2v86f7s', templateParams)
        .then(() => {
            // Redirect to welcome page after email is sent successfully
            window.location.href = "welcome.html";
        })
        .catch((error) => {
            alert(`Error: ${JSON.stringify(error)}`);
        });
}
