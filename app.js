//Defining the state of the application(State are those Data whose value is going to be changed: Amount,Expense,Income etc.)
var state = {
    balance: 0,
    income: 200,
    expense: 400,
    //Whenever we have same kind of multiple values, we use arrays.
    transactions: [
        // { id: uniqueId(), name: "Salary", amount: 5000, type: "income" },
        // { id: uniqueId(), name: "Buy Grocery", amount: 50, type: "expense" },
        // { id: uniqueId(), name: "Buy Guitar", amount: 100, type: "expense" },

    ],
};

// =================QUERY SELECTORS========================

var balanceEl = document.querySelector("#balance");
var incomeEL = document.querySelector("#income");
var expenseEL = document.querySelector("#expense");
var trasactionsEL = document.querySelector("#transaction");
var incomeBtnEL = document.querySelector("#income-btn");
var expenseBtnEL = document.querySelector("#expense-btn");
var nameInputEL = document.querySelector("#name");
var amountInputEL = document.querySelector("#amount");

//// =================FUNCTIONS========================

function init() {
    var localstate = JSON.parse(localStorage.getItem("expenseTrackerState"));

    if(localstate!== null){
        state = localstate;
    }
    updateState();
    initListeners();
}

function uniqueId(){
    return Math.round(Math.random() * 10000000);
}

function initListeners() {
    incomeBtnEL.addEventListener("click", onAddIncomeClick);
    expenseBtnEL.addEventListener("click", onAddExpenseClick);
}

function addTransaction(type){
    var name = nameInputEL.value;
    var amount =amountInputEL.value;
    if (name !== "" && amount !== "") {
        var transaction = {
            name: name,
            amount: parseInt(amount),
            type: type,
        };

        state.transactions.push(transaction);
        updateState();
    } else {
        alert("Please enter valid data");
    }

    nameInputEL.value = "";
    amountInputEL.value = "";
}

function onAddIncomeClick() {
    var type = "income"
    addTransaction(type); 
}

function onAddExpenseClick() {
    var type = "expense";
    addTransaction(type);
}

function OnDeleteClick(event){
   var id = parseInt(event.target.getAttribute('data-id'));
   var deleteIndex;
   for( var i =0; i<state.transactions.length; i++){
       if(state.transactions[i].id === id){
          deleteIndex=i;
          break;
       }
   }
   state.transactions.splice(deleteIndex,1)

   updateState();
}

function updateState() {
    var balance = 0,
        income = 0,
        expense = 0,
        item;
    for (var i = 0; i < state.transactions.length; i++) {
        item = state.transactions[i];

        if (item.type === "income") {
            income += item.amount;
        } else {
            expense += item.amount;
        }
    }

    balance = income - expense;

    state.balance = balance;
    state.income = income;
    state.expense = expense;

    localStorage.setItem("expenseTrackerState", JSON.stringify(state))

    render();
}

function render() {
    balanceEl.innerHTML = `$${state.balance}`;
    incomeEL.innerHTML = `$${state.income}`;
    expenseEL.innerHTML = `$${state.expense}`;
    // trasactionsEL.innerHTML = `$${state.expense}`;
    var trasactionEL, transactionDIV, transactionSPAN, transactionBUTTON;

    trasactionsEL.innerHTML = "";

    for (var i = 0; i < state.transactions.length; i++) {
        //Creation of EL elemnt
        trasactionEL = document.createElement("li");
        trasactionEL.append(state.transactions[i].name);
        trasactionsEL.append(trasactionEL);

        //Creation of Div, Span and Button
        transactionDIV = document.createElement("div");
        trasactionEL.append(transactionDIV);
        transactionSPAN = document.createElement("span");
        if (state.transactions[i].type === "income") {
            transactionSPAN.classList.add("income-amt");
        } else {
            transactionSPAN.classList.add("expense-amt");
        }
        transactionSPAN.innerHTML = `$${state.transactions[i].amount}`;
        transactionDIV.appendChild(transactionSPAN);
        transactionBUTTON = document.createElement("button");
        transactionBUTTON.setAttribute("data-id", state.transactions[i].id);
        transactionBUTTON.innerHTML = `X`;

        transactionBUTTON.addEventListener('click' ,OnDeleteClick)
        transactionDIV.appendChild(transactionBUTTON);
    }
}

init();
