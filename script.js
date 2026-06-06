if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let reminders = [];
let appointments = [];
let diseases = [];
let medicalReports = [];
let currentUser = null;
let registeredUsers = [];

// Load registered users from localStorage
function loadRegisteredUsers() {
  const stored = localStorage.getItem('registeredUsers');
  if (stored) {
    registeredUsers = JSON.parse(stored);
  }
}

// Save registered users to localStorage
function saveRegisteredUsers() {
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// Initialize app - load registered users
loadRegisteredUsers();

// Tab Switching
function switchToLogin() {
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('signupForm').classList.remove('active');
  document.querySelectorAll('.tab-btn')[0].classList.add('active');
  document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function switchToSignup() {
  document.getElementById('loginForm').classList.remove('active');
  document.getElementById('signupForm').classList.add('active');
  document.querySelectorAll('.tab-btn')[0].classList.remove('active');
  document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// Show/Hide Forms
function showLoginForm() {
  document.getElementById('authButtons').classList.add('hidden');
  document.getElementById('formsContainer').classList.remove('hidden');
  switchToLogin();
}

function showSignupForm() {
  document.getElementById('authButtons').classList.add('hidden');
  document.getElementById('formsContainer').classList.remove('hidden');
  switchToSignup();
}

function closeAuthForms() {
  document.getElementById('formsContainer').classList.add('hidden');
  document.getElementById('authButtons').classList.remove('hidden');
  clearLoginForm();
  clearSignupForm();
}

// Profile Auth Form Functions
function showProfileLoginForm() {
  document.getElementById('accountButtons').classList.add('hidden');
  document.getElementById('profileFormsContainer').classList.remove('hidden');
  switchToProfileLogin();
}

function showProfileSignupForm() {
  document.getElementById('accountButtons').classList.add('hidden');
  document.getElementById('profileFormsContainer').classList.remove('hidden');
  switchToProfileSignup();
}

function switchToProfileLogin() {
  document.getElementById('profileLoginForm').classList.add('active');
  document.getElementById('profileSignupForm').classList.remove('active');
  const tabs = document.querySelectorAll('#profileFormsContainer .tab-btn');
  tabs[0].classList.add('active');
  tabs[1].classList.remove('active');
}

function switchToProfileSignup() {
  document.getElementById('profileLoginForm').classList.remove('active');
  document.getElementById('profileSignupForm').classList.add('active');
  const tabs = document.querySelectorAll('#profileFormsContainer .tab-btn');
  tabs[0].classList.remove('active');
  tabs[1].classList.add('active');
}

function closeProfileAuthForms() {
  document.getElementById('profileFormsContainer').classList.add('hidden');
  document.getElementById('accountButtons').classList.remove('hidden');
  clearProfileLoginForm();
  clearProfileSignupForm();
}

function clearProfileLoginForm() {
  document.getElementById("profileLoginEmail").value = "";
  document.getElementById("profileLoginPassword").value = "";
}

function clearProfileSignupForm() {
  document.getElementById("profileSignupName").value = "";
  document.getElementById("profileSignupAge").value = "";
  document.getElementById("profileSignupEmail").value = "";
  document.getElementById("profileSignupPassword").value = "";
}

// Profile Login Handler
function handleProfileLogin() {
  const email = document.getElementById("profileLoginEmail").value.trim();
  const password = document.getElementById("profileLoginPassword").value;

  if (!email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  const user = registeredUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  currentUser = user;
  loadUserData();
  updateProfileDisplay();
  updateDashboard();

  alert("Successfully switched account!");
  closeProfileAuthForms();
}

// Profile Sign Up Handler
function handleProfileSignup() {
  const name = document.getElementById("profileSignupName").value.trim();
  const age = document.getElementById("profileSignupAge").value;
  const email = document.getElementById("profileSignupEmail").value.trim();
  const password = document.getElementById("profileSignupPassword").value;

  if (!name || !age || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  // Check if email already exists
  if (registeredUsers.some(user => user.email === email)) {
    alert("Email already registered! Please login or use a different email.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    age,
    email,
    password
  };

  registeredUsers.push(newUser);
  saveRegisteredUsers();

  currentUser = newUser;
  loadUserData();
  updateProfileDisplay();
  updateDashboard();

  alert("Account created and logged in successfully!");
  closeProfileAuthForms();
}

// Sign Up Handler
function handleSignup() {
  const name = document.getElementById("signupName").value.trim();
  const age = document.getElementById("signupAge").value;
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!name || !age || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  // Check if email already exists
  if (registeredUsers.some(user => user.email === email)) {
    alert("Email already registered! Please login or use a different email.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    age,
    email,
    password
  };

  registeredUsers.push(newUser);
  saveRegisteredUsers();

  alert("Sign up successful! Please login with your credentials.");
  clearSignupForm();
  switchToLogin();
}

// Login Handler
function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  const user = registeredUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  currentUser = user;

  document.getElementById("loginPage").classList.remove("active");
  document.getElementById("mainApp").classList.remove("hidden");

  loadUserData();
  updateProfileDisplay();
  updateDashboard();

  clearLoginForm();
}

function clearLoginForm() {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}

function clearSignupForm() {
  document.getElementById("signupName").value = "";
  document.getElementById("signupAge").value = "";
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
}

// Profile Dropdown Toggle
function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("hidden");
  
  // Close dropdown when clicking outside
  document.addEventListener("click", function(event) {
    if (!event.target.closest(".profile-dropdown-container")) {
      dropdown.classList.add("hidden");
    }
  });
}

// Toggle Profile Information
function toggleProfileInfo() {
  const profileHeader = document.getElementById("profileHeader");
  const button = document.querySelector(".toggle-profile-btn");
  
  profileHeader.classList.toggle("hidden");
  
  if (profileHeader.classList.contains("hidden")) {
    button.textContent = "👤 View My Information";
  } else {
    button.textContent = "👤 Hide My Information";
  }
}

const STORAGE_KEY = "medicines";
const APPOINTMENTS_KEY = "appointments";
const DISEASES_KEY = "diseases";
const REPORTS_KEY = "reports";
const LAST_DECREMENT_KEY = "lastDecrement";
const USERS_KEY = "users";

// Login/Logout Functions
function handleLogin() {
  const name = document.getElementById("loginName").value.trim();
  const age = document.getElementById("loginAge").value;
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!name || !age || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  currentUser = {
    id: Date.now(),
    name,
    age,
    email,
    password
  };

  document.getElementById("loginPage").classList.remove("active");
  document.getElementById("mainApp").classList.remove("hidden");

  loadUserData();
  updateProfileDisplay();
  updateDashboard();
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    currentUser = null;
    document.getElementById("mainApp").classList.add("hidden");
    document.getElementById("loginPage").classList.add("active");
    document.getElementById("profileDropdown").classList.add("hidden");
    document.getElementById('formsContainer').classList.add('hidden');
    document.getElementById('authButtons').classList.remove('hidden');
    clearLoginForm();
    clearSignupForm();
  }
}

function clearLoginForm() {
  document.getElementById("loginName").value = "";
  document.getElementById("loginAge").value = "";
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}

function updateProfileDisplay() {
  if (currentUser) {
    document.getElementById("userFullName").textContent = currentUser.name;
    document.getElementById("userAge").textContent = `Age: ${currentUser.age}`;
    document.getElementById("userEmail").textContent = `Email: ${currentUser.email}`;
    
    // Update greeting
    const greetingElement = document.getElementById("greetingText");
    if (greetingElement) {
      greetingElement.textContent = `Welcome back, ${currentUser.name}! 👋`;
    }
  }
}

function loadUserData() {
  const userKey = `user_${currentUser.id}`;
  
  const stored = localStorage.getItem(`${userKey}_${STORAGE_KEY}`);
  if (stored) reminders = JSON.parse(stored);
  
  const storedAppointments = localStorage.getItem(`${userKey}_${APPOINTMENTS_KEY}`);
  if (storedAppointments) appointments = JSON.parse(storedAppointments);
  
  const storedDiseases = localStorage.getItem(`${userKey}_${DISEASES_KEY}`);
  if (storedDiseases) diseases = JSON.parse(storedDiseases);
  
  const storedReports = localStorage.getItem(`${userKey}_${REPORTS_KEY}`);
  if (storedReports) medicalReports = JSON.parse(storedReports);
  
  decrementDailyQuantity();
  displayDiseases();
  displayReminders();
  displayAppointments();
  displayMedicalReports();
}

function saveMedicinesToUser() {
  if (currentUser) {
    const userKey = `user_${currentUser.id}`;
    localStorage.setItem(`${userKey}_${STORAGE_KEY}`, JSON.stringify(reminders));
  }
}

function saveAppointmentsToUser() {
  if (currentUser) {
    const userKey = `user_${currentUser.id}`;
    localStorage.setItem(`${userKey}_${APPOINTMENTS_KEY}`, JSON.stringify(appointments));
  }
}

function saveDiseasesToUser() {
  if (currentUser) {
    const userKey = `user_${currentUser.id}`;
    localStorage.setItem(`${userKey}_${DISEASES_KEY}`, JSON.stringify(diseases));
  }
}

function saveReportsToUser() {
  if (currentUser) {
    const userKey = `user_${currentUser.id}`;
    localStorage.setItem(`${userKey}_${REPORTS_KEY}`, JSON.stringify(medicalReports));
  }
}

// Diseases Management
function addDisease() {
  const diseaseName = document.getElementById("diseaseInput").value.trim();
  
  if (!diseaseName) {
    alert("Please enter a disease name!");
    return;
  }

  diseases.push({
    id: Date.now(),
    name: diseaseName,
    addedDate: new Date().toDateString()
  });

  saveDiseasesToUser();
  displayDiseases();
  document.getElementById("diseaseInput").value = "";
}

function deleteDisease(id) {
  diseases = diseases.filter(d => d.id !== id);
  saveDiseasesToUser();
  displayDiseases();
}

function displayDiseases() {
  const container = document.getElementById("diseasesList");
  
  if (diseases.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-text">No diseases recorded</div></div>';
    return;
  }

  container.innerHTML = diseases.map(d => `
    <div class="disease-item">
      <div class="disease-name">🏥 ${d.name}</div>
      <div class="disease-date">Added: ${d.addedDate}</div>
      <button class="delete-btn small-delete-btn" onclick="deleteDisease(${d.id})">Delete</button>
    </div>
  `).join('');
}

// Medical Reports Management
function addMedicalReport() {
  const reportFile = document.getElementById("reportFile").files[0];
  
  if (!reportFile) {
    alert("Please select a report image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const reportData = {
      id: Date.now(),
      image: e.target.result,
      fileName: reportFile.name,
      uploadDate: new Date().toDateString()
    };

    medicalReports.push(reportData);
    saveReportsToUser();
    displayMedicalReports();
    document.getElementById("reportFile").value = "";
  };
  reader.readAsDataURL(reportFile);
}

function deleteReport(id) {
  medicalReports = medicalReports.filter(r => r.id !== id);
  saveReportsToUser();
  displayMedicalReports();
}

function displayMedicalReports() {
  const container = document.getElementById("reportsList");
  
  if (medicalReports.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><div class="empty-state-text">No medical reports uploaded</div></div>';
    return;
  }

  container.innerHTML = medicalReports.map(r => `
    <div class="report-item">
      <div class="report-image"><img src="${r.image}" alt="Medical Report"></div>
      <div class="report-info">
        <div class="report-name">📋 ${r.fileName}</div>
        <div class="report-date">Uploaded: ${r.uploadDate}</div>
      </div>
      <button class="delete-btn small-delete-btn" onclick="deleteReport(${r.id})">Delete</button>
    </div>
  `).join('');
}

// View Navigation Functions
function showProfileDetails() {
  document.getElementById('dashboardView').classList.remove('active');
  document.getElementById('profileView').classList.add('active');
  document.getElementById('medicinesView').classList.remove('active');
  document.getElementById('appointmentsView').classList.remove('active');
  updateProfileDisplay();
}

function showDashboard() {
  document.getElementById('dashboardView').classList.add('active');
  document.getElementById('profileView').classList.remove('active');
  document.getElementById('medicinesView').classList.remove('active');
  document.getElementById('appointmentsView').classList.remove('active');
  updateDashboard();
}

function showProfile() {
  showProfileDetails();
  updateDashboard();
}

function showMedicines() {
  document.getElementById('dashboardView').classList.remove('active');
  document.getElementById('profileView').classList.remove('active');
  document.getElementById('medicinesView').classList.add('active');
  document.getElementById('appointmentsView').classList.remove('active');
}

function showAppointments() {
  document.getElementById('dashboardView').classList.remove('active');
  document.getElementById('profileView').classList.remove('active');
  document.getElementById('medicinesView').classList.remove('active');
  document.getElementById('appointmentsView').classList.add('active');
  displayAppointmentsView();
}

function updateDashboard() {
  updateStatCards();
  displayTodayReminders();
  displayUpcomingAppointments();
  displayLowStockMedicines();
  checkUpcomingAppointmentAlerts();
  checkLowStockAlerts();
  updateAlertBanner();
}

function updateStatCards() {
  document.getElementById('totalMedicines').textContent = reminders.length;
  
  const today = new Date().toDateString();
  const todayReminders = reminders.filter(r => {
    const reminderTime = r.time;
    return reminderTime !== undefined && reminderTime !== '';
  });
  document.getElementById('todayCount').textContent = todayReminders.length;
  
  const lowStock = reminders.filter(r => r.remainingQuantity <= 3).length;
  document.getElementById('lowStockCount').textContent = lowStock;
  
  const today_date = new Date();
  const upcomingAppts = appointments.filter(a => new Date(a.appointmentDate) >= today_date).length;
  document.getElementById('upcomingAppointments').textContent = upcomingAppts;
}

function displayTodayReminders() {
  const container = document.getElementById("todayReminders");
  const todayReminders = reminders.filter(r => r.time !== undefined && r.time !== '');
  
  if (todayReminders.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">No medicines scheduled for today</div></div>';
    return;
  }
  
  container.innerHTML = todayReminders.map(r => `
    <div class="reminder-item">
      ${r.photo ? `<div class="medicine-photo"><img src="${r.photo}" alt="${r.name}"></div>` : ''}
      <div class="reminder-name">💊 ${r.name}</div>
      <div class="reminder-details">⏰ Time: ${r.time}</div>
      <div class="reminder-details">💊 Dosage: ${r.dosage}</div>
      <div class="reminder-details">🎯 Purpose: ${r.purpose}</div>
      <div class="reminder-details">📦 Remaining: ${r.remainingQuantity}/${r.quantity} doses</div>
    </div>
  `).join('');
}

function displayUpcomingAppointments() {
  const container = document.getElementById('appointmentsList');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppts = appointments
    .filter(a => new Date(a.appointmentDate) >= today)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 5);
  
  if (upcomingAppts.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">No upcoming appointments</div></div>';
    return;
  }
  
  container.innerHTML = upcomingAppts.map(a => {
    const appointmentDate = new Date(a.appointmentDate);
    const daysUntil = Math.floor((appointmentDate - today) / (1000 * 60 * 60 * 24));
    const urgencyClass = daysUntil <= 1 ? 'urgent' : daysUntil <= 3 ? 'coming-soon' : '';
    const urgencyIcon = daysUntil === 0 ? '🔴' : daysUntil <= 3 ? '🟡' : '🟢';
    const alertHTML = daysUntil <= 3 ? `<div class="appointment-alert">⏰ ${daysUntil === 0 ? 'TODAY!' : 'In ' + daysUntil + ' day' + (daysUntil > 1 ? 's' : '')}</div>` : '';
    
    return `
    <div class="appointment-item ${urgencyClass}">
      <div class="appointment-doctor">${urgencyIcon} 👨‍⚕️ Dr. ${a.doctorName}</div>
      <div class="appointment-details">📅 Date: ${a.appointmentDate}</div>
      <div class="appointment-details">⏰ Time: ${a.appointmentTime}</div>
      ${alertHTML}
      <button class="delete-appointment-btn" onclick="deleteAppointment(${a.id})">Delete</button>
    </div>
  `;
  }).join('');
}

function displayLowStockMedicines() {
  const container = document.getElementById('lowStockList');
  const lowStockMeds = reminders.filter(r => r.remainingQuantity <= 3);
  
  if (lowStockMeds.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-text">All medicines have sufficient stock</div></div>';
    return;
  }
  
  container.innerHTML = lowStockMeds.map(r => `
    <div class="low-stock-item">
      ${r.photo ? `<div class="medicine-photo-small"><img src="${r.photo}" alt="${r.name}"></div>` : ''}
      <div class="low-stock-info">
        <div class="low-stock-name">⚠️ ${r.name}</div>
        <div class="low-stock-quantity">📦 Remaining: ${r.remainingQuantity}/${r.quantity} doses</div>
        <div class="low-stock-quantity">💊 Dosage: ${r.dosage}</div>
        <div class="low-stock-quantity">🎯 Purpose: ${r.purpose}</div>
        <div class="low-stock-action">🚨 Please refill soon!</div>
      </div>
    </div>
  `).join('');
  
  // Show notification for low stock
  checkLowStockAlerts();
}

function checkLowStockAlerts() {
  const lowStockMeds = reminders.filter(r => r.remainingQuantity <= 3);
  
  lowStockMeds.forEach(medicine => {
    const alertKey = `low-stock-alert-${medicine.id}`;
    const lastAlert = localStorage.getItem(alertKey);
    const today = new Date().toDateString();
    
    if (lastAlert !== today && Notification.permission === "granted") {
      new Notification("💊 Low Stock Alert - " + medicine.name, {
        body: `Only ${medicine.remainingQuantity} doses left! Please refill soon.`,
        icon: "⚠️",
        tag: `low-stock-${medicine.id}`,
        requireInteraction: true
      });
      localStorage.setItem(alertKey, today);
    }
  });
}

function checkUpcomingAppointmentAlerts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  appointments.forEach(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const daysUntil = Math.floor((appointmentDate - today) / (1000 * 60 * 60 * 24));
    
    // Show alert if appointment is within 3 days
    if (daysUntil >= 0 && daysUntil <= 3) {
      const alertKey = `appt-alert-${appointment.id}`;
      const lastAlert = localStorage.getItem(alertKey);
      const currentDate = new Date().toDateString();
      
      if (lastAlert !== currentDate && Notification.permission === "granted") {
        const daysText = daysUntil === 0 ? "TODAY" : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
        new Notification("📅 Upcoming Appointment - " + appointment.doctorName, {
          body: `Your appointment is ${daysText} at ${appointment.appointmentTime}`,
          icon: "📋",
          tag: `appt-${appointment.id}`,
          requireInteraction: true
        });
        localStorage.setItem(alertKey, currentDate);
      }
    }
  });
}

function updateAlertBanner() {
  const alertBanner = document.getElementById('alertBanner');
  const alertContent = document.getElementById('alertContent');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check for appointments today
  const appointmentToday = appointments.find(a => new Date(a.appointmentDate).toDateString() === today.toDateString());
  
  // Check for low stock medicines
  const lowStockMeds = reminders.filter(r => r.remainingQuantity <= 3);
  
  let alertMessages = [];
  
  if (appointmentToday) {
    alertMessages.push(`📅 <strong>Appointment Today!</strong> You have an appointment with Dr. ${appointmentToday.doctorName} at ${appointmentToday.appointmentTime}`);
  }
  
  if (lowStockMeds.length > 0) {
    if (lowStockMeds.length === 1) {
      alertMessages.push(`⚠️ <strong>Low Stock Alert!</strong> ${lowStockMeds[0].name} is running low - only ${lowStockMeds[0].remainingQuantity} dose${lowStockMeds[0].remainingQuantity === 1 ? '' : 's'} left`);
    } else {
      alertMessages.push(`⚠️ <strong>Low Stock Alert!</strong> ${lowStockMeds.length} medicines are running low on stock`);
    }
  }
  
  if (alertMessages.length > 0) {
    alertContent.innerHTML = `<span class="alert-icon">🔔</span><div>${alertMessages.map(msg => `<div style="margin: 8px 0;">${msg}</div>`).join('')}</div>`;
    alertBanner.classList.remove('hidden');
  } else {
    alertBanner.classList.add('hidden');
  }
}

function displayAppointmentsView() {
  const container = document.getElementById('appointmentsListView');
  displayAppointments();
}

// Load medicines and appointments from local storage on page load
function loadMedicines() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    reminders = JSON.parse(stored);
    decrementDailyQuantity();
  }
  const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
  if (storedAppointments) {
    appointments = JSON.parse(storedAppointments);
  }
  displayReminders();
  displayAppointments();
  updateDashboard();
}

function addReminder() {
  const name = document.getElementById("name").value.trim();
  const dosage = document.getElementById("dosage").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value);
  const time = document.getElementById("time").value;
  const purpose = document.getElementById("purpose").value.trim();
  const photoFile = document.getElementById("medicinePhoto").files[0];

  if (!name || !dosage || !quantity || !time || !purpose) {
    alert("Please fill in all fields!");
    return;
  }

  // Handle image if provided
  if (photoFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageData = e.target.result;
      reminders.push({ 
        id: Date.now(), 
        name, 
        dosage, 
        quantity, 
        remainingQuantity: quantity, 
        time, 
        purpose, 
        addedDate: new Date().toDateString(), 
        taken: false,
        photo: imageData 
      });
      saveMedicines();
      displayReminders();
      updateDashboard();
      updateAlertBanner();
      clearMedicineForm();
    };
    reader.readAsDataURL(photoFile);
  } else {
    reminders.push({ 
      id: Date.now(), 
      name, 
      dosage, 
      quantity, 
      remainingQuantity: quantity, 
      time, 
      purpose, 
      addedDate: new Date().toDateString(), 
      taken: false,
      photo: null 
    });
    saveMedicines();
    displayReminders();
    updateDashboard();
    updateAlertBanner();
    clearMedicineForm();
  }
}

function clearMedicineForm() {
  document.getElementById("name").value = "";
  document.getElementById("dosage").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("time").value = "";
  document.getElementById("purpose").value = "";
  document.getElementById("medicinePhoto").value = "";
  document.getElementById("photoPreview").innerHTML = "";
}

function deleteMedicine(id) {
  reminders = reminders.filter(r => r.id !== id);
  saveMedicines();
  displayReminders();
  updateAlertBanner();
}

function decrementDailyQuantity() {
  const today = new Date().toDateString();
  const lastDecrement = localStorage.getItem(LAST_DECREMENT_KEY);

  if (lastDecrement !== today) {
    reminders.forEach(r => {
      if (r.remainingQuantity > 0) {
        r.remainingQuantity--;
        if (r.remainingQuantity === 3) {
          showLowStockAlert(r.name);
        }
      }
    });
    localStorage.setItem(LAST_DECREMENT_KEY, today);
    saveMedicines();
  }
}

function showLowStockAlert(medicineName) {
  if (Notification.permission === "granted") {
    new Notification("⚠️ Low Stock Alert", {
      body: `Only 3 doses of ${medicineName} left! Please refill.`,
      icon: "⚠️"
    });
  }
}

function saveMedicines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

// Appointment Management Functions
function addAppointment() {
  const doctorName = document.getElementById("doctorName").value.trim();
  const appointmentDate = document.getElementById("appointmentDate").value;
  const appointmentTime = document.getElementById("appointmentTime").value;

  if (!doctorName || !appointmentDate || !appointmentTime) {
    alert("Please fill in all fields!");
    return;
  }

  appointments.push({ id: Date.now(), doctorName, appointmentDate, appointmentTime });
  saveAppointments();
  displayAppointments();
  updateAlertBanner();
  
  // Clear inputs
  document.getElementById("doctorName").value = "";
  document.getElementById("appointmentDate").value = "";
  document.getElementById("appointmentTime").value = "";
}

function deleteAppointment(id) {
  appointments = appointments.filter(a => a.id !== id);
  saveAppointments();
  displayAppointments();
  updateAlertBanner();
}

function saveAppointments() {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

function displayAppointments() {
  const appointmentsList = document.getElementById("appointmentsListView");
  
  if (appointments.length === 0) {
    appointmentsList.innerHTML = "<p class='empty-message'>No appointments booked yet. Book one to get started!</p>";
    return;
  }

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.appointmentDate + " " + a.appointmentTime);
    const dateB = new Date(b.appointmentDate + " " + b.appointmentTime);
    return dateA - dateB;
  });

  appointmentsList.innerHTML = sortedAppointments.map(a => {
    const appointmentDateTime = new Date(a.appointmentDate + " " + a.appointmentTime);
    const now = new Date();
    const isUpcoming = appointmentDateTime > now;
    const cardClass = isUpcoming ? 'appointment-card upcoming' : 'appointment-card past';
    const statusIcon = isUpcoming ? '📌' : '✅';

    return `
      <div class="${cardClass}">
        <div class="appointment-status">${statusIcon} ${isUpcoming ? 'Upcoming' : 'Completed'}</div>
        <h4>👨‍⚕️ Dr. ${a.doctorName}</h4>
        <div class="appointment-info"><strong>Date:</strong> ${a.appointmentDate}</div>
        <div class="appointment-info"><strong>Time:</strong> ${a.appointmentTime}</div>
        <div class="appointment-actions">
          <button class="delete-btn" onclick="deleteAppointment(${a.id})">Delete</button>
        </div>
      </div>
    `;
  }).join("");
}

function displayReminders() {
  const list = document.getElementById("list");
  
  if (reminders.length === 0) {
    list.innerHTML = "<p class='empty-message'>No medicines added yet. Add one to get started!</p>";
    displayTodayReminders();
    return;
  }

  list.innerHTML = reminders.map(r => {
    const isLowStock = r.remainingQuantity <= 3;
    const cardClass = isLowStock ? 'medicine-card low-stock' : 'medicine-card';
    const stockWarning = isLowStock ? `<div class="stock-warning">⚠️ Only ${r.remainingQuantity} left!</div>` : '';
    const photoHTML = r.photo ? `<img src="${r.photo}" alt="${r.name}" class="medicine-photo-display">` : '';
    
    return `
    <div class="${cardClass}">
      ${photoHTML}
      <h4>💊 ${r.name}</h4>
      <div class="medicine-info"><strong>Purpose:</strong> ${r.purpose}</div>
      <div class="medicine-info"><strong>Dosage:</strong> ${r.dosage}</div>
      <div class="medicine-info"><strong>Time:</strong> ${r.time}</div>
      <div class="medicine-info"><strong>Remaining:</strong> ${r.remainingQuantity}/${r.quantity} doses</div>
      ${stockWarning}
      <div class="medicine-actions">
        <button class="delete-btn" onclick="deleteMedicine(${r.id})">Delete</button>
      </div>
    </div>
  `;
  }).join("");
  
  displayTodayReminders();
  displayMonthlyCalendar();
  displayMedicineTable();
}

function displayTodayReminders() {
  const todayContainer = document.getElementById("todayReminders");
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
  
  // Sort medicines by time
  const sortedReminders = [...reminders].sort((a, b) => a.time.localeCompare(b.time));
  
  if (sortedReminders.length === 0) {
    todayContainer.innerHTML = "<p class='empty-message'>No medicines scheduled for today yet.</p>";
    return;
  }
  
  todayContainer.innerHTML = sortedReminders.map(r => {
    const isPast = r.time < currentTime;
    const isCurrent = r.time === currentTime;
    const reminderClass = isCurrent ? 'reminder-card current' : isPast ? 'reminder-card taken' : 'reminder-card upcoming';
    const statusIcon = isCurrent ? '🔔' : isPast ? '✅' : '⏰';
    const statusText = isCurrent ? 'Time Now!' : isPast ? 'Taken' : 'Upcoming';
    
    return `
      <div class="${reminderClass}">
        <div class="reminder-status">${statusIcon} ${statusText}</div>
        <div class="reminder-time">${r.time}</div>
        <div class="reminder-medicine">${r.name}</div>
        <div class="reminder-dosage">${r.dosage}</div>
      </div>
    `;
  }).join("");
}

function displayMonthlyCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  let calendarHTML = `<div class="calendar-header">${monthNames[month]} ${year}</div>`;
  calendarHTML += '<div class="calendar-grid">';
  
  // Add day headers
  dayNames.forEach(day => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`;
  });
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>';
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toDateString();
    const medicinesToday = reminders.filter(r => r.addedDate === dateStr);
    const isToday = now.getDate() === day;
    const dayClass = isToday ? 'calendar-day today' : 'calendar-day';
    
    let dayContent = `<div class="${dayClass}">`;
    dayContent += `<div class="day-number">${day}</div>`;
    
    if (medicinesToday.length > 0) {
      dayContent += `<div class="day-medicines">`;
      medicinesToday.forEach(medicine => {
        dayContent += `<div class="day-medicine-item">📍 ${medicine.time}</div>`;
      });
      dayContent += `</div>`;
    }
    
    dayContent += `</div>`;
    calendarHTML += dayContent;
  }
  
  calendarHTML += '</div>';
  document.getElementById("monthlyCalendar").innerHTML = calendarHTML;
}

function displayMedicineTable() {
  const tableContainer = document.getElementById("medicineTable");
  
  if (reminders.length === 0) {
    tableContainer.innerHTML = "<p class='empty-message'>No medicines scheduled for today.</p>";
    return;
  }
  
  // Define time periods
  const timePeriods = {
    'Morning (6 AM - 9 AM)': { start: '06:00', end: '09:00' },
    'Before Lunch (9 AM - 12 PM)': { start: '09:00', end: '12:00' },
    'After Lunch (12 PM - 2 PM)': { start: '12:00', end: '14:00' },
    'Afternoon (2 PM - 6 PM)': { start: '14:00', end: '18:00' },
    'Night (6 PM - 11 PM)': { start: '18:00', end: '23:00' }
  };
  
  let tableHTML = '<table class="medicines-table"><thead><tr>';
  tableHTML += '<th>Time Period</th><th>Medicine Name</th><th>Dosage</th><th>Time</th><th>Remaining</th><th>Taken</th>';
  tableHTML += '</tr></thead><tbody>';
  
  let hasAnyMedicine = false;
  
  Object.entries(timePeriods).forEach(([period, timeRange]) => {
    const medicinesInPeriod = reminders.filter(m => {
      return m.time >= timeRange.start && m.time < timeRange.end;
    }).sort((a, b) => a.time.localeCompare(b.time));
    
    if (medicinesInPeriod.length > 0) {
      hasAnyMedicine = true;
      medicinesInPeriod.forEach((medicine, index) => {
        const isTaken = medicine.taken ? 'checked' : '';
        const takenClass = medicine.taken ? 'row-taken' : '';
        
        tableHTML += `<tr class="${takenClass}">`;
        
        // Time period column (only for first row of the period)
        if (index === 0) {
          tableHTML += `<td class="period-cell" rowspan="${medicinesInPeriod.length}">${period}</td>`;
        }
        
        tableHTML += `<td>${medicine.name}</td>`;
        tableHTML += `<td>${medicine.dosage}</td>`;
        tableHTML += `<td>${medicine.time}</td>`;
        tableHTML += `<td>${medicine.remainingQuantity}/${medicine.quantity}</td>`;
        tableHTML += `<td class="checkbox-cell"><input type="checkbox" id="med-${medicine.id}" ${isTaken} onchange="toggleMedicineTaken(${medicine.id})"></td>`;
        tableHTML += '</tr>';
      });
    }
  });
  
  tableHTML += '</tbody></table>';
  
  if (hasAnyMedicine) {
    tableContainer.innerHTML = tableHTML;
  } else {
    tableContainer.innerHTML = "<p class='empty-message'>No medicines scheduled for today.</p>";
  }
}

function toggleMedicineTaken(id) {
  const medicine = reminders.find(m => m.id === id);
  if (medicine) {
    medicine.taken = !medicine.taken;
    saveMedicines();
    displayMedicineTable();
  }
}

setInterval(() => {
  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, '0') + ":" +
    now.getMinutes().toString().padStart(2, '0');

  reminders.forEach((r) => {
    if (r.time === currentTime) {
      showNotification(r.name, r.dosage);
    }
  });
  
  // Update today's reminders display every minute
  displayTodayReminders();
  
  // Check for appointment and low stock alerts
  checkUpcomingAppointmentAlerts();
  checkLowStockAlerts();
  updateAlertBanner();
}, 60000); // checks every minute

function showNotification(medicine, dosage) {
  if (Notification.permission === "granted") {
    new Notification("💊 Medicine Reminder", {
      body: `Take ${medicine} (${dosage})`,
      icon: "💊"
    });
  }
}

// Load medicines when page loads
window.addEventListener("DOMContentLoaded", function() {
  loadMedicines();
  
  // Setup photo input preview
  const photoInput = document.getElementById("medicinePhoto");
  if (photoInput) {
    photoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      const preview = document.getElementById("photoPreview");
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.innerHTML = `<img src="${e.target.result}" alt="Medicine photo preview" style="max-width: 150px; max-height: 150px; border-radius: 8px; margin-top: 10px;">`;
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = "";
      }
    });
  }
});

// Helper scroll functions for quick actions
function scrollToAddMedicine() {
  const medicinesView = document.getElementById('medicinesView');
  const inputSection = medicinesView.querySelector('.input-section');
  inputSection.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('name').focus();
}

function scrollToAddAppointment() {
  const appointmentsView = document.getElementById('appointmentsView');
  const inputSection = appointmentsView.querySelector('.input-section');
  inputSection.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('doctorName').focus();
}