const { createRoot } = ReactDOM;
const { Fragment, useState, useEffect, useRef } = React;

function MainHeader({ onAddColumn }) {
  return (
    <Fragment>
      <header id="main">
        <h1 className="main-title">Note Taking App</h1>
      </header>
      <div id="add-note-column" onClick={onAddColumn}>
        <i className="fa-solid fa-circle-plus"></i>
      </div>
    </Fragment>
  );
}

function NoteItems({ items }) {
  return (
    items.map(({ text, date }, index) => (
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

function NoteColumns({ notes, onHeaderChange, addColumn, onDeleteColumn, onAddNoteItem }) {
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
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
              <NoteItems items={noteItem} />
            </ul>
          </div>
          <div>
            <NoteForm id={columnIndex} onAddNoteItem={(text, date) => onAddNoteItem(columnIndex, text, date)} />
          </div>
        </li>
      );
    })
  );
}

function NotesDisplay() {
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem("notes");
    return storedNotes ? JSON.parse(storedNotes) : []; // Set the notes state equal to the array stored in the local storage
  });

  const handleHeaderChange = (headerContent, columnIndex) => { //Get the headerContent from the NoteHeader component and the columnIndex from the NoteColumns component
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes[columnIndex].noteHeader = headerContent; // Update the value of the noteHeader equal to the updated headerContent from the NoteHeader component
      return updatedNotes; // Set the note state equal to the Updated Notes Array
    });
  };

  // This state function will be used by the MainHeader child component
  const addColumn = () => { 
    const newColumn = {
      noteHeader: "New Header",
      noteItem: []
    };
    setNotes(prevNotes => [...prevNotes, newColumn]); // When the add-note-column element from the MainHeader is clicked, this addColumnFunction will be triggered and will update the notes state by adding a newColumn array of objects
  };

  // This state function will be used by the NoteColumns child component
  const handleDeleteColumn = (index) => { 
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes.splice(index, 1);
      return updatedNotes;
    });
  };
  
  // This state function will be used by the NoteColumns child component
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
              notes={notes} // The notes state value is passed to the NoteColumns component
              onHeaderChange={handleHeaderChange} 
              addColumn={addColumn}
              onDeleteColumn={handleDeleteColumn}
              onAddNoteItem={handleAddNoteItem} // The columnIndex, text, and date is passed to the handleAddNoteItem to be used to add a new item
            />
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

const main = document.querySelector("#whole");
const mainContainer = createRoot(main);
mainContainer.render(<NotesDisplay />);
 