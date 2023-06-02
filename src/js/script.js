// Check if there is an array with a key of "items", if there is, get and convert them into a JavaScript Object. Otherwise, initialize an array that will be used to store the note items.
const noteItemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
const noteHeadersArray = localStorage.getItem('headers') ? JSON.parse(localStorage.getItem('headers')) : [];
const noteDatesArray = localStorage.getItem('dates') ? JSON.parse(localStorage.getItem("dates")) : [];

//Create A Function of Elements that Contains the Note Items and Dates based on their respective indexes
function displayNoteItems(index) {
    let noteItem = "";
    for (let n = 0; n < noteItemsArray[index].length; n++) {
        noteItem += `<div class="item-list">
                    <li class="note-item pointer-mode note-item-transform no-space">
                        <textarea class="text-space" spellcheck="false" disabled>${noteItemsArray[index][n]}</textarea>
                        <hr class="line" color="whitesmoke" >
                        <span class="date" contentEditable="false">Edited: ${noteDatesArray[index][n]} </span>
                    </li>
                    <div class="note-icons">
                    <i class="fas fa-edit" id="edit-icon" style="font-weight: 400;"></i>
                    <i class="fas fa-trash" id="delete-icon"></i>
                    </div>
                    </div>`
    }
    return noteItem;
}

// Create a function that will iterate through the noteItemsArray noteHeadersArray and insert each element in the note-item element
function displayNoteContainer() {
    const ul = document.querySelector(".note-list");
    let notes = "";
    for (let i = 0; i < noteHeadersArray.length; i++) {
        notes += `
        <li class="note-column">
            <div class="header">
              <div class="note-header">
                <div class="note-header-text">
                  <h1 class="note" spellcheck="false">${noteHeadersArray[i]}</h1>
                </div>
                <div class="header-edit-icon">
                  <i class="fas fa-edit" style="font-weight: 400;"></i>
                </div>
                <div class="header-icons hide">
                  <i class="fas fa-circle-check"></i>
                  <i class="fas fa-circle-xmark"></i>
                </div>
              </div>
              <div class="header-option">
                <i class="hide fas fa-ellipsis-vertical"></i>
              </div>
              <div class="hide">
                <p class="delete-column">Delete</p>
                <p class="cancel-delete">Cancel</p>
                </div>
                </div>
                <div class="note-content-scroll">
                <ul class="note-items-list">
                ${displayNoteItems(i)}
                </ul>
                </div>
                <div>
                <form class="add-note-form" method="POST">
                <input class="add-button button" type="text" name="note${i}" placeholder="+ Add Item">
                <button class="save-button save-button-disable button">Add</button>
                <div class="add-container">
                <div class="add-item"></div>
                </div>
                </form>
                </div>
                </li>
                `
            }
            ul.innerHTML = notes;
        }
        
        
displayNoteContainer();

// Create a Function to display the Current Date and Time
function dateString() {
    const options = {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric'
    };
    let date = new Date();
    date = date.toDateString().split(" ");
    let time = new Date();
    time = time.toLocaleTimeString('en-US', options);
    date = `${date[1]} ${date[2]}, ${date[3]} ${time}`
    return date;
}

// Create an Event Listener for Adding New Note Items in the Note Column
const addNoteForm = document.querySelectorAll(".add-note-form");
addNoteForm.forEach((form, index) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputValue = form.firstElementChild.value;
        // Add a condition where you can only add an item if the add input is not empty or contains text
        if (inputValue !== "") {
            const dateValue = dateString();
            noteItemsArray[index].push(inputValue);
            noteDatesArray[index].push(dateValue);
            localStorage.setItem("items", JSON.stringify(noteItemsArray));
            localStorage.setItem("dates", JSON.stringify(noteDatesArray));
            location.reload();
        }
    });
});

// Create an Event Listener to Increase the Height of the Note Item Whenever it is Clicked
const noteItem = document.querySelectorAll(".note-item");
noteItem.forEach((item) => {
    const editIcon = item.nextElementSibling.children[0];
    item.addEventListener("click", () => {
        if (item.classList.contains("space") && editIcon.classList.contains("fa-edit")) {
            item.classList.remove("space");
            item.classList.add("no-space");
        } else {
            item.classList.add("space");
            item.classList.remove("no-space");
        }
    });
});

// Create an Event Listener for Adding a new Column as Well as a new Array of Note Headers, Note Items, and Dates
const addNoteColumn = document.querySelector(".fa-circle-plus");
addNoteColumn.addEventListener("click", (event) => {
    event.preventDefault();
    noteHeadersArray.push("");
    noteItemsArray.push([]);
    noteDatesArray.push([]);
    localStorage.setItem("headers", JSON.stringify(noteHeadersArray));
    localStorage.setItem("items", JSON.stringify(noteItemsArray));
    localStorage.setItem("dates", JSON.stringify(noteDatesArray));
    location.reload();
});

const headers = document.querySelectorAll(".header");
headers.forEach((header, index) => {
    header.addEventListener("click", (event) => {
        const noteHeader = header.children[0];
        const noteHeaderText = noteHeader.children[0];
        const note = noteHeaderText.children[0];
        if (event.target.classList.contains("fa-edit")) {
            noteHeader.classList.add("edit-mode");
            noteHeader.children[0].classList.add("edit-mode-cursor");
            noteHeader.classList.remove("pointer-mode");
            noteHeader.children[1].classList.add("hide");
            noteHeader.children[2].classList.remove("hide");
            note.contentEditable = true;
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(note.childNodes[0], note.textContent.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            note.focus();
        } else if (event.target.classList.contains("fa-circle-check")) {
            noteHeader.children[1].classList.remove("hide");
            noteHeader.classList.remove("edit-mode");
            noteHeader.classList.add("pointer-mode");
            const headerContent = note.textContent;
            event.target.parentElement.classList.add("hide");
            noteHeadersArray[index] = headerContent;
            localStorage.setItem("headers", JSON.stringify(noteHeadersArray));
            location.reload();
        } else if (event.target.classList.contains("fa-circle-xmark")) {
            noteHeader.children[1].classList.remove("hide");
            noteHeader.classList.remove("edit-mode");
            noteHeader.classList.add("pointer-mode");
            event.target.parentElement.classList.add("hide");
            location.reload();
        }
    });
});

const option = document.querySelectorAll(".fa-ellipsis-vertical");
option.forEach((opt) => {
    opt.addEventListener("click", () => {
        const optionIcon = opt.parentElement;
        optionIcon.classList.add("hide");
        optionIcon.nextElementSibling.classList.remove("hide");
        optionIcon.nextElementSibling.classList.add("unhide");
        optionIcon.nextElementSibling.children[0].classList.add("show-delete");
        optionIcon.nextElementSibling.children[1].classList.add("show-cancel");
    });
});

const deleteColumn = document.querySelectorAll(".delete-column");
deleteColumn.forEach((del, headerIndex) => {
    del.addEventListener("click", () => {
        noteHeadersArray.splice(headerIndex, 1);
        
        // Get the Column Element where the Delete Icon is located because its index is the same as the 2D Array in the local storage.
        const columnElement = del.parentNode.parentNode.parentNode;
        // Get the Array of Column Elements
        const noteColumnElements = columnElement.parentNode.children;
        // Get the first index of the 2D Array in the local storage
        const itemsIndex = Array.from(noteColumnElements).indexOf(columnElement)
        
        // Remove the Array of items and dates in the itemsIndex in the local storage
        noteItemsArray.splice(itemsIndex, 1);
        noteDatesArray.splice(itemsIndex, 1);
        // Resave and reload the arrays in the local storage and reload the current webpage
        localStorage.setItem("headers", JSON.stringify(noteHeadersArray));
        localStorage.setItem("items", JSON.stringify(noteItemsArray));
        localStorage.setItem("dates", JSON.stringify(noteDatesArray));
        location.reload();
    });
});

const cancelDelete = document.querySelectorAll(".cancel-delete");
cancelDelete.forEach((opt) => {
    opt.addEventListener("click", () => {
        const headerOption = opt.parentElement;
        headerOption.previousElementSibling.classList.remove("hide");
        headerOption.classList.add("hide");
        headerOption.classList.remove("unhide");
        opt.previousElementSibling.classList.remove("show-delete");
        opt.classList.remove("show-cancel");
    });
});

const editItem = document.querySelectorAll(".note-icons");
editItem.forEach((item) => {
    item.addEventListener("click", (event) => {
        const noteItem = item.previousElementSibling;
        const noteItemText = noteItem.children[0];
        const editIcon = item.children[0];
        const deleteIcon = item.children[1];
        // Get the Column Element where the Delete Icon is located because its index is the same as the 2D Array in the local storage.
        const columnElement = noteItemText.parentNode.parentNode.parentNode.parentNode.parentNode;
        // Get the Array of Column Elements
        const noteColumnElements = columnElement.parentNode.children;
        
        // Get the Item List Element where the text element is localted because its index is the same as the 2D Array in the local storage.
        const listElement = noteItemText.parentNode.parentNode;
        // Get the Array of Item List Elements
        const itemListElements = listElement.parentNode.children;
        
        // Get the first index of the 2D Array in the local storage
        const index1 = Array.from(noteColumnElements).indexOf(columnElement);
        // Get the second index of the 2D Array in the local storage
        const index2 = Array.from(itemListElements).indexOf(listElement);
        
        // Update the text content, date below the text content of the note item element and the value of the items Array in the local storage using the indexes above  
        const noteContent = noteItemText.value;
        const newDate = dateString();
        
        if (event.target.classList.contains("fa-edit")) {
            noteItemText.disabled = false;
            editIcon.classList.remove("fa-edit");
            editIcon.classList.add("fa-circle-check");
            deleteIcon.classList.add("fa-circle-xmark");
            deleteIcon.classList.remove("fa-trash");
            noteItem.classList.remove("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.add("edit-mode", "space");
            noteItemText.classList.add("edit-mode-cursor");
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(noteItemText.childNodes[0], noteContent.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            noteItemText.focus();
            
        } else if (event.target.classList.contains("fa-circle-check")) {
            noteItemText.disabled = false;
            editIcon.classList.add("fa-edit");
            editIcon.classList.remove("fa-circle-check");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.remove("fa-circle-xmark");
            noteItem.classList.add("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.remove("edit-mode");
            noteItemText.classList.remove("edit-mode-cursor");
            
            noteItemsArray[index1][index2] = noteContent;
            noteDatesArray[index1][index2] = newDate;
            localStorage.setItem("items", JSON.stringify(noteItemsArray));
            localStorage.setItem("dates", JSON.stringify(noteDatesArray));
            location.reload()
        } else if (event.target.classList.contains("fa-circle-xmark")) {
            editIcon.classList.add("fa-edit");
            editIcon.classList.remove("fa-circle-check");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.remove("fa-circle-xmark");
            noteItem.classList.add("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.remove("edit-mode");
            noteItemText.classList.remove("edit-mode-cursor");
            location.reload();
        } else if (event.target.classList.contains("fa-trash")) {
            editIcon.classList.add("fa-edit");
            editIcon.classList.remove("fa-circle-check");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.remove("fa-circle-xmark");
            noteItem.classList.add("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.remove("edit-mode");
            noteItemText.classList.remove("edit-mode-cursor");
            noteItemsArray[index1].splice(index2, 1);
            localStorage.setItem("items", JSON.stringify(noteItemsArray));
            location.reload();
        }
    })
});
