// ============================================
// 1) كلاس Student وحماية البيانات Encapsulation
// ============================================

class Student {
    // حقول خاصة: لا يمكن تعديلها مباشرة من خارج الكلاس
    #subject1;
    #subject2;
    #subject3;
    #attendance;

    constructor(name, subject1, subject2, subject3, attendance) {
        if (name.trim() === "") {
            throw new Error("من فضلك أدخل اسم الطالب.");
        }

        this.name = name.trim();

        // نستخدم set للتحقق من كل قيمة قبل تخزينها
        this.subject1 = subject1;
        this.subject2 = subject2;
        this.subject3 = subject3;
        this.attendance = attendance;
    }

    // دالة مساعدة للتحقق من أن القيمة رقم موجود وبين 0 و100
    validateMark(value, fieldName) {
        if (value === "" || value === null || value === undefined) {
            throw new Error(`حقل ${fieldName} مطلوب ولا يمكن تركه فارغاً.`);
        }

        const numberValue = Number(value);

        if (!Number.isFinite(numberValue) || numberValue < 0 || numberValue > 100) {
            throw new Error(`يجب أن تكون ${fieldName} رقماً من 0 إلى 100.`);
        }

        return numberValue;
    }

    // Setters: بوابات آمنة لتعديل الدرجات ونسبة الحضور
    set subject1(value) {
        this.#subject1 = this.validateMark(value, "المادة الأولى");
    }

    set subject2(value) {
        this.#subject2 = this.validateMark(value, "المادة الثانية");
    }

    set subject3(value) {
        this.#subject3 = this.validateMark(value, "المادة الثالثة");
    }

    set attendance(value) {
        this.#attendance = this.validateMark(value, "نسبة الحضور");
    }

    // Getters: بوابات قراءة القيم الخاصة
    get subject1() {
        return this.#subject1;
    }

    get subject2() {
        return this.#subject2;
    }

    get subject3() {
        return this.#subject3;
    }

    get attendance() {
        return this.#attendance;
    }

    // حساب متوسط درجات المواد الثلاث
    calculateAverage() {
        const total = this.#subject1 + this.#subject2 + this.#subject3;
        return total / 3;
    }
}


// ============================================
// 2) مصفوفة حفظ الطلاب
// ============================================

const studentsList = [];


// ============================================
// 3) الإمساك بعناصر HTML باستخدام DOM
// ============================================

const studentNameInput = document.getElementById("studentName");
const subject1Input = document.getElementById("subject1");
const subject2Input = document.getElementById("subject2");
const subject3Input = document.getElementById("subject3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

// ============================================
// 3.1) تحديد حالة الطالب وعرض قائمة الطلاب
// النجاح من متوسط 50 درجة فأكثر
// ============================================

function getStudentStatus(average) {
    if (average >= 50) {
        return { text: "ناجح", className: "student-pass" };
    }

    return { text: "راسب", className: "student-fail" };
}

// عرض الطلاب. بعد تفعيل الرأفة نعرض المتوسط بعد إضافة 5
// للطلاب الذين كان متوسطهم الأصلي من 40 إلى 49.
function renderStudentsList(applyMercy) {
    studentsBox.innerHTML = "";

    if (studentsList.length === 0) {
        studentsBox.innerHTML =
            '<p class="empty-message mb-0">لم تتم إضافة أي طالب حتى الآن.</p>';
        return;
    }

    studentsList.forEach(function (student) {
        let average = student.calculateAverage();

        if (applyMercy && average >= 40 && average <= 49) {
            average += 5;
        }

        const status = getStudentStatus(average);
        const studentItem = document.createElement("div");
        studentItem.className = `student-item ${status.className}`;

        const details = document.createElement("span");
        details.textContent =
            `الطالب: ${student.name} | المتوسط: ${average.toFixed(2)} | ` +
            `الحضور: ${student.attendance}%`;

        const statusBadge = document.createElement("span");
        statusBadge.className = "status-badge";
        statusBadge.textContent = status.text;

        studentItem.appendChild(details);
        studentItem.appendChild(statusBadge);
        studentsBox.appendChild(studentItem);
    });
}

// حماية اسم الطالب عند إدراجه داخل HTML في التقرير
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



// ============================================
// 4) إضافة طالب عند الضغط على الزر
// ============================================

addStudentBtn.onclick = function () {
    // إخفاء رسالة الخطأ القديمة قبل تجربة الإضافة
    errorBox.textContent = "";
    errorBox.classList.add("d-none");

    try {
        // قراءة القيم من حقول الإدخال
        const name = studentNameInput.value;
        const subject1 = subject1Input.value;
        const subject2 = subject2Input.value;
        const subject3 = subject3Input.value;
        const attendance = attendanceInput.value;

        // إنشاء كائن جديد. الـ constructor سيشغّل التحقق من القيم.
        const newStudent = new Student(
            name,
            subject1,
            subject2,
            subject3,
            attendance
        );

        // حفظ الطالب داخل المصفوفة
        studentsList.push(newStudent);

        // عرض قائمة الطلاب مع تحديد حالة كل طالب
        renderStudentsList(false);

        // تفريغ الحقول بعد نجاح الإضافة فقط
        studentNameInput.value = "";
        subject1Input.value = "";
        subject2Input.value = "";
        subject3Input.value = "";
        attendanceInput.value = "";

        // إخفاء التقرير القديم لأنه لم يعد يعرض كل البيانات الحالية
        reportBox.innerHTML =
            '<p class="empty-message mb-0">تمت إضافة طالب جديد. اضغط على لجنة الرأفة لتحديث التقرير.</p>';

    } catch (error) {
        // عرض الخطأ للمستخدم على الشاشة وليس في Console
        errorBox.textContent = error.message;
        errorBox.classList.remove("d-none");
    }
};


// ============================================
// 5) لجنة الرأفة: Filter + Map + Reduce
// ============================================

mercyBtn.onclick = function () {
    errorBox.textContent = "";
    errorBox.classList.add("d-none");

    if (studentsList.length === 0) {
        reportBox.innerHTML =
            '<p class="text-danger mb-0">لا يوجد طلاب في القائمة. أضف طالباً أولاً.</p>';
        return;
    }

    // تحديث حالة الطلاب في القائمة بعد تفعيل الرأفة
    renderStudentsList(true);

    // Filter: اختيار الطلاب الذين متوسطهم من 40 إلى 49
    const strugglingStudents = studentsList.filter(function (student) {
        const average = student.calculateAverage();
        return average >= 40 && average <= 49;
    });

    // منع القسمة على صفر إذا لم يوجد طلاب متعثرون
    if (strugglingStudents.length === 0) {
        reportBox.innerHTML = `
            <div class="report-summary">
                <strong>عدد الطلاب المتعثرين:</strong> 0
            </div>
            <p class="mb-0">لا يوجد طلاب متوسط درجاتهم بين 40 و49، لذلك لا توجد درجات رأفة لإضافتها.</p>
        `;
        return;
    }

    // Map: إنشاء بيانات تقرير جديدة وإضافة 5 درجات لكل متوسط
    const mercyResults = strugglingStudents.map(function (student) {
        const oldAverage = student.calculateAverage();

        return {
            name: student.name,
            oldAverage: oldAverage,
            newAverage: oldAverage + 5
        };
    });

    // Reduce: جمع المتوسطات الجديدة
    const totalNewAverages = mercyResults.reduce(function (total, student) {
        return total + student.newAverage;
    }, 0);

    // حساب المتوسط العام بعد الرأفة
    const generalAverage = totalNewAverages / mercyResults.length;

    // تجهيز أسماء الطلاب باستخدام Template Literals
    const studentsHTML = mercyResults.map(function (student) {
        const status = getStudentStatus(student.newAverage);
        const safeName = escapeHTML(student.name);

        return `
            <div class="report-item ${status.className}">
                <strong>${safeName}</strong>
                <span>المتوسط قبل الرأفة: ${student.oldAverage.toFixed(2)}</span>
                <span>المتوسط بعد إضافة 5 درجات: ${student.newAverage.toFixed(2)}</span>
                <span class="status-badge">${status.text}</span>
            </div>
        `;
    }).join("");

    // عرض التقرير النهائي على الشاشة
    reportBox.innerHTML = `
        <div class="report-summary">
            <p class="mb-1"><strong>عدد الطلاب المتعثرين:</strong> ${mercyResults.length}</p>
            <p class="mb-0"><strong>المتوسط العام بعد الرأفة:</strong> ${generalAverage.toFixed(2)}</p>
        </div>

        <h3 class="h5 section-title mb-3">أسماء الطلاب ونتائجهم</h3>
        ${studentsHTML}
    `;
};
