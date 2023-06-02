// import { v4 as uuidv4 } from 'uuid';


const {createRoot} = ReactDOM;
const {Fragment, useState, useEffect, useRef} = React;

const notes = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
const noteColumns = [
    {
        noteHeader: "header1",
        noteItem: [
            {
                text: "noteText 1",
                date: "date 1"
            },
            {
                text: "noteText 2",
                date: "date 2"
            }
        ]
    },
    {
        noteHeader: "header2",
        noteItem: [
            {
                text: "noteText 1",
                date: "date 2"
            },
            {
                text: "noteText 1",
                date: "date 2"
            }
        ]
    }
];

function MainHeader() {
    return (
        <Fragment>
            <header id="main">
                <h1 className="main-title">Note Taking App</h1>
            </header>
            <div id="add-note-column">
                <i className="fa-solid fa-circle-plus"></i>
            </div>
        </Fragment>
    );
}

function NoteItems({ item }) {
  return (
    item.map(({ text, date }, index) => (
      <div className="item-list" key={`note-${index}`}>
        <li className="note-item pointer-mode note-item-transform no-space">
          <textarea className="text-space" spellCheck="false" disabled>
            {text}
          </textarea>
          <hr className="line" color="whitesmoke" />
          <span className="date" contentEditable="false">Edited: {date} </span>
        </li>
        <div className="note-icons">
          <i className="fas fa-edit" id="edit-icon" style={{ fontWeight: 400 }}></i>
          <i className="fas fa-trash" id="delete-icon"></i>
        </div>
      </div>
    ))
  );
}



function NoteHeader({header}) {
  const [headerEdit, setHeaderEdit] = useState(false);
  const noteRef = useRef(null);
  const editHeader = () => {
    setHeaderEdit(true);
    noteRef.current.contentEditable =  true;
    noteRef.current.focus();
    setCursorToEnd(noteRef.current);
  }
  
  const saveHeader = () => {
    setHeaderEdit(false);
    noteRef.current.contentEditable =  false;
    const headerContent = noteRef.current.textContent;
  }

  const cancelEdit = () => {
    setHeaderEdit(false);
  }
  const setCursorToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false); // Collapse range to the end
    selection.removeAllRanges();
    selection.addRange(range);
  };
  
    // Ensure the cursor is positioned at the end when entering edit mode
  useEffect(() => {
    if (headerEdit) {
      setCursorToEnd(noteRef.current);
    }
  }, [headerEdit]);

    return (
        <div className={`note-header ${headerEdit? "edit-mode" : "pointer-mode"}`}>
        <div className={`note-header-text ${headerEdit? "edit-mode-cursor" : ""}`}>
          <h1 className="note" spellCheck="false" ref={noteRef}>{header}</h1>
        </div>
        <div className={`header-edit-icon ${headerEdit? "hide" : ""}`} >
          <i className="fas fa-edit" style={{ fontWeight: 400 }} onClick={editHeader} ></i>
        </div>
        <div className={`header-icons ${headerEdit ? '' : 'hide'}`}>
          <i className="fas fa-circle-check" onClick={saveHeader} ></i>
          <i className="fas fa-circle-xmark" onClick={cancelEdit} ></i>
        </div>
      </div>
    );
}


function HeaderOptionIcons() {
    return (
        <Fragment>
            <div className="header-option">
                <i className="hide fas fa-ellipsis-vertical"></i>
            </div>
            <div className="hide">
                <p className="delete-column">Delete</p>
                <p className="cancel-delete">Cancel</p>
            </div>
        </Fragment>
    );
}

function NoteForm({id}) {
    return (
        <form className="add-note-form" method="POST">
            <input className="add-button button" type="text" name={`form-${id}`} placeholder="+ Add Item" />
            <button className="save-button save-button-disable button">Add</button>
            <div className="add-container">
                <div className="add-item"></div>
            </div>
        </form>
    );
}
function NoteColumns() {
    return (
      noteColumns.map(({ noteHeader, noteItem }, index) => {
        return (
          <li className="note-column" key={`column-${index}`}>
            <div className="header">
              <NoteHeader header={noteHeader} />
              <HeaderOptionIcons />
            </div>
            <div className="note-content-scroll">
              <ul className="note-items-list">
                <NoteItems item={noteItem} />
              </ul>
            </div>
            <div>
              <NoteForm id={index} />
            </div>
          </li>
        );
      })
    );
  }
  
  

function NoteDisplay() {
    return (
        <Fragment>
        <MainHeader/>
        <div class="note-container">
            <div class="note-div">
                <ul class="note-list">
                    <NoteColumns/>
                </ul>
            </div>
        </div>
        </Fragment>
    );
}

const main = document.querySelector("#whole");
const mainContainer = createRoot(main);
mainContainer.render(<NoteDisplay />);

