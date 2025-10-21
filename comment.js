function processform() {
    const emailContent = document.getElementById("new-email").value;
    const email = document.getElementById("new-email");
    const comment = document.getElementById("new-comment").value;
    const colorRadios = document.querySelectorAll("input[name=new-color]:checked");

    if (!emailContent || !email.checkValidity()) {
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

function autoFillComment(textarea) {
    if (textarea.value === ' ') {
        textarea.value = "Ensemble Stars!!";
    }
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

function initTabClickEvents() {
    console.log('Initializing tab click events...');
    
    const tabHeaderButtons = document.querySelectorAll('.tab-header');
    
    // 先移除所有现有的事件监听器（通过克隆节点）
    tabHeaderButtons.forEach(header => {
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
    });
    
    // 重新获取元素并绑定事件
    const newTabHeaders = document.querySelectorAll('.tab-header');
    
    newTabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));
            
            // 移除所有 active 类
            document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加 active 类到当前元素
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            
            if (tabContent) {
                tabContent.classList.add('active');
                console.log('Tab switched to:', tabId);
            } else {
                console.error('Tab content not found:', tabId);
            }
        });
    });
    
    console.log('Tab click events initialized');
}

// 新增：专门初始化图片滚动功能的函数
function initImageScroller() {
    console.log('Initializing image scroller...');
    
    const tabHeaders = document.querySelector('.tab-headers');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    if (!tabHeaders || !scrollLeftBtn || !scrollRightBtn) {
        console.log('Image scroller elements not found');
        return;
    }
    
    function updateArrowVisibility() {
        // 检查左边
        if (tabHeaders.scrollLeft <= 10) {
            scrollLeftBtn.style.opacity = '0.3';
            scrollLeftBtn.style.pointerEvents = 'none';
        } else {
            scrollLeftBtn.style.opacity = '1';
            scrollLeftBtn.style.pointerEvents = 'auto';
        }
        
        // 检查右边
        const maxScroll = tabHeaders.scrollWidth - tabHeaders.clientWidth;
        if (tabHeaders.scrollLeft >= maxScroll - 10) {
            scrollRightBtn.style.opacity = '0.3';
            scrollRightBtn.style.pointerEvents = 'none';
        } else {
            scrollRightBtn.style.opacity = '1';
            scrollRightBtn.style.pointerEvents = 'auto';
        }
    }
    
    // 初始检查
    updateArrowVisibility();
    
    // 移除旧的事件监听器
    tabHeaders.removeEventListener('scroll', updateArrowVisibility);
    scrollRightBtn.removeEventListener('click', scrollRightHandler);
    scrollLeftBtn.removeEventListener('click', scrollLeftHandler);
    
    // 重新绑定滚动事件
    tabHeaders.addEventListener('scroll', updateArrowVisibility);
    
    function scrollRightHandler() {
        tabHeaders.scrollBy({ left: 200, behavior: 'smooth' });
    }
    
    function scrollLeftHandler() {
        tabHeaders.scrollBy({ left: -200, behavior: 'smooth' });
    }
    
    scrollRightBtn.addEventListener('click', scrollRightHandler);
    scrollLeftBtn.addEventListener('click', scrollLeftHandler);
    
    console.log('Image scroller initialized');
}



// only one audio is played once
let currentPlayingAudio = null;

function initAudioPlayers() {
    const audioPlayers = document.querySelectorAll('audio');
    
    audioPlayers.forEach(audio => {
        audio.removeEventListener('play', handleAudioPlay);
        audio.removeEventListener('pause', handleAudioPause);
        audio.removeEventListener('ended', handleAudioEnded);
        
        audio.addEventListener('play', handleAudioPlay);
        audio.addEventListener('pause', handleAudioPause);
        audio.addEventListener('ended', handleAudioEnded);
    });
}

//audio stops if changes to other pages 
function handleAudioPlay() {
    if (currentPlayingAudio && currentPlayingAudio !== this) {
        currentPlayingAudio.pause();
    }
    currentPlayingAudio = this;
}

function handleAudioPause() {
    if (currentPlayingAudio === this) {
        currentPlayingAudio = null;
    }
}

function handleAudioEnded() {
    if (currentPlayingAudio === this) {
        currentPlayingAudio = null;
    }
}

function renderAudio() {
    let hash = location.hash.slice(1) || 'home'; 
    if (!routes[hash]) {
        hash = 'home'; 
    }

    contentArea.innerHTML = routes[hash];

    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    setTimeout(() => {
        initAudioPlayers();

        if (hash === 'about' || hash === 'comment') {
            setTimeout(updateTabArrows, 150);
        }

        if (hash !== 'about' && currentPlayingAudio) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
            currentPlayingAudio = null;
        }
    }, 100);

}

function switchTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    //remove all class active
    document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    //add active to the proper tab
    const activeHeader = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    
    if (activeHeader) activeHeader.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

function scrollTabs(amount) {
    const tabHeaders = document.querySelector('.tab-headers');
    if (tabHeaders) {
        tabHeaders.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

function updateTabArrows() {
    const tabHeaders = document.querySelector('.tab-headers');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    if (!tabHeaders || !scrollLeftBtn || !scrollRightBtn) return;
    
    //check left side
    if (tabHeaders.scrollLeft <= 10) {
        scrollLeftBtn.style.opacity = '0.3';
        scrollLeftBtn.style.pointerEvents = 'none';
    } else {
        scrollLeftBtn.style.opacity = '1';
        scrollLeftBtn.style.pointerEvents = 'auto';
    }
    
    //check right side
    const maxScroll = tabHeaders.scrollWidth - tabHeaders.clientWidth;
    if (tabHeaders.scrollLeft >= maxScroll - 10) {
        scrollRightBtn.style.opacity = '0.3';
        scrollRightBtn.style.pointerEvents = 'none';
    } else {
        scrollRightBtn.style.opacity = '1';
        scrollRightBtn.style.pointerEvents = 'auto';
    }
}

//initialize when return to home
document.addEventListener('DOMContentLoaded', function() {
    //wait for DOM
    setTimeout(updateTabArrows, 100);
});
