let currentStep = 1;
const totalSteps = 5;

// Form data storage
const formData = {
    services: [],
    timeOfDay: '',
    days: [],
    notes: '',
    photo: null,
    name: '',
    email: '',
    phone: ''
};

// Open booking modal
function openBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    currentStep = 1;
    showStep(currentStep);
}

// Close booking modal
function closeBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    resetForm();
}

// Reset form
function resetForm() {
    currentStep = 1;
    Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
            formData[key] = [];
        } else {
            formData[key] = '';
        }
    });
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    document.querySelectorAll('textarea, input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Show specific step
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update button visibility
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const doneBtn = document.getElementById('doneBtn');

    if (step === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        doneBtn.style.display = 'none';
    } else if (step < totalSteps) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        doneBtn.style.display = 'none';
    } else if (step === totalSteps - 1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        doneBtn.style.display = 'none';
    } else if (step === totalSteps) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
        doneBtn.style.display = 'block';
    }
}

// Next step
function nextStep() {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            // Scroll to top of modal
            document.querySelector('.modal-content').scrollTop = 0;
        }
    }
}

// Previous step
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        document.querySelector('.modal-content').scrollTop = 0;
    }
}

// Validate step
function validateStep(step) {
    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });

    if (step === 1) {
        // Validate services selection
        const selectedServices = Array.from(document.querySelectorAll('input[name="service"]:checked'))
            .map(el => el.value);

        if (selectedServices.length === 0) {
            document.getElementById('serviceError').textContent = 'Please select at least one service.';
            isValid = false;
        } else {
            formData.services = selectedServices;
        }
    }

    if (step === 2) {
        // Validate time of day
        const timeOfDay = document.querySelector('input[name="timeOfDay"]:checked');
        const selectedDays = Array.from(document.querySelectorAll('input[name="day"]:checked'))
            .map(el => el.value);

        if (!timeOfDay) {
            document.getElementById('timeError').textContent = 'Please select a preferred time of day.';
            isValid = false;
        } else {
            formData.timeOfDay = timeOfDay.value;
        }

        if (selectedDays.length === 0) {
            if (!document.getElementById('timeError').textContent) {
                document.getElementById('timeError').textContent = 'Please select at least one preferred day.';
            } else {
                document.getElementById('timeError').textContent += ' Please also select at least one preferred day.';
            }
            isValid = false;
        } else {
            formData.days = selectedDays;
        }
    }

    if (step === 4) {
        // Validate contact details
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            document.getElementById('contactError').textContent = 'Please enter your name.';
            isValid = false;
        } else {
            formData.name = name;
        }

        if (!email || !emailRegex.test(email)) {
            if (!isValid) {
                document.getElementById('contactError').textContent += ' Please enter a valid email.';
            } else {
                document.getElementById('contactError').textContent = 'Please enter a valid email.';
            }
            isValid = false;
        } else {
            formData.email = email;
        }

        if (!phone) {
            if (!isValid) {
                document.getElementById('contactError').textContent += ' Please enter your phone number.';
            } else {
                document.getElementById('contactError').textContent = 'Please enter your phone number.';
            }
            isValid = false;
        } else {
            formData.phone = phone;
        }
    }

    return isValid;
}

// Save step data
function saveStepData(step) {
    if (step === 3) {
        formData.notes = document.getElementById('notes').value;
        const photoFile = document.getElementById('photo').files[0];
        if (photoFile) {
            formData.photo = photoFile.name;
        }
    }
}

// Submit form
function submitForm() {
    if (validateStep(4)) {
        saveStepData(3);

        // In a real application, you would send this data to a server
        console.log('Form Data Submitted:', formData);

        // You could send it to an email service or API endpoint like:
        // await fetch('/api/booking-request', { method: 'POST', body: JSON.stringify(formData) });

        // Or send via email:
        // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(formData) });

        // For demo purposes, show success and move to confirmation
        currentStep = totalSteps;
        showStep(currentStep);
        document.querySelector('.modal-content').scrollTop = 0;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBooking();
    }
};

// Toggle more services
function toggleMoreServices() {
    const moreServices = document.querySelectorAll('.service-more');
    const button = document.getElementById('toggleMoreServices');
    const allHidden = Array.from(moreServices).every(el => el.style.display === 'none');

    moreServices.forEach(el => {
        el.style.display = allHidden ? 'flex' : 'none';
    });

    button.textContent = allHidden ? '- Show Less Services' : '+ Show More Services';
}

// Initialize - hide all steps except first
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.form-step').forEach((el, index) => {
        if (index !== 0) {
            el.classList.remove('active');
        }
    });
});
