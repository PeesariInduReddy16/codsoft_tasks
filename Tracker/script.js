/* =========================================
   FINORA EXPENSE TRACKER
   JAVASCRIPT
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const form =
    document.getElementById("transactionForm");

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amountInput");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const noteInput =
    document.getElementById("note");

const transactionList =
    document.getElementById("transactionList");

const incomeDisplay =
    document.getElementById("income");

const expenseDisplay =
    document.getElementById("expenses");

const balanceDisplay =
    document.getElementById("balance");

const searchInput =
    document.getElementById("searchInput");

const filterCategory =
    document.getElementById("filterCategory");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const formTitle =
    document.getElementById("formTitle");

const toast =
    document.getElementById("toast");


/* =========================================
   DATA
========================================= */

let transactions =
    JSON.parse(
        localStorage.getItem(
            "finoraTransactions"
        )
    ) || [];


let editingId = null;


/* =========================================
   CATEGORY ICONS
========================================= */

const categoryIcons = {

    Salary: "💼",

    Food: "🍔",

    Shopping: "🛍️",

    Transport: "🚗",

    Bills: "💡",

    Entertainment: "🎬",

    Education: "📚",

    Health: "❤️",

    Other: "📌"

};


/* =========================================
   DEFAULT DATE
========================================= */

function setToday() {

    dateInput.value =
        new Date()
            .toISOString()
            .split("T")[0];

}

setToday();


/* =========================================
   SAVE TRANSACTIONS
========================================= */

function saveTransactions() {

    localStorage.setItem(

        "finoraTransactions",

        JSON.stringify(transactions)

    );

}


/* =========================================
   CURRENCY FORMAT
========================================= */

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateSummary() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount);


        if (transaction.type === "income") {

            totalIncome += amount;

        } else {

            totalExpenses += amount;

        }

    });


    const balance =
        totalIncome - totalExpenses;


    incomeDisplay.textContent =
        formatCurrency(totalIncome);


    expenseDisplay.textContent =
        formatCurrency(totalExpenses);


    balanceDisplay.textContent =
        formatCurrency(balance);


    /* Negative balance indicator */

    if (balance < 0) {

        balanceDisplay.style.color =
            "var(--expense)";

    } else {

        balanceDisplay.style.color =
            "var(--primary)";

    }

}


/* =========================================
   DISPLAY TRANSACTIONS
========================================= */

function displayTransactions() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        filterCategory.value;


    let filtered =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.title
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =

                selectedCategory === "all"

                ||

                transaction.category ===
                selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    /* Newest first */

    filtered.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    transactionList.innerHTML = "";


    /* Empty state */

    if (filtered.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💸
                </div>

                <h3>
                    No transactions found
                </h3>

                <p>
                    Add your first transaction
                    to start tracking your money.
                </p>

            </div>

        `;

        return;

    }


    /* Generate transactions */

    filtered.forEach(transaction => {

        const element =
            document.createElement("div");


        element.className =
            "transaction";


        const icon =
            categoryIcons[
                transaction.category
            ] || "💰";


        const sign =
            transaction.type === "income"
            ? "+"
            : "-";


        element.innerHTML = `

            <div
                class="transaction-icon
                ${transaction.type}"
            >
                ${icon}
            </div>


            <div class="transaction-info">

                <div class="transaction-name">

                    ${escapeHTML(
                        transaction.title
                    )}

                </div>


                <div class="transaction-meta">

                    <span>
                        ${formatDate(
                            transaction.date
                        )}
                    </span>

                    <span
                        class="transaction-category"
                    >
                        ${escapeHTML(
                            transaction.category
                        )}
                    </span>

                </div>

            </div>


            <div class="transaction-right">

                <div
                    class="
                    transaction-amount
                    ${transaction.type}
                    "
                >

                    ${sign}

                    ${formatCurrency(
                        transaction.amount
                    )}

                </div>


                <div class="transaction-actions">

                    <button
                        class="action-btn"
                        onclick="
                            editTransaction(
                                '${transaction.id}'
                            )
                        "
                        title="Edit"
                    >
                        ✏️
                    </button>


                    <button
                        class="
                        action-btn
                        delete-btn
                        "
                        onclick="
                            deleteTransaction(
                                '${transaction.id}'
                            )
                        "
                        title="Delete"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;


        transactionList.appendChild(
            element
        );

    });

}


/* =========================================
   ESCAPE USER INPUT
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =========================================
   FORM SUBMIT
========================================= */

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const type =
            document.querySelector(
                'input[name="type"]:checked'
            ).value;


        const title =
            titleInput.value.trim();


        const amount =
            Number(amountInput.value);


        const category =
            categoryInput.value;


        const date =
            dateInput.value;


        const note =
            noteInput.value.trim();


        /* Validation */

        if (!title) {

            showToast(
                "Please enter a description."
            );

            titleInput.focus();

            return;

        }


        if (!amount || amount <= 0) {

            showToast(
                "Enter a valid amount."
            );

            amountInput.focus();

            return;

        }


        if (!category) {

            showToast(
                "Please select a category."
            );

            categoryInput.focus();

            return;

        }


        if (!date) {

            showToast(
                "Please select a date."
            );

            dateInput.focus();

            return;

        }


        /* EDIT */

        if (editingId) {

            const index =
                transactions.findIndex(
                    transaction =>
                        transaction.id ===
                        editingId
                );


            if (index !== -1) {

                transactions[index] = {

                    ...transactions[index],

                    type,

                    title,

                    amount,

                    category,

                    date,

                    note

                };

            }


            showToast(
                "Transaction updated successfully!"
            );


            editingId = null;


            formTitle.textContent =
                "Add Transaction";


            submitBtn.textContent =
                "+ Add Transaction";


            cancelBtn.style.display =
                "none";

        }


        /* ADD */

        else {

            const transaction = {

                id:
                    Date.now().toString(),

                type,

                title,

                amount,

                category,

                date,

                note

            };


            transactions.push(
                transaction
            );


            showToast(
                "Transaction added successfully!"
            );

        }


        /* SAVE */

        saveTransactions();


        updateSummary();


        displayTransactions();


        /* RESET */

        form.reset();


        setToday();


        document.getElementById(
            "incomeType"
        ).checked = true;

    }
);


/* =========================================
   EDIT
========================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) return;


    editingId = id;


    titleInput.value =
        transaction.title;


    amountInput.value =
        transaction.amount;


    categoryInput.value =
        transaction.category;


    dateInput.value =
        transaction.date;


    noteInput.value =
        transaction.note || "";


    document.querySelector(
        `input[name="type"][value="${transaction.type}"]`
    ).checked = true;


    formTitle.textContent =
        "Edit Transaction";


    submitBtn.textContent =
        "✓ Update Transaction";


    cancelBtn.style.display =
        "block";


    document.querySelector(
        ".form-panel"
    ).scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =========================================
   DELETE
========================================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) return;


    const confirmed =
        confirm(
            `Delete "${transaction.title}"?`
        );


    if (!confirmed) return;


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );


    saveTransactions();


    updateSummary();


    displayTransactions();


    showToast(
        "Transaction deleted."
    );

}


/* =========================================
   CANCEL EDIT
========================================= */

cancelBtn.addEventListener(
    "click",
    function() {

        editingId = null;


        form.reset();


        setToday();


        document.getElementById(
            "incomeType"
        ).checked = true;


        formTitle.textContent =
            "Add Transaction";


        submitBtn.textContent =
            "+ Add Transaction";


        cancelBtn.style.display =
            "none";

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    displayTransactions
);


/* =========================================
   CATEGORY FILTER
========================================= */

filterCategory.addEventListener(
    "change",
    displayTransactions
);


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================
   INITIALIZE
========================================= */

updateSummary();

displayTransactions();