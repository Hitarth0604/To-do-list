// Function to handle adding a new task to the "To Do" list
function addTodo() {
    const input = document.getElementById('todo-input');
    const taskText = input.value.trim();
  
    if (taskText !== '') {
      const todoList = document.getElementById('todo-list');
      const listItem = createListItem(taskText);
      todoList.appendChild(listItem);
      input.value = ''; // Clear input field after adding
    }
  }
  
  // Function to handle adding a new task when Enter key is pressed
  document.getElementById('todo-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  });
  
  // Function to create a new list item
  function createListItem(taskText) {
    const listItem = document.createElement('li');
    listItem.className = 'list-item';
    listItem.textContent = taskText;
    listItem.setAttribute('draggable', true);
  
    // Handle the drag start event
    listItem.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text', taskText);
      event.target.classList.add('dragging'); // Adding a class to mark the dragged item
    });
  
    // Handle the drag end event
    listItem.addEventListener('dragend', function(event) {
      event.target.classList.remove('dragging'); // Remove dragging class after drop
    });
  
    return listItem;
  }
  
  // Function to handle drag over event for lists
  function allowDrop(event) {
    event.preventDefault(); // Allow the drop
  }
  
  // Function to handle the drop event for lists
  function drop(event) {
    event.preventDefault();
    const draggedItem = document.querySelector('.dragging');
    
    if (!draggedItem) return; // Ensure there's an item to drop
  
    const list = event.target.closest('.list');
  
    if (list) {
      // If dropped inside To Do list, move it back to To Do
      if (list.id === 'todo-list') {
        list.appendChild(draggedItem);
        draggedItem.classList.remove('dropped');
      } 
      // If dropped inside Done list, move it there and add purple background
      else if (list.id === 'done-list') {
        list.appendChild(draggedItem);
        draggedItem.classList.add('dropped'); // Apply purple background
        addDeleteButton(draggedItem); // Add delete button for Done list items
      }
    }
  }
  
  // Function to add delete button for Done list items
  function addDeleteButton(item) {
    // Add delete button to the task
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => {
      item.remove(); // Remove task from Done list
    };
    item.appendChild(deleteBtn);
  }
  
  // Remove items when dropped outside the lists
  document.addEventListener('dragover', function(event) {
    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');
    
    // Check if the task is dragged outside of the lists
    if (!todoList.contains(event.target) && !doneList.contains(event.target)) {
      const draggedItem = document.querySelector('.dragging');
      if (draggedItem && draggedItem.parentElement === doneList) {
        draggedItem.remove(); // Only remove from Done List if dropped outside
      }
    }
  });
  
  // Add drop functionality to both To Do and Done lists
  document.getElementById('todo-list').addEventListener('dragover', allowDrop);
  document.getElementById('todo-list').addEventListener('drop', drop);
  
  document.getElementById('done-list').addEventListener('dragover', allowDrop);
  document.getElementById('done-list').addEventListener('drop', drop);

  




let touchStartX = 0;
let touchEndX = 0;

// Add swipe gesture detection to list items
function enableSwipeActions(item) {
  // Touch Start
  item.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
  });

  // Touch End
  item.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe(item);
  });
}

// Handle swipe action
function handleSwipe(item) {
  const todoList = document.getElementById('todo-list').querySelector('ul');
  const doneList = document.getElementById('done-list').querySelector('ul');

  if (touchStartX < touchEndX - 50) {
    // Swipe Right: Move from To Do to Done
    if (item.parentElement === todoList) {
      doneList.appendChild(item);
      item.classList.add('dropped'); // Add purple background
      addDeleteButton(item);
    }
  } else if (touchStartX > touchEndX + 50) {
    // Swipe Left: Delete from Done
    if (item.parentElement === doneList) {
      item.remove(); // Remove item
    }
  }
}

// Override createListItem to include swipe actions
function createListItem(taskText) {
  const listItem = document.createElement('li');
  listItem.className = 'list-item';
  listItem.textContent = taskText;

  // Enable swipe actions
  enableSwipeActions(listItem);

  return listItem;
}

// No changes to addTodo, allowDrop, or other functions
