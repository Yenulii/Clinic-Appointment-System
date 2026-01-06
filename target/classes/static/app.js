// Shared utilities and state for all pages

const STORAGE_KEYS = {
    user: "cms_user", doctors: "cms_doctors", appointments: "cms_appointments",
};

const defaultDoctors = [{
    id: 1,
    firstName: "Kavindu",
    lastName: "Perera",
    phone: "076 060 0156",
    specialization: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    fee: 1500,
    gender: "Male",
}, {
    id: 2,
    firstName: "Nadeesha",
    lastName: "Silva",
    phone: "076 852 0386",
    specialization: "Dermatologist",
    qualification: "MBBS, DDVL",
    fee: 1800,
    gender: "Female",
}, {
    id: 3,
    firstName: "Akalanka",
    lastName: "Jayasinghe",
    phone: "076 162 5879",
    specialization: "General Physician",
    qualification: "MBBS",
    fee: 1500,
    gender: "Male",
}, {
    id: 4,
    firstName: "Nalin D",
    lastName: "Gunarathna",
    phone: "076 522 9510",
    specialization: "Cardiac Surgeon",
    qualification: "MBBS, MS (Surgery)",
    fee: 2000,
    gender: "Male",
},];

const defaultAppointments = [{
    id: 1,
    doctorId: 1,
    doctorName: "Dr. Kavindu Perera",
    specialization: "Cardiologist",
    date: "2025-12-12",
    time: "10:30",
    ampm: "AM",
    status: "confirmed",
    patientName: "Alex",
}, {
    id: 2,
    doctorId: 2,
    doctorName: "Dr. Nadeesha Silva",
    specialization: "Dermatologist",
    date: "2025-12-15",
    time: "14:00",
    ampm: "PM",
    status: "pending",
    patientName: "Alex",
}, {
    id: 3,
    doctorId: 3,
    doctorName: "Dr. Akalanka Jayasinghe",
    specialization: "General Physician",
    date: "2025-12-19",
    time: "15:30",
    ampm: "PM",
    status: "confirmed",
    patientName: "Alex",
},];

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function ensureSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.doctors)) {
        saveToStorage(STORAGE_KEYS.doctors, defaultDoctors);
    }
    if (!localStorage.getItem(STORAGE_KEYS.appointments)) {
        saveToStorage(STORAGE_KEYS.appointments, defaultAppointments);
    }
}

function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
}

function startClock() {
    const pill = document.getElementById("timePill");
    if (!pill) return;
    const update = () => {
        pill.textContent = formatTime(new Date());
    };
    update();
    setInterval(update, 60 * 1000);
}

async function getDoctors() {
    let l = loadFromStorage(STORAGE_KEYS.doctors, defaultDoctors);
    let user = getCurrentUser();
    let res = await fetch('api/admin/get-doctors', {
        headers: {
            "authorization": `Bearer ${user.token}`,
        }
    }).then(response => response.json()).then(doctors => doctors.data)

    console.log(res)
    return res
}

function getAppointments() {
    return loadFromStorage(STORAGE_KEYS.appointments, defaultAppointments);
}

function setAppointments(list) {
    saveToStorage(STORAGE_KEYS.appointments, list);
}

function getCurrentUser() {
    return loadFromStorage(STORAGE_KEYS.user, null);
}

function initTopBar() {
    const user = getCurrentUser();
    const welcome = document.getElementById("topBarWelcome");
    const authBtn = document.getElementById("topBarAuthBtn");
    if (user && welcome && authBtn) {
        welcome.textContent = `Welcome back, ${user.firstName}`;
        authBtn.textContent = "Logout";
        authBtn.addEventListener("click", () => {
            localStorage.removeItem(STORAGE_KEYS.user);
            window.location.href = "login.html";
        });
    } else if (authBtn) {
        authBtn.textContent = "Login";
        authBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    const logoutButtons = document.querySelectorAll("[data-logout]");
    logoutButtons.forEach((btn) => btn.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEYS.user);
        window.location.href = "login.html";
    }));

    const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener("click", () => {
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) sidebar.classList.toggle("open");
        });
    }
}

function renderAppointmentCard(appt) {
    const statusLabel = appt.status === "confirmed" ? "Confirmed" : "Pending";
    const badgeClass = appt.status === "confirmed" ? "status-badge" : "status-badge pending";
    const dateObj = new Date(appt.date);
    const dateLabel = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
    const [h, m] = appt.time.split(":");
    const timeLabel = `${h.padStart(2, "0")}:${m} ${appt.ampm}`;

    const root = document.createElement("article");
    root.className = "appointment-card";
    root.innerHTML = `
    <div>
      <div class="appointment-title">${appt.doctorName}</div>
      <div class="appointment-speciality">${appt.specialization}</div>
    </div>
    <div class="appointment-meta">
      <div><span>Date:</span> ${dateLabel}</div>
      <div><span>Time:</span> ${timeLabel}</div>
      <div><span>Status:</span>
        <span class="${badgeClass}">
          <span class="status-dot"></span> ${statusLabel}
        </span>
      </div>
    </div>
    <div style="text-align:right;">
      <button class="danger-pill" data-cancel-id="${appt.id}">Cancel</button>
    </div>
  `;
    return root;
}

function initSignupPage() {
    const form = document.getElementById("authForm");
    const errorEl = document.getElementById("authError");
    const eyeToggles = document.querySelectorAll(".toggle-password");

    if (!form) return;

    eyeToggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggle.innerHTML = isPassword ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorEl.textContent = "";

        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const email = form.authEmail.value.trim();
        const pw = form.password.value;
        const cpw = form.confirmPassword.value;
        const role = form.role.value;

        ["firstName", "lastName", "authEmail", "password", "confirmPassword",].forEach((name) => form[name].classList.remove("error"));

        let valid = true;
        if (!firstName) {
            form.firstName.classList.add("error");
            valid = false;
        }
        if (!lastName) {
            form.lastName.classList.add("error");
            valid = false;
        }
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            form.authEmail.classList.add("error");
            valid = false;
        }
        if (pw.length < 6) {
            form.password.classList.add("error");
            errorEl.textContent = "Password must be at least 6 characters.";
            valid = false;
        } else if (pw !== cpw) {
            form.confirmPassword.classList.add("error");
            errorEl.textContent = "Passwords do not match.";
            valid = false;
        }

        if (!valid && !errorEl.textContent) {
            errorEl.textContent = "Please fill in all required fields.";
        } else {
            if (!valid) return
            const user = {firstName, lastName, email, password: pw, role};
            fetch("auth/signup", {
                headers: {
                    'Content-Type': 'application/json'
                }, method: "POST", body: JSON.stringify(user),

            }).then(res => {
                res.json().then(r => {
                    console.log(r);
                    // saveToStorage(STORAGE_KEYS.user, user);
                    if (r.success) {
                        window.location.href = "login.html";
                    } else {
                        alert(r.message);
                    }
                })
            })
                .catch(err => console.log(err));
        }


        // window.location.href = "login.html";
    });
}

function initLoginPage() {
    const form = document.getElementById("loginForm");
    const errorEl = document.getElementById("loginError");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorEl.textContent = "";
        const email = form.email.value.trim();
        const pw = form.password.value;
        const role = form.role.value;
        const user = getCurrentUser();

        fetch("auth/login", {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                email: email, password: pw, role: role
            })
        }).then(res => res.json()).then(r => {
            console.log(r);
            if (r.success) {
                saveToStorage(STORAGE_KEYS.user, r.data);
                if (role === "patient") {
                    window.location.href = "patient-dashboard.html";
                } else {
                    window.location.href = "admin-dashboard.html";
                }
            } else {
                errorEl.textContent = r.message ?? "failed";
            }
        }).catch(err => console.log(err));
    });
}

function initPatientDashboard() {
    const listPreview = document.getElementById("patientAppointmentListPreview");
    if (!listPreview) return;

    const user = getCurrentUser() || {firstName: "Alex"};
    const appointments = getAppointments().filter((a) => a.patientName === user.firstName);
    listPreview.innerHTML = "";
    if (!appointments.length) {
        listPreview.innerHTML = '<p style="font-size:13px;color:#6b7280;">No appointments yet. Start by booking your first visit.</p>';
    } else {
        appointments.forEach((appt) => {
            listPreview.appendChild(renderAppointmentCard(appt));
        });
    }
}

async function initPatientAppointmentsPage() {
    const container = document.getElementById("patientAppointmentListFull");
    if (!container) return;
    const user = getCurrentUser() || {firstName: "Alex"};
    const appointments = // getAppointments().filter((a) => a.patientName === user.firstName);
        await fetch("api/patient/get-appointment", {
            headers: {
                'authorization': 'Bearer ' + user.token,
            }
        }).then(res => res.json()).then(r => r.data).catch(err => console.log(err));
    container.innerHTML = "";
    if (!appointments.length) {
        container.innerHTML = '<p style="font-size:13px;color:#6b7280;">No appointments yet.</p>';
    } else {
        appointments.forEach((appt) => container.appendChild(renderAppointmentCard(appt)));
    }

    document.addEventListener("click", (e) => {
        const cancelBtn = e.target.closest(".danger-pill[data-cancel-id]");
        if (!cancelBtn) return;
        const id = Number(cancelBtn.dataset.cancelId);
        if (!confirm("Cancel this appointment?")) return;
        // const remaining = getAppointments().filter((a) => a.id !== id);
        // setAppointments(remaining);
        fetch('api/patient/delete-appointment?id='+id,{
            method: "POST",
            headers: {
                'authorization':"Bearer " + getCurrentUser().token,
            }
        })
            .then(res => {
                window.location.reload();
            }).catch(err => console.log(err));


    });
}

async function initPatientDoctorsPage() {
    const grid = document.getElementById("patientDoctorsGrid");
    if (!grid) return;
    const doctors = await getDoctors();
    grid.innerHTML = "";
    doctors.forEach((d) => {
        const card = document.createElement("article");
        card.className = "appointment-card";
        card.style.gridTemplateColumns = "minmax(0, 1.6fr) minmax(0, 1fr)";
        card.innerHTML = `
      <div>
        <div class="appointment-title">Dr. ${d.firstName} ${d.lastName}</div>
        <div class="appointment-speciality">${d.specialization} &bull; ${d.qualification}</div>
      </div>
      <div class="appointment-meta">
        <div><span>Phone:</span> ${d.phone}</div>
        <div><span>Fee:</span> $${d.fee.toFixed(2)}</div>
      </div>
    `;
        grid.appendChild(card);
    });
}

async function initBookAppointmentPage() {
    const form = document.getElementById("bookAppointmentForm");
    const errorEl = document.getElementById("bookAppointmentError");
    if (!form) return;

    const select = document.getElementById("selectDoctor");
    const ampmToggle = document.getElementById("ampmToggle");
    let ampm = "AM";

    const doctors = await getDoctors();
    select.innerHTML = '<option value="">Select Doctor</option>';
    doctors.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `Dr. ${d.firstName} ${d.lastName} (${d.specialization})`;
        select.appendChild(opt);
    });

    if (ampmToggle) {
        ampmToggle.addEventListener("click", (e) => {
            const btn = e.target.closest(".am-pm-btn");
            if (!btn) return;
            document
                .querySelectorAll(".am-pm-btn")
                .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            ampm = btn.dataset.value;
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorEl.textContent = "";

        const doctorId = form.selectDoctor.value;
        const date = form.appointmentDate.value;
        const time = form.appointmentTime.value;
        if (!doctorId || !date || !time) {
            errorEl.textContent = "Please select doctor, date and time.";
            return;
        }

        const doctor = doctors.find((d) => String(d.id) === doctorId);
        const user = getCurrentUser() || {firstName: "Alex"};
        fetch("api/patient/new-appointment", {
            method: "POST", body: JSON.stringify({
                id: Date.now(),
                doctorId: doctor.id,
                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                specialization: doctor.specialization,
                date,
                time,
                ampm,
                patientId: user.id,
                status: "pending",
                patientName: user.firstName,

            }), headers: {
                'authorization': 'Bearer ' + user.token, 'content-type': 'application/json;',
            }
        }).then(res => res.json()).then(res => {
            alert("Appointment booked successfully.");
            window.location.href = "patient-my-appointments.html";
        }).catch(err => console.log(err));
        return;
        const appointments = getAppointments();
        appointments.push({
            id: Date.now(),
            doctorId: doctor.id,
            doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            specialization: doctor.specialization,
            date,
            time,
            ampm,
            status: "pending",
            patientName: user.firstName,
        });
        setAppointments(appointments);
        alert("Appointment booked successfully.");
        window.location.href = "patient-my-appointments.html";
    });
}

function renderDoctorsTable(tbody, doctors) {
    if (!tbody) return;
    tbody.innerHTML = "";
    doctors.forEach((d, idx) => {
        const tr = document.createElement("tr");
        tr.dataset.id = d.id;
        tr.innerHTML = `
      <td>${d.id}.</td>
      <td>Dr. ${d.firstName} ${d.lastName}</td>
      <td>${d.phone}</td>
      <td>${d.specialization}</td>
      <td>Rs${d.fee.toFixed(2)}</td>
      <td>
        <div class="table-actions">
          <i class="fa-regular fa-trash-can" title="Delete"></i>
        </div>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function initAddDoctorPage() {
    const form = document.getElementById("addDoctorForm");
    const errorEl = document.getElementById("addDoctorError");
    const clearBtn = document.getElementById("doctorClear");
    const tbody = document.getElementById("doctorsTableBody");
    const searchInput = document.getElementById("doctorSearchInput");
    if (!form || !tbody) return;

    let doctors = [];
    getDoctors().then(res => {
        doctors = res;
        renderDoctorsTable(tbody, res);
    });
    // renderDoctorsTable(tbody, doctors);

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            form.reset();
            errorEl.textContent = "";
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorEl.textContent = "";
        const firstName = form.doctorFirstName.value.trim();
        const lastName = form.doctorLastName.value.trim();
        const email = form.doctorEmail.value.trim();
        const phone = form.doctorPhone.value.trim();
        const gender = form.querySelector('input[name="doctorGender"]:checked').value;
        const qualification = form.doctorQualification.value.trim();
        const specialization = form.doctorSpecialization.value.trim();
        const feeVal = form.doctorFee.value;
        const fee = Number(feeVal);

        if (!firstName || !lastName || !email || !phone || !qualification || !specialization || !feeVal) {
            errorEl.textContent = "Please fill out all fields.";
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            errorEl.textContent = "Please provide a valid email address.";
            return;
        }
        const user = getCurrentUser();
        console.log(user);
        fetch("api/admin/add-doctor", {
            method: "POST", body: JSON.stringify({
                firstName, lastName, phone, specialization, qualification, fee: isNaN(fee) ? 0 : fee, gender, email
            }), headers: {
                "Content-Type": "application/json", 'authorization': `Bearer ${user.token}`,
            }
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    getDoctors().then(res => {
                        doctors = res;
                        renderDoctorsTable(tbody, res);
                    });
                    form.reset();
                }else{
                    alert("Invalid Data")
                }
            }).catch(error => {
            alert("Failed to Add")
            console.log(error);
        })
    });

    document.addEventListener("click", (e) => {
        const trash = e.target.closest(".fa-trash-can");
        if (!trash) return;
        const tr = trash.closest("tr");
        if (!tr) return;
        const id = Number(tr.dataset.id);
        if (!confirm("Remove this doctor from the list?")) return;

        fetch('api/admin/delete-doctors?id=' + id, {
            headers: {
                'authorization': "Bearer " + getCurrentUser().token

            }
        }).then(res => res.json()).then(data => {
            console.log(data);
            if (data.success) {
                renderDoctorsTable(tbody, data.data);
            }
        })
        return;

        doctors = doctors.filter((d) => d.id !== id);
        saveToStorage(STORAGE_KEYS.doctors, doctors);
        renderDoctorsTable(tbody, doctors);
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const term = searchInput.value.toLowerCase();
            const filtered = doctors.filter((d) => {
                const name = `${d.firstName} ${d.lastName}`.toLowerCase();
                return (name.includes(term) || d.specialization.toLowerCase().includes(term));
            });
            renderDoctorsTable(tbody, filtered);
        });
    }
}

function initAdminDashboard() {
    const summary = document.getElementById("adminSummaryText");
    if (!summary) return;
    const doctors = getDoctors();
    const apps = getAppointments();
    const confirmed = apps.filter((a) => a.status === "confirmed").length;
    const pending = apps.filter((a) => a.status === "pending").length;
    summary.innerHTML = `
    <p>There are <strong>${doctors.length}</strong> doctors on duty today.</p>
    <p style="margin-top:4px;">You have <strong>${confirmed}</strong> confirmed and <strong>${pending}</strong> pending appointments.</p>
  `;
}

async function initAdminAppointmentsPage() {
    const list = document.getElementById("adminAppointmentsList");
    if (!list) return;
    const apps = // getAppointments();
        await fetch('api/admin/get-appointments', {
            headers: {
                'authorization': "Bearer " + getCurrentUser().token
            }
        }).then(res => res.json()).then(data => data.data).catch(error => console.log(error));
    list.innerHTML = "";
    if (!apps.length) {
        list.innerHTML = '<p style="font-size:13px;color:#6b7280;">No appointments scheduled.</p>';
    } else {
        apps.forEach((appt) => list.appendChild(renderAppointmentCard(appt)));
    }
    document.addEventListener("click", (e) => {
        const cancelBtn = e.target.closest(".danger-pill[data-cancel-id]");
        if (!cancelBtn) return;
        const id = Number(cancelBtn.dataset.cancelId);
        if (!confirm("Cancel this appointment?")) return;
        // const remaining = getAppointments().filter((a) => a.id !== id);
        // setAppointments(remaining);
        fetch('api/admin/delete-appointment?id='+id,{
            method: "POST",
            headers: {
                'authorization':"Bearer " + getCurrentUser().token,
            }
        })
            .then(res => {
                window.location.reload();
            }).catch(err => console.log(err));


    });
}

document.addEventListener("DOMContentLoaded", async () => {
    ensureSeedData();
    startClock();
    initTopBar();
    const page = document.body.dataset.page;

    switch (page) {
        case "signup":
            initSignupPage();
            break;
        case "login":
            initLoginPage();
            break;
        case "patient-dashboard":
            checkPatient()
            initPatientDashboard();
            break;
        case "patient-appointments":
            checkPatient()
            await initPatientAppointmentsPage();
            break;
        case "patient-doctors":
            checkPatient()
            await initPatientDoctorsPage();
            break;
        case "patient-book":
            checkPatient()
            await initBookAppointmentPage();
            break;
        case "admin-dashboard":
            checkAdmin()
            initAdminDashboard();
            break;
        case "admin-add-doctor":
            checkAdmin()
            initAddDoctorPage();
            break;
        case "admin-appointments":
            checkAdmin()
            await initAdminAppointmentsPage();
            break;
        default:
            break;
    }
});

function checkUser() {
    let user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
}

function checkAdmin() {
    let user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
    if (user.role !== "admin") {
        window.location.href = "patient-dashboard.html";
    }
}

function checkPatient() {
    let user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
    if (user.role !== "patient") {
        window.location.href = "admin-dashboard.html";
    }
}