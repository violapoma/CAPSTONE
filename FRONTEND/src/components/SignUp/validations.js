//Step 1: validateEmail, validatePassword, validateUsername
export function validateEmail(email = "") {
  const errors = [];

  if (!email) {
    errors.push("Email is required");
    return { valid: false, errors };
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    errors.push("Email format not valid (example@smth.com)");
  }

  return { valid: errors.length === 0, errors };
}

export function validatePassword(password = "") {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least 1 number");
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain at least 1 symbol (@$!%*?&)");
  }
  return { valid: errors.length === 0, errors };
}

export function validateUsername(username = "") {
  const errors = [];

  if (!username) {
    errors.push("Username is required");
    return { valid: false, errors };
  }

  const regex = /^(?![_.])[A-Za-z0-9._]+(?<![_.])$/;
  if (!regex.test(username)) {
    errors.push(
      "Username can only contain letters, numbers and symbols . or -, but it cannot start or end with said symbols"
    );
  }

  if (username.length < 3) errors.push("Username too short (3 char at least)");
  if (username.length > 20) errors.push("Username too long (20 char tops)");

  return { valid: errors.length === 0, errors };
}

//step 2: validateBirthDate
export function validateBirthDate(dateStr = "") {
  const errors = [];

  if (!dateStr) {
    errors.push("La data di nascita è obbligatoria");
    return { valid: false, errors };
  }

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);

  if (!match) {
    errors.push("Invalid date format (dd/mm/yyyy)");
    return { valid: false, errors };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  const dateObj = new Date(`${year}-${month}-${day}`);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() + 1 !== month ||
    dateObj.getDate() !== day
  ) {
    errors.push("This date does not exist");
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  if (age < 18) {
    errors.push("You must be at least 18");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


export function validateFirstName(firstName){
  const errors = []; 
  if(!firstName){
    errors.push("First name is required");
    return { valid: false, errors };
  }
  const regex = /^[a-z-]+$/i;
  if(!regex.test(firstName)){
    errors.push("Username can only contain letters or -");
  }
  return { valid: errors.length === 0, errors }; 
}