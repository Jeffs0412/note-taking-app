// Check if there is an array with a key of "items", if there is, get and convert them into a JavaScript Object. Otherwise, initialize an array that will be used to store the note items.
const noteItemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
const noteHeadersArray = localStorage.getItem('headers') ? JSON.parse(localStorage.getItem('headers')) : [];
const noteDatesArray = localStorage.getItem('dates') ? JSON.parse(localStorage.getItem("dates")) : [];

function displayNoteItems(index) {
    let noteItem = "";
    for (let n = 0; n < noteItemsArray[index].length; n++) {
        noteItem += `<div class="item-list">
                    <li class="note-item pointer-mode note-item-transform no-space">
                        <span id="text" spellcheck="false">${noteItemsArray[index][n]}</span>
                        <hr id="line" color="whitesmoke" >
                        <span id="date" contentEditable="false">Edited: ${dateString()} </span>
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
                <p id="delete-column">Delete</p>
                <p id="cancel-delete">Cancel</p>
              </div>
            </div>
            <div class="note-content-scroll">
              <ul class="note-items-list">
                ${displayNoteItems(i)}
              </ul>
            </div>
            <div>
              <form id="add-note-form" method="POST">
                <input class="add-button button" type="text" name="note${i}" placeholder="+ Add Item">
                <input class="save-button button" type="submit" value="Add">
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


const addNoteForm = document.querySelectorAll("#add-note-form");
addNoteForm.forEach((form, index) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputValue = form.firstElementChild.value;
        noteItemsArray[index].push(inputValue);
        localStorage.setItem("items", JSON.stringify(noteItemsArray));
        location.reload();


    });
});

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


const addNoteColumn = document.querySelector(".fa-circle-plus");
addNoteColumn.addEventListener("click", (event) => {
    event.preventDefault();
    noteHeadersArray.push("");
    noteItemsArray.push([]);
    localStorage.setItem("headers", JSON.stringify(noteHeadersArray));
    localStorage.setItem("items", JSON.stringify(noteItemsArray));
    location.reload();
});

const headers = document.querySelectorAll(".header");
headers.forEach((header, index) => {
    header.addEventListener("click", (event) => {
        const noteHeaderText = header.children[0].children[0];
        const note = noteHeaderText.children[0];
        if (event.target.classList.contains("fa-edit")) {
            header.children[0].classList.add("edit-mode");
            header.children[0].children[0].classList.add("edit-mode-cursor");
            header.children[0].classList.remove("pointer-mode");
            header.children[0].children[1].classList.add("hide");
            header.children[0].children[2].classList.remove("hide");
            note.contentEditable = true;
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(note.childNodes[0], note.textContent.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            note.focus();
        } else if (event.target.classList.contains("fa-circle-check")) {
            header.children[0].children[1].classList.remove("hide");
            header.children[0].classList.remove("edit-mode");
            header.children[0].classList.add("pointer-mode");
            const headerContent = note.textContent;
            event.target.parentElement.classList.add("hide");
            noteHeadersArray[index] = headerContent;
            localStorage.setItem("headers", JSON.stringify(noteHeadersArray));
            location.reload();
        } else if (event.target.classList.contains("fa-circle-xmark")) {
            header.children[0].children[1].classList.remove("hide");
            header.children[0].classList.remove("edit-mode");
            header.children[0].classList.add("pointer-mode");
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

const deleteColumn = document.querySelectorAll("#delete-column");
deleteColumn.forEach((del, headerIndex) => {
    del.addEventListener("click", () => {
        noteHeadersArray.splice(headerIndex, 1);

        // Get the Column Element where the Delete Icon is located because its index is the same as the 2D Array in the local storage.
        const columnElement = del.parentNode.parentNode.parentNode;
        // Get the Array of Column Elements
        const noteColumnElements = columnElement.parentNode.children;
        // Get the first index of the 2D Array in the local storage
        const itemsIndex = Array.from(noteColumnElements).indexOf(columnElement)

        // Remove the Array of items in the itemsIndex in the local storage
        noteItemsArray.splice(itemsIndex, 1);
        // Resave the arrays in the local storage and reload the current webpage
        localStorage.setItem("headers", JSON.stringify(noteHeadersArray));
        localStorage.setItem("items", JSON.stringify(noteItemsArray));
        location.reload();
    });
});

const cancelDelete = document.querySelectorAll("#cancel-delete");
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

        // Update the text content of the note item element and the value of the items Array in the local storage using the indexes above  
        const noteContent = noteItemText.textContent;

        if (event.target.classList.contains("fa-edit")) {
            noteItemText.contentEditable = true;
            editIcon.classList.remove("fa-edit");
            editIcon.classList.add("fa-circle-check");
            deleteIcon.classList.add("fa-circle-xmark");
            deleteIcon.classList.remove("fa-trash");
            noteItem.classList.remove("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.add("edit-mode", "space");
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(noteItemText.childNodes[0], noteItemText.textContent.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            noteItemText.focus();

        } else if (event.target.classList.contains("fa-circle-check")) {
            noteItemText.contentEditable = false;
            editIcon.classList.add("fa-edit");
            editIcon.classList.remove("fa-circle-check");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.remove("fa-circle-xmark");
            noteItem.classList.add("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.remove("edit-mode");

            noteItemsArray[index1][index2] = noteContent;
            localStorage.setItem("items", JSON.stringify(noteItemsArray));
            location.reload()
        } else if (event.target.classList.contains("fa-circle-xmark")) {
            editIcon.classList.add("fa-edit");
            editIcon.classList.remove("fa-circle-check");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.remove("fa-circle-xmark");
            noteItem.classList.add("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.remove("edit-mode");
            location.reload();
        } else if (event.target.classList.contains("fa-trash")) {
            editIcon.classList.add("fa-edit");
            editIcon.classList.remove("fa-circle-check");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.remove("fa-circle-xmark");
            noteItem.classList.add("pointer-mode", "note-item-transform", "no-space");
            noteItem.classList.remove("edit-mode");
            noteItemsArray[index1].splice(index2, 1);
            localStorage.setItem("items", JSON.stringify(noteItemsArray));
            location.reload();
        }
    })
});
