function validateForm() {
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const address = document.getElementById('address').value.trim();
  const age = document.getElementById('age').value.trim();
  const country = document.getElementById('country').value.trim();
  let isValid = true;
  let errorMessages = [];

  if (!firstName) {
      isValid = false;
     errorMessages.push('First name is required.');
  }

  if (!lastName) {
      isValid = false;
     errorMessages.push('Last name is required.');
  }

   if (!email) {
       isValid = false;
      errorMessages.push('Email is required.');
   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
       isValid = false;
      errorMessages.push('Invalid email format.');
  }

  if (!mobile || !/^\d{10}$/.test(mobile)) {
     isValid = false;
      errorMessages.push('Mobile number is required and must be 10 digits.');
 }

 if (!address) {
     isValid = false;
      errorMessages.push('Address is required.');
 }

   if (!age || isNaN(age) || age <= 0) {
      isValid = false;
     errorMessages.push('Age is required and must be a positive number.');
 }

  if (!country) {
       isValid = false;
       errorMessages.push('Country is required.');
  }

  const errorDiv = document.getElementById('error-messages');
   errorDiv.innerHTML = ''; // Clear previous errors

  if (!isValid) {
      errorMessages.forEach(message => {
          const errorParagraph = document.createElement('p');
          errorParagraph.textContent = message;
          errorDiv.appendChild(errorParagraph);
       });
      return false;
 }

  alert('Form submitted successfully!'); // Replace with actual submission
 return true;
}