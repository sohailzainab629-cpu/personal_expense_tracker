import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhx8VNqu98Zk2ecnFYreUesRsp77nrVAE",
    authDomain: "personal-expense-tracker-43648.firebaseapp.com",
    projectId: "personal-expense-tracker-43648",
    storageBucket: "personal-expense-tracker-43648.firebasestorage.app",
    messagingSenderId: "291185712398",
    appId: "1:291185712398:web:5a7b3af5c2d7eeccf04b5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML Elements
const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.getElementById("expenseTableBody");
const totalExpenses = document.getElementById("totalExpenses");
const totalAmount = document.getElementById("totalAmount");

// Load expenses when page opens
loadExpenses();

// Add Expense
expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    try {
        await addDoc(collection(db, "expenses"), {
            title: title,
            amount: amount,
            category: category,
            date: date
        });

        alert("Expense added successfully!");

        expenseForm.reset();

        loadExpenses();

    } catch (error) {
        console.error("Error adding expense:", error);
        alert("Error adding expense. Check Firestore setup.");
    }
});

// Load Expenses
async function loadExpenses() {

    try {
        const querySnapshot = await getDocs(collection(db, "expenses"));

        expenseTableBody.innerHTML = "";

        let total = 0;
        let count = 0;

        if (querySnapshot.empty) {
            expenseTableBody.innerHTML = `
                <tr>
                    <td colspan="5">No expenses added yet.</td>
                </tr>
            `;
        }

        querySnapshot.forEach((document) => {

            const expense = document.data();

            total += Number(expense.amount);
            count++;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.title}</td>
                <td>Rs. ${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button onclick="deleteExpense('${document.id}')">
                        Delete
                    </button>
                </td>
            `;

            expenseTableBody.appendChild(row);
        });

        totalExpenses.textContent = count;
        totalAmount.textContent = `Rs. ${total.toFixed(2)}`;

    } catch (error) {
        console.error("Error loading expenses:", error);
        expenseTableBody.innerHTML = `
            <tr>
                <td colspan="5">Error loading expenses.</td>
            </tr>
        `;
    }
}

// Delete Expense
window.deleteExpense = async function (id) {

    if (!confirm("Are you sure you want to delete this expense?")) {
        return;
    }

    try {
        await deleteDoc(doc(db, "expenses", id));

        alert("Expense deleted successfully!");

        loadExpenses();

    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Error deleting expense.");
    }
};