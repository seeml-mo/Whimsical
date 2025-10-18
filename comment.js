function processform() {
    const email = document.getElementById("new-email").value;
    const comment = document.getElementById("new-comment").value;
    const colorRadios = document.querySelectorAll("input[name=new-color]:checked");

    if (!email || !email.includes('@')) {
        alert("Please Input Valid Email!");
        return; 
    }
    if (!comment.trim()) {
        alert("Please Fill Your Comment!");
        return;
    }
    if (colorRadios.length === 0) {
        alert("Please Select a Color!");
        return;
    }
    
    
    // set up a new element
    let newComment = document.createElement("div");
    let element = '<div><svg height="100" width="100"><circle cx="50" cy="50" r="40"></svg></div><div><h5></h5><p></p></div>';
    newComment.innerHTML = element;

    // set the classes of the div and its children div's
    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
    newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div

    // increment the comment id
    let lastComment = document.querySelector("#comments").lastElementChild; // #comments refer to the id "comments"
    newComment.id = 'c' + (Number(lastComment.id.substr(1))+1);

    // change contents <h5> and <p> according to form input with id
    newComment.querySelector("h5").innerHTML = document.querySelector("#new-email").value;
    newComment.querySelector("p").innerHTML = document.querySelector("#new-comment").value;

    // get the color choice from the radio buttons
    let color = document.querySelectorAll("input[name=new-color]:checked")[0].value;

    // change the fill color of the SVG circle
    newComment.querySelector("circle").setAttribute("fill", color);

    // append it to the div #comments
    document.querySelector("#comments").appendChild(newComment);

    // reset the form to clear the contents
    document.querySelector("form").reset();
}

function loadfile(){
    fetch("http://127.0.0.1:8080/user_input.json") // or absolute address http://127.0.0.1:8080/lab_04_file.txt
      .then(response => response.json())
      .then(data => {
        document.getElementById("new-email").value = data.email;
        document.getElementById("new-comment").value = data.comment;
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
}


function savefile(){
  const textInput = document.getElementById('new-comment');

  const emailInput = document.getElementById('new-email');

  const data = {
    email: emailInput.value,
    comment: textInput.value
  };

  fetch("http://127.0.0.1:8080/user_input.json", {
    method:"PUT",
    body: JSON.stringify(data)
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const showBtn = document.getElementById('show-tasks-btn');
  if (!showBtn) return;

  const taskBar = document.getElementById('show');
  if (!taskBar) return;

  const isVisibleNow = window.getComputedStyle(taskBar).display !== 'none';
  showBtn.dataset.open = isVisibleNow ? 'true' : 'false';

  function getLabelFromButton(el) {
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    const m = txt.match(/\b(SHOW|HIDE)\b/i);
    return m ? m[0].toUpperCase() : txt.toUpperCase();
  }

  function setLabelOnButton(el, label) {
    const svg = el.querySelector('svg');
    if (!svg) {
      el.textContent = label;
      return;
    }
    let node = svg.nextSibling;
    while (node) {
      const next = node.nextSibling;
      el.removeChild(node);
      node = next;
    }
    el.appendChild(document.createTextNode(' ' + label));
  }

  function openTasks() {
    showBtn.dataset.open = 'true';
    taskBar.innerHTML = '';
    const b1 = document.createElement('button');
    b1.className = 'task-btn';
    b1.type = 'button';
    b1.textContent = 'Font Size +';
    b1.addEventListener('click', function(e) { e.stopPropagation(); changeFontSize(1); });

    const b2 = document.createElement('button');
    b2.className = 'task-btn';
    b2.type = 'button';
    b2.textContent = 'Font Size -';
    b2.addEventListener('click', function(e) { e.stopPropagation(); changeFontSize(-1); });

    const b3 = document.createElement('button');
    b3.className = 'task-btn';
    b3.type = 'button';
    b3.textContent = 'Spotlight';
    b3.addEventListener('click', function(e) { e.stopPropagation(); showSpotlightDialog(); });

    const b4 = document.createElement('button');
    b4.className = 'task-btn';
    b4.type = 'button';
    b4.textContent = 'Bootstrap';
    b4.addEventListener('click', function(e) { e.stopPropagation(); showTimeModal(); });

    taskBar.appendChild(b1);
    taskBar.appendChild(b2);
    taskBar.appendChild(b3);
    taskBar.appendChild(b4);

    taskBar.style.display = 'flex'; 
    setLabelOnButton(showBtn, 'HIDE');
  }

  function closeTasks() {
    showBtn.dataset.open = 'false';
    taskBar.innerHTML = '';
    taskBar.style.display = 'none';
    setLabelOnButton(showBtn, 'SHOW');
  }

  showBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = showBtn.dataset.open === 'true' ||
                   getLabelFromButton(showBtn) === 'HIDE' ||
                   (window.getComputedStyle(taskBar).display !== 'none');

    if (isOpen) closeTasks();
    else openTasks();
  });
});

function changeFontSize(delta) {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    let currentSize = parseInt(window.getComputedStyle(contentArea).fontSize);
    if (isNaN(currentSize)) {
        currentSize = 16; 
    }
    
    let newSize = currentSize + delta;
    newSize = Math.max(8, Math.min(32, newSize));
    
    const contentElements = contentArea.querySelectorAll('*');
    contentElements.forEach(element => {
        element.style.fontSize = newSize + 'px';
    });
    
    contentArea.style.fontSize = newSize + 'px';
    
    console.log(`Font size: ${newSize}px`);
}

function showSpotlightDialog() {
    const input = prompt('Enter a spotlight:');
    
    if (input && input.trim()) {
        let spotlightArea = document.getElementById('spotlight-area');
        if (!spotlightArea) {
            spotlightArea = document.createElement('div');
            spotlightArea.id = 'spotlight-area';
            spotlightArea.className = 'spotlight-container';
            
            const title = document.createElement('h5');
            title.textContent = 'Spotlights';
            spotlightArea.appendChild(title);

            document.body.appendChild(spotlightArea);
        }
        let description = spotlightArea.querySelector('p');
        if (!description) {
            description = document.createElement('p');
            spotlightArea.appendChild(description);
        }
        description.textContent = input.trim();
    }
}

function showTimeModal(){
    const timeString = new Date().toLocaleString();
    
    const existingModal = document.getElementById('timeModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
    <div class="modal fade" id="timeModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Clock</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <p id="current-time" style="font-size: 1.2rem; font-weight: bold;">Current Time: ${timeString}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const timeModal = new bootstrap.Modal(document.getElementById('timeModal'));
    timeModal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// imagescroller
document.addEventListener('DOMContentLoaded', function() {
    const tabHeaders = document.querySelector('.tab-headers');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    scrollRightBtn.addEventListener('click', function() {
        tabHeaders.scrollBy({ left: 200, behavior: 'smooth' });
    });
    
    scrollLeftBtn.addEventListener('click', function() {
        tabHeaders.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    const tabHeaderButtons = document.querySelectorAll('.tab-header');
    tabHeaderButtons.forEach(header => {
        header.addEventListener('click', function() {
            document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});