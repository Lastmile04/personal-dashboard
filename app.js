// ============================================
// GET ALL DOM ELEMENTS
// ============================================

// Notes widget DOM elements
const notesTextarea = document.getElementById('notes-textarea');
const saveNoteBtn = document.getElementById('save-note-btn');
const noteList = document.querySelector('.notes-list');  
const emptyState = document.querySelector('.empty-state');  

// Quotes widget DOM elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quotesErrorContainer = document.querySelector('.quotes-error-container');

// Calendar widget DOM elements
const day = document.querySelector('.calendar-dates');
const currdate = document.querySelector('.calendar-current-date');
const prenexIcons = document.querySelectorAll('.calendar-navigation span');

// Habit tracker widget DOM elements
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');
const habitEmptyState = document.querySelector('.empty-habit-state');
const habitList = document.getElementById('habitList');
const addNewHabitBtn = document.getElementById('add-habit-btn');
const addHabitForm = document.getElementById('add-habit-form');
const newHabitInput = document.getElementById('new-habit-input');
const saveHabitBtn = document.getElementById('save-habit-btn');
const cancelHabitBtn = document.getElementById('cancel-habit-btn');
const trackerHabit = document.querySelector('.tracker-header');
const habitListContainer = document.querySelector('.habit-list-container');
const habitInputState = document.querySelector('.habit-input-state');
const habitDisplayState = document.querySelector('.habit-display-state');
const trackerHeader = document.querySelector('.tracker-header');

// Expense tracker widget DOM elements
const balance = document.getElementById('balance');
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const transactionList = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

// your api key for weather widget will come here if you have any
const APIkey = 'lOpYTIhA0AL16zS1PcsWyA==nosym8wUh8toOYKi';

// ============================================
// NOTES WIDGET
// ============================================

// Initialize notes array from localStorage
let storedNotes = localStorage.getItem('notes');
let notes;

try {
    notes = storedNotes ? JSON.parse(storedNotes) : [];
    if (!Array.isArray(notes)) notes = [];
} catch (error) {
    console.error('Error loading notes:', error);
    notes = [];
}

// Update localStorage function
function updateLocalStorageNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Add new note function
function addNotes() {
    const noteText = notesTextarea.value.trim();
    
    if (noteText === '') {
        return; // Don't add empty notes
    }
    
    const note = {
        id: Date.now(),  
        text: noteText,
        completed: false,
    };
    
    notes.push(note);
    notesTextarea.value = '';
    updateAndRender();
}

// Render notes function
function renderNotes() {
    noteList.innerHTML = '';
    
    notes.forEach(note => {
        const item = document.createElement('li');
        item.setAttribute('data-id', note.id);
        item.className = 'note-item';
        
        if (note.isNew) {
            item.classList.add('newly-checked');
            delete note.isNew;
        }
        
        if (note.completed) {
            item.classList.add('completed');
        }
        
        item.innerHTML = `
        <label class = 'checkbox-container'>
            <input type = "checkbox" class ='note-checkbox' ${note.completed ? 'checked' : ''} />
            <span class = 'checkmark'></span>
        </label>
        <span class = 'note-item-text'>${note.text}</span>
        <button class = 'delete-note-btn' data-id="${note.id}">
            <i class="fa-solid fa-x"></i>
        </button>
        `;
        
        noteList.appendChild(item);
    });
    handleEmptyState();
}

// Handle empty state
function handleEmptyState() {
    if (notes.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// Update and render
function updateAndRender() {
    renderNotes();
    updateLocalStorageNotes();
}

// ============================================
// EVENT LISTENERS - NOTES WIDGET
// ============================================

// Save note button click
saveNoteBtn.addEventListener('click', addNotes);

// Enter key to save note
notesTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent newline in textarea
        addNotes();
    }
});

// Note list click events (checkbox and delete)
noteList.addEventListener('click', (e) => {
    const item = e.target.closest('.note-item');  // 
    
    if (!item) {
        return;
    }
    
    const id = Number(item.dataset.id);

// * Info: Did some changes in this to handle some errors
    // Handle checkbox toggle
    if (e.target.matches('.checkbox-container, .notes-checkbox, .checkmark')) {
        const note = notes.find(n => n.id === id);
        if (note) {
            // if (!note.completed) {
            //     note.isNew = true;
            // }
            note.completed = !note.completed;
        }
        updateAndRender();
    }

// * Info: Did some changes in this to handle some errors
    // Handle delete button
    if (e.target.matches('.delete-note-btn, .delete-note-btn *')) {  
        const deleteBtn = e.target.closest('.delete-note-btn');
        if (deleteBtn) {
            const noteId = Number(deleteBtn.dataset.id);
            notes = notes.filter(n => n.id !== noteId);
            updateAndRender();
        }
    }
});



// ============================================
// INITIALIZE
// ============================================

// Weather widget script
!function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
        js=d.createElement(s);
        js.id=id;
        js.src='https://weatherwidget.io/js/widget.min.js';
        fjs.parentNode.insertBefore(js,fjs);
    }
}(document,'script','weatherwidget-io-js');

// Initialize notes widget
updateAndRender();



// ============================================
// CALENDAR WIDGET
// ============================================

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const months = [
    "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let clickedDay = null;
let selectedDayElement = null;

const manipulate = () =>{
    // to get the day on the first day of current month
    let dayone = new Date(year, month, 1).getDay();
    // to get the last date of current month {month+1 is used because js when you put 0 in the
    // date number parameter js automatically goes one day back/before the current month}
    let lastdate = new Date(year, month + 1, 0).getDate();
    // to get the day of the last date of current month 
    let dayend = new Date(year, month, lastdate).getDay();
    // to the last date of the previous month from the current month 
    let monthlastdate = new Date(year, month, 0).getDate();

    let lit = "";

    // loop to get the inactive dates on the calendar that appear at the top from previous month
    for(let i = dayone; i > 0; i--){
        lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    // to render the current month dates
    for(let i = 1; i <= lastdate; i++){
        // checks if the current loop date(i) is today's actual date
        let isToday = (i === date.getDate() 
            && month === new Date().getMonth() 
            && year === new Date().getFullYear()) ? "active" : "";

        let highlightClass = (clickedDay === i) ? "highlight" : "";

        // add to the list of tobe rendered numbers add classes highlight and active 
        // also add custom attribute that stores the day number, then show the number inside li tag
        lit += `<li class= "${isToday} ${highlightClass}" data-day= "${i}">${i}</li>`;
    }

    // to show inactive dates of the next month at the bottom of calendar
    for(let i = dayend; i < 6; i++){
        lit += `<li class = "inactive">${i - dayend + 1}</li>`;
    }
    
    // to display Month and year at the top
    currdate.innerText = `${months[month]} ${year}`;
    // assigning the list of days
    day.innerHTML = lit;

    addClickListenerToDays();
}

function addClickListenerToDays(){
    const allDays = day.querySelectorAll(`li:not(.inactive)`);
    allDays.forEach(li => {
        li.addEventListener('click', ()=>{
            if(selectedDayElement){
                selectedDayElement.classList.remove('highlight');
            }

            li.classList.add('highlight');
            selectedDayElement = li;

            clickedDay = parseInt(li.getAttribute('data-day'));

            console.log('Clicked day:', clickedDay)
        });
    });
}

manipulate();

prenexIcons.forEach(icon =>{
    icon.addEventListener('click', ()=>{
        month = icon.id === 'calendar-prev' ? month - 1: month + 1;

        if(month< 0 || month > 11){
            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();
        }else{
            date = new Date();
        }

        clickedDay = null;
        selectedDayElement = null;

        manipulate();
    });
});



// ============================================
// QUOTES WIDGET
// ============================================

// async function fetchQuotes() {
//     try {
//         const response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random');
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('data: ', data);
//         displayQuotes(data[0]);
//     } catch (error) {
//         quoteError(error);
//     }
// }

// function displayQuotes(data){
//     quoteText.textContent = data.q;
//     quoteAuthor.textContent = `-${data.a}`;
// }

// function quoteError(error){
//     console.error('Error fetching quote:', error);
//     quoteText.textContent = 'Unable to load quote. Please try to refresh the page.';
//     quoteAuthor.textContent = '';
// }


// fetchQuotes();

// Config
const API_NINJAS_KEY = 'lOpYTIhA0AL16zS1PcsWyA==nosym8wUh8toOYKi'; // your key
const QUOTE_MIN_CHARS = 160;   // adjust to make quotes longer/shorter
const QUOTE_MAX_CHARS = 320;   // upper bound (prevents huge overflow)
const MAX_RETRIES = 6;         // how many attempts to try before falling back

// DOM elements (existing vars at top of file already defined)
// const quoteText = document.getElementById('quote-text');
// const quoteAuthor = document.getElementById('quote-author');
// const quotesErrorContainer = document.querySelector('.quotes-error-container');

// locate the quote container used for sizing - fall back gracefully
const quoteCardEl = document.querySelector('.quotes-widget .quote-content') || document.querySelector('.quotes-widget') || quoteText?.parentElement;

// Local fallback long quotes (used if external APIs fail)
const LOCAL_LONG_QUOTES = [
  { quote: "Simplicity is the soul of efficiency. Build small, iterate fast, and let momentum carry you forward as you refine what truly matters.", author: "Unknown" },
  { quote: "We are what we repeatedly do. Excellence then, is not an act but a habit that is formed by dedication to consistent practice and small improvements.", author: "Aristotle (paraphrased)" },
  { quote: "To live fully is to be always in no-man's-land, to experience each moment as completely new and fresh — cultivating curiosity and compassion as the ground of everything you do.", author: "Pema Chödrön" },
  { quote: "The greatest threat to our progress is not failure but the fear of taking the next small step; start small, learn quickly, and keep moving.", author: "Unknown" }
];

// Helper: put quote into DOM
function setQuoteDOM(q) {
  if (!quoteText) return;
  quoteText.textContent = `"${(q.quote || q.text || q.content || '').trim()}"`;
  if (quoteAuthor) quoteAuthor.textContent = q.author ? `- ${q.author}` : '- Unknown';
  // clear any previous error message
  if (quotesErrorContainer) quotesErrorContainer.textContent = '';
  // try to auto-scale to fill the widget better
  autoScaleQuoteFont();
}

// Auto-scale font-size so the quote fits nicely in the quotes card and fills it
function autoScaleQuoteFont() {
  if (!quoteText || !quoteCardEl) return;
  const MAX_FONT_PX = 22;
  const MIN_FONT_PX = 12;
  const PADDING_SPACE = 20; // breathing room in px

  let font = MAX_FONT_PX;
  quoteText.style.fontSize = font + 'px';

  // If content overflows the card, shrink until it fits or until MIN_FONT_PX
  while (font > MIN_FONT_PX) {
    const contentHeight = quoteText.scrollHeight + PADDING_SPACE;
    const containerHeight = quoteCardEl.clientHeight || Math.round(window.innerHeight * 0.22);
    if (contentHeight <= containerHeight) break;
    font -= 1;
    quoteText.style.fontSize = font + 'px';
  }

  // If there's a lot of spare space, grow a little (without exceeding MAX)
  while (font < MAX_FONT_PX) {
    const contentHeight = quoteText.scrollHeight + PADDING_SPACE;
    const containerHeight = quoteCardEl.clientHeight || Math.round(window.innerHeight * 0.22);
    if (contentHeight + 28 >= containerHeight) break;
    font += 1;
    quoteText.style.fontSize = font + 'px';
  }
}

// Try API Ninjas (uses the key). Returns normalized {quote, author}
async function fetchFromApiNinjasOnce() {
  const url = 'https://api.api-ninjas.com/v2/randomquotes'; // endpoint returns an object or array
  const res = await fetch(url, {
    headers: { 'X-Api-Key': API_NINJAS_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('API Ninjas HTTP ' + res.status);
  const json = await res.json();
  // API may return array or object depending on endpoint/version
  const item = Array.isArray(json) ? json[0] : json;
  // item commonly has fields like {quote: "...", author: "..."} or similar
  const text = (item.quote || item.text || item.content || '').trim();
  const author = item.author || item.authorName || item.author_name || item.source || 'Unknown';
  return { quote: text, author };
}

// Try multiple times until a quote fits desired length (or return last)
async function getLongQuoteFromNinjas(minChars = QUOTE_MIN_CHARS, maxChars = QUOTE_MAX_CHARS) {
  let lastGood = null;
  for (let i = 0; i < MAX_RETRIES; i++) {
    const q = await fetchFromApiNinjasOnce();
    if (!q || !q.quote) continue;
    lastGood = q;
    const n = q.quote.length;
    if (n >= minChars && n <= maxChars) return q;
    // if too short or too long, try again (until retries exhausted)
  }
  // if nothing matched perfectly, return the last fetched quote (if any)
  if (lastGood) return lastGood;
  throw new Error('No quote from API Ninjas');
}

// Fallback: try simple ZenQuotes endpoint (no key). Normalizes response.
async function fetchFromZenQuotes() {
  const res = await fetch('https://zenquotes.io/api/random', {cache: 'no-store'});
  if (!res.ok) throw new Error('ZenQuotes HTTP ' + res.status);
  const arr = await res.json();
  if (!Array.isArray(arr) || !arr[0]) throw new Error('ZenQuotes no data');
  return { quote: arr[0].q, author: arr[0].a || 'Unknown' };
}

// Main function to fetch & display a long quote (tries API Ninjas -> ZenQuotes -> local)
async function fetchQuotes() {
  // show a friendly loading text
  if (quoteText) quoteText.textContent = 'Loading quote...';

  // 1) Try API Ninjas with retries & length filtering
  try {
    const q = await getLongQuoteFromNinjas(QUOTE_MIN_CHARS, QUOTE_MAX_CHARS);
    if (q && q.quote) {
      setQuoteDOM(q);
      return;
    }
  } catch (e) {
    console.warn('API Ninjas failed:', e);
    if (quotesErrorContainer) quotesErrorContainer.textContent = 'Primary quotes API failed — using fallback.';
  }

  // 2) Try ZenQuotes as a no-key fallback
  try {
    const z = await fetchFromZenQuotes();
    if (z && z.quote) {
      // if it's too short, try to pad by selecting a longer local fallback instead
      if (z.quote.length < QUOTE_MIN_CHARS) {
        // pick local long one instead to avoid short quotes
        const local = LOCAL_LONG_QUOTES[Math.floor(Math.random() * LOCAL_LONG_QUOTES.length)];
        setQuoteDOM(local);
      } else {
        setQuoteDOM(z);
      }
      return;
    }
  } catch (e) {
    console.warn('ZenQuotes failed:', e);
  }

  // 3) Final: local fallback
  const fallback = LOCAL_LONG_QUOTES[Math.floor(Math.random() * LOCAL_LONG_QUOTES.length)];
  setQuoteDOM(fallback);
}

// Show error in UI (keeps a friendly message)
function quoteError(message) {
  console.error('Quote Error:', message);
  if (quoteText) quoteText.textContent = 'Unable to load quote. Please try to refresh the page.';
  if (quoteAuthor) quoteAuthor.textContent = '';
  if (quotesErrorContainer) quotesErrorContainer.textContent = message ? String(message) : '';
}

// Kick off on load
fetchQuotes().catch(err => {
  // ensure error is visible but do not break app
  quoteError(err && err.message ? err.message : err);
});



// ============================================
// HABIT TRACKER WIDGET
// ============================================

let storedHabits = localStorage.getItem('habits');
let habits;
try {
    // if there are stored habits then create a JSON object else initialize an empty array
    habits = storedHabits ? JSON.parse(storedHabits) : [];
    // double check if the habits are an array if not then initialize an empty array named habit
    if(!Array.isArray(habits)) habits = [];
} catch (error) {
    habits = [];
}

// Update local storage function
function updateLocalStorageHabit(){
    localStorage.setItem('habits', JSON.stringify(habits));
}

// progress bar function
function updateProgressBar() {
    const total = habits.length;
    const completedCount = habits.filter(habit => habit.completed).length;
    const percentage = total > 0 ? (completedCount / total) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${completedCount}/${total}`;
}

// habit counter function
// function updateHabitsLeft(){
//     const activeHabitsCounter = habits.filter(habit => !habit.completed).length;
//     displayHabitsLeft(activeHabitsCounter);
// }

newHabitInput.addEventListener('input', () => {
    saveHabitBtn.disabled = newHabitInput.value.trim() === "";
});

// to add habits to the habits array
function addHabits(){
    const input = newHabitInput.value.trim();
    if (input === "") {
        console.error('Enter a habit first before saving.')
        return; // Do nothing if empty
    }
    const habit = {
        id: Date.now(),
        text: newHabitInput.value.trim(),
        completed: false,
    }
    habits.push(habit);
    newHabitInput.value = '';
    saveHabitBtn.disabled = true;
    updateAndRenderHabit();
}

// render habits
function renderHabits(){
    if(habitListContainer.classList.contains('hidden')){
        habitListContainer.classList.remove('hidden');
    }
    habitList.innerHTML = '';
    handleEmptyStateHabit();
    habits.forEach(habit =>{
        const item = document.createElement('li');
        item.setAttribute('data-id', habit.id);
        item.className = 'habit-item';
        if(habit.isNew){
            item.classList.add('newly-checked');
            delete habit.isNew;
        }
        if(habit.completed){
            item.classList.add('completed');
        }
        item.innerHTML = `
        <label class="checkbox-container">
            <input type="checkbox" class="habits-checkbox" ${habit.completed ? 'checked' : ''}/>
            <span class = 'checkmark'></span>
        </label>
        <span class="habit-text">${habit.text}</span>
            <button class="delete-habit-btn" data-id="${habit.id}">
                <i class="fa-solid fa-x"></i>
            </button>
        `
        habitList.appendChild(item);
    });
}

// handle empty space
function handleEmptyStateHabit(){
    if(habits.length === 0){
        showEmptyState();
    }
    else{
        showDisplayState();
    }
}

// display items left
// function displayHabitsLeft(completedCount){
//     progressText.textContent = `${completedCount}/${habits.length}`;
// }

// function to update all at once
function updateAndRenderHabit(){
    renderHabits();
    // updateHabitsLeft();
    updateLocalStorageHabit();
    updateProgressBar();
}

// show empty state
function showEmptyState(){
    trackerHeader.classList.remove('hidden');
    habitEmptyState.classList.remove('hidden');
    habitDisplayState.classList.add('hidden');
    habitInputState.classList.add('hidden');
    addNewHabitBtn.classList.remove('hidden');
}

// show display state
 function showDisplayState(){
    trackerHeader.classList.remove('hidden');
    habitEmptyState.classList.add('hidden');
    habitDisplayState.classList.remove('hidden');
    habitInputState.classList.add('hidden');
    addNewHabitBtn.classList.remove('hidden');
 }

//  show input form
function showInputState() {
    habitEmptyState.classList.add('hidden');
    habitDisplayState.classList.add('hidden');
    habitInputState.classList.remove('hidden');
    addNewHabitBtn.classList.add('hidden');
    trackerHeader.classList.add('hidden');
}

// Update your displayHabitForm
function displayHabitForm(){
    showInputState();
}

// Event Listener
addNewHabitBtn.addEventListener('click', displayHabitForm);
saveHabitBtn.addEventListener('click', addHabits);
newHabitInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
        addHabits();
    }
});

cancelHabitBtn.addEventListener('click', (e)=>{
    newHabitInput.value='';
    handleEmptyStateHabit();
});

habitList.addEventListener('click', (e)=>{
    const item = e.target.closest('.habit-item');
    if(!item){
        return;
    }
    const id = Number(item.dataset.id);
    if(e.target.matches('.delete-habit-btn, .delete-habit-btn *' )){
        habits = habits.filter(habit => habit.id !== id);
    }
    if(e.target.matches('.checkbox-container, .habits-checkbox, .checkmark')){
        const habit = habits.find(h => h.id === id);
        if(habit){
            if(!habit.completed){
                habit.isNew = true;
            }
            habit.completed = !habit.completed;
        }
    }
    updateAndRenderHabit();
});

updateAndRenderHabit();



// ============================================
// EXPENSE TRACKER
// ============================================

// Check for saved transactions in local storage
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// Initialize transactions array
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// --- FUNCTIONS ---

/**
 * Add a new transaction from the form
 * @param {Event} e - The form submission event
 */
function addTransaction(e) {
    e.preventDefault();

    // Basic validation
    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert("Please add a description and amount");
        return;
    }

    // Create new transaction object
    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: +amountInput.value, // Convert amount to a number
    };

    // Add transaction to the array
    transactions.push(transaction);

    // Add transaction to the DOM
    displayTransaction(transaction);

    // Update balance, income, and expense
    updateValues();

    // Update local storage
    updateLocalStorage();

    // Clear input fields
    descriptionInput.value = "";
    amountInput.value = "";
}

/**
 * Generate a unique random ID
 * @returns {number} - A random number
 */
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

/**
 * Add a transaction to the DOM list
 * @param {object} transaction - The transaction object {id, description, amount}
 */
function displayTransaction(transaction) {
    // FIX: Check transaction.amount, not the global amountInput.value
    const sign = transaction.amount < 0 ? '-' : '+';
    const itemClass = transaction.amount < 0 ? 'expense' : 'income';

    // Create list item element
    const item = document.createElement('li');

    // Add class and content
    item.classList.add('transaction', itemClass);
    item.innerHTML = `
        ${transaction.description}
        <div>
            <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa-solid fa-delete-left"></i></button>
        </div>
    `;

    // Append item to the transaction list
    transactionList.appendChild(item);
}

/**
 * Update the balance, income, and expense summaries
 */
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // FIX: Multiply by -1 to display expense as a positive number
    const expense = (
        amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    // FIX: Add currency symbol to display
    balance.textContent = `₹${total}`;
    incomeAmount.textContent = `₹${income}`;
    expenseAmount.textContent = `₹${expense}`;
}

/**
 * Update local storage with current transactions
 */
function updateLocalStorage() {
    // FIX: Use plural 'transactions' to match the key used for getting items
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

/**
 * Remove a transaction by its ID
 * @param {number} id - The ID of the transaction to remove
 */
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    init(); // Re-render the list
}

/**
 * Initialize the application
 */
function init() {
    // Clear the list before repopulating
    transactionList.innerHTML = '';
    // FIX: Call displayTransaction for each item, not addTransaction()
    transactions.forEach(displayTransaction);
    updateValues();
}

// --- EVENT LISTENERS ---
// FIX: Attach listener to the specific form element
transactionForm.addEventListener("submit", addTransaction);

// Initial application start
init();