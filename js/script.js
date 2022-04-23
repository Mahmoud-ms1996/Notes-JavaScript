const   addBox = document.querySelector(".add-box"),
        popupBox = document.querySelector(".popup-box"),
        popupTitleUpdate = popupBox.querySelector("header p"),
        closeIcon = popupBox.querySelector("header i"),
        titleTag = document.querySelector("input"),
        descTag = popupBox.querySelector("textarea"),
        addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
        
/* getting localstorage notes 
    - if exist and parsing them to js object 
    - else passing an empty array to notes
*/
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdated = false,
    updateId;

// add note to show popup
addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

// close popup-box 
closeIcon.addEventListener("click", () => {
    isUpdated = false;
    titleTag.value = '';
    descTag.value = '';
    addBtn.innerText = "Add Note";
    popupTitleUpdate.innerText = "Add a new Note";
    popupBox.classList.remove("show");
});

// showing Notes
function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;

        addBox.insertAdjacentHTML("afterend", liTag);
    })
}
showNotes();

// Add New note
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    if(noteTitle == '' || noteDesc == ''){
     
        Swal.fire({
            icon: 'error',
            title: 'Try Again',
            text: 'You should fill the input field',
        })
    
    } else{
        
        // getting month, day, year from the current date
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

            let noteInfo = {
                title: noteTitle,
                description: noteDesc,
                date: `${month} ${day}, ${year}`
            }

            if(!isUpdated){
               
                // adding new note to notes
                notes.push(noteInfo); 
            
            } else{
                isUpdated = false;
                // updating specified note
                notes[updateId] = noteInfo;
            }

            
            // saving notes to localstorage
            localStorage.setItem("notes", JSON.stringify(notes));
            
            closeIcon.click();
            
            // plugin for msg alert
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: 'has been added'
              })

            showNotes();
    }
});

// settings Menu Show
function showMenu(elem){
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// Delete note
function deleteNote(noteId){
    
    // plugin for msg alert
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this note?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',

      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your Note has been deleted.',
            'success'
          )

          // removing selected note from array/tasks
          notes.splice(noteId, 1);
          
          // saving updated note to localstorage
          localStorage.setItem("notes", JSON.stringify(notes));
          
          showNotes();

        }
      })
}

// Update Note
function updateNote(noteId, title, desc){
    addBox.click();
    isUpdated = true;
    updateId = noteId;
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitleUpdate.innerText = "Update a Note";
}
