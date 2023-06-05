const { createRoot } = ReactDOM;
const { Fragment, useState, useEffect, useRef, createRef } = React;

function MainHeader({ onAddColumn }) { // Parent Component: NoteDisplay Component
  return (
    <Fragment>
      <header id="main">
        <h1 className="main-title">Note Taking App</h1>
      </header>
      <div id="add-note-column" onClick={onAddColumn}> {/* This onAddColumn is located at the NoteDisplay Component */}
        <i className="fa-solid fa-circle-plus"></i>
      </div>
    </Fragment>
  );
}

function NoteItems({ items, noteColumnIndex, saveNoteItem, onDeleteNoteItem }) {

  
  const [notes, setNotes] = useState(() => {
    const storedNoteItems = localStorage.getItem("notes");
  return storedNoteItems? JSON.parse(storedNoteItems) : [];
});

const [noteEdit, setNoteEdit] = useState(false);
const noteItemRef = useRef(null);

const editNote = () => {
  setNoteEdit(true);
  noteItemRef.current.contentEditable = true;
  noteItemRef.current.focus();
}

const deleteNote =  () => {
  setNoteEdit(prevNoteEdit => (!prevNoteEdit? true: false)); 
  setNotes(prevNotes =>{
    const updatedNotes = [...prevNotes];
    updatedNotes[noteColumnIndex].noteItem;
    return updatedNotes;
  });
}

const saveNote = (itemIndex) => {
  setNoteEdit(false);
  noteItemRef.current.contentEditable = false;
  const noteContent = noteItemRef.current.textContent;
  setNotes(prevNotes => {
    const newNotes = [...prevNotes];
    newNotes[noteColumnIndex].noteItem[itemIndex].text = noteContent;
    return newNotes;
  });
  window.location.reload();
};

const setCursorToEnd = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  noteItemRef.current.focus();
}

const expandNote = () => {
  setNoteEdit(prevNoteEdit => (!prevNoteEdit? true: false));
}
useEffect(() => {
  if (noteEdit) {
    noteItemRef.current.focus();
    setCursorToEnd(noteItemRef.current);
  }
}, [noteEdit]);

useEffect(() =>{
  localStorage.setItem("notes", JSON.stringify(notes));
}, [notes]);


return (
  items.map(({ text, date }, index) => (
    <div className="item-list " key={`note-${index}`}>
        <li className={`note-item pointer-mode note-item-transform ${noteEdit? "space" : "no-space"}`} onClick={expandNote} >
          <textarea className="text-space" spellCheck="false" ref={noteItemRef} contentEditable={noteEdit}>
            {text}
          </textarea>
          <hr className="line" color="whitesmoke" />
          <span className="date" contentEditable="false">Edited: {date} </span>
        </li>
        <div className="note-icons">
          <i className={`fas ${noteEdit? "fa-circle-check" : "fa-edit"}`} onClick={noteEdit? saveNote : editNote} id="edit-icon" style={{ fontWeight: 400 }}></i>
          <i className={`fas ${noteEdit? "fa-circle-xmark" : "fa-trash"}`} onClick={deleteNote}   id="delete-icon"></i>
        </div>
      </div>
    ))
  );
}

function NoteColumns({ notes, onHeaderChange, addColumn, onDeleteColumn, onAddNoteItem }) {
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes)); // The passed notes array from the NotesDisplay component is an updated and parsed version and should be stringified and stored to update the local storage
  }, [notes]); 

  const handleDeleteColumn = (index) => {
    onDeleteColumn(index);
  };

  return (
    notes.map(({ noteHeader, noteItem }, columnIndex) => {
      return (
        <li className="note-column" key={`column-${columnIndex}`}>
          <div className="header">
            <NoteHeader header={noteHeader} onHeaderChange={(headerContent) => onHeaderChange(headerContent, columnIndex)} />
            <HeaderOptionIcons index={columnIndex} onDeleteColumn={handleDeleteColumn} />
          </div>
          <div className="note-content-scroll">
            <ul className="note-items-list">
              <NoteItems items={noteItem} noteColumnIndex={columnIndex} />
            </ul>
          </div>
          <div>
            <NoteForm id={columnIndex} onAddNoteItem={(text, date) => onAddNoteItem(columnIndex, text, date)} /> {/* After passing the inputValue and currentDate from the NoteFrom component (now, as text and date), include the columnIndex. These data will be passed to the NoteDisplay component to be used in handleAddNoteItem functional state*/}
          </div>
        </li>
      );
    })
  );
}
function NoteHeader({ header, onHeaderChange }) {
  const [headerEdit, setHeaderEdit] = useState(false);
  const noteRef = useRef(null);
  
  const editHeader = () => {
    setHeaderEdit(true);
    noteRef.current.contentEditable = true;
    noteRef.current.focus();
  };

  const saveHeader = () => {
    setHeaderEdit(false);
    noteRef.current.contentEditable = false;
    const headerContent = noteRef.current.textContent;
    onHeaderChange(headerContent);
    window.location.reload();
  };

  const cancelEdit = () => {
    setHeaderEdit(false);
    window.location.reload();
  };

  useEffect(() => {
    if (headerEdit) {
      noteRef.current.focus();
      setCursorToEnd(noteRef.current);
    }
  }, [headerEdit]);

  const setCursorToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false); // Collapse range to the end
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className={`note-header ${headerEdit ? "edit-mode" : "pointer-mode"}`}>
      <div className={`note-header-text ${headerEdit ? "edit-mode-cursor" : ""}`}>
        <h1 className="note" spellCheck="false" ref={noteRef}>{header}</h1>
      </div>
      <div className={`header-edit-icon ${headerEdit ? "hide" : ""}`}>
        <i className="fas fa-edit" style={{ fontWeight: 400 }} onClick={editHeader}></i>
      </div>
      <div className={`header-icons ${headerEdit ? "" : "hide"}`}>
        <i className="fas fa-circle-check" onClick={saveHeader}></i>
        <i className="fas fa-circle-xmark" onClick={cancelEdit}></i>
      </div>
    </div>
  );
}

function HeaderOptionIcons({ index, onDeleteColumn }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const showOptions = () => {
    setIsOptionsVisible(true);
  };

  const hideOptions = () => {
    setIsOptionsVisible(false);
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(index);
  };

  return (
    <Fragment>
      <div className={`header-option ${isOptionsVisible ? 'hide' : ''}`}>
        <i className="fas fa-ellipsis-vertical" onClick={showOptions}></i>
      </div>
      <div className={`hide ${isOptionsVisible ? 'unhide' : ''}`}>
        <p className="delete-column show-delete" onClick={handleDeleteColumn}>Delete</p>
        <p className="cancel-delete show-cancel" onClick={hideOptions}>Cancel</p>
      </div>
    </Fragment>
  );
}

function NoteForm({ id, onAddNoteItem }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const currentDate = new Date().toLocaleString();
      onAddNoteItem(inputValue, currentDate);
      setInputValue('');
    }
  };

  return (
    <form className="add-note-form" method="POST" onSubmit={handleSubmit}>
      <input
        className="add-button button"
        type="text"
        name={`form-${id}`}
        placeholder="+ Add Item"
        value={inputValue}
        onChange={handleChange}
      />
      <button className="save-button save-button-disable button" type="submit">Add</button>
      <div className="add-container">
        <div className="add-item"></div>
      </div>
    </form>
  );
}


function NoteDisplay() {
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem("notes");
    return storedNotes ? JSON.parse(storedNotes) : [];
  });

  const handleHeaderChange = (headerContent, columnIndex) => {
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes[columnIndex].noteHeader = headerContent;
      return updatedNotes;
    });
  };

  const addColumn = () => {
    const newColumn = {
      noteHeader: "New Header",
      noteItem: []
    };
    setNotes(prevNotes => [...prevNotes, newColumn]);
  };

  const handleDeleteColumn = (index) => {
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes.splice(index, 1);
      return updatedNotes;
    });
  };

  const handleAddNoteItem = (columnIndex, text, date) => {
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes[columnIndex].noteItem.push({ text, date });
      return updatedNotes;
    });
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <Fragment>
      <MainHeader onAddColumn={addColumn} />
      <div className="note-container">
        <div className="note-div">
          <ul className="note-list">
            <NoteColumns
              notes={notes}
              onHeaderChange={handleHeaderChange}
              addColumn={addColumn}
              onDeleteColumn={handleDeleteColumn}
              onAddNoteItem={handleAddNoteItem}
            />
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

const main = document.querySelector("#whole");
const mainContainer = createRoot(main);
mainContainer.render(<NoteDisplay />);
