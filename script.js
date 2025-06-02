$(document).ready(function () {
    const $taskInput = $('#taskInput'); // valitaan DOM-elementit
    const $taskList = $('#taskList');

    $('#addTask').on('click', addTask); // lisätään klikkikuuntelija

    $taskInput.on('keypress', function (e) { // tehtävien lisäys enterillä
        if (e.which === 13) {
            addTask();
        }
    });

    $taskInput.on('input', function () { // nollataan syöttökentän tyylit ennen syötteen lisäämistä
        $taskInput.css({ borderColor: '', backgroundColor: '' });
    });

    // tehtävän lisäys
    function addTask() {
        const taskText = $taskInput.val().trim();

        if (taskText === '') { // tarkistetaan ettei syöte ole tyhjä
            alert('Syötteesi on tyhjä!');
            $taskInput.css('background-color', 'red');
            return;
        }

        if (taskText.length < 2) { // tarkistetaan syötteen pituus
            alert('Syötteesi on liian lyhyt!');
            $taskInput.css('background-color', 'red');
            return;
        }

        $taskInput.css({ borderColor: '', backgroundColor: '' }); // nollataan tyylit

        const $li = $('<li></li>').html(`<span>${taskText}</span>`); // luodaan uusi listaelementti

        $li.on('click', completeTask); // lisätään klikkikuuntelija valmiille tehtävälle

        const $deleteBtn = $('<button>Poista</button>'); // luodaan poista-nappi ja sen toiminnallisuus
        $deleteBtn.on('click', deleteTask);
        $li.append($deleteBtn);

        $li.hide().appendTo($taskList).fadeIn(400); // lisätään animaatiota
        $taskList.show();

        saveTasksToLocalStorage(); // päivitetään localStorage
        $taskInput.val(''); // tyhjennetään syöttökenttä
    }

    function completeTask(event) { // tehtävän merkitseminen valmiiksi
        if (!$(event.target).is('button')) { // tarkistetaan ettei klikattu ole poista-nappi
            const $li = $(this).is('li') ? $(this) : $(this).closest('li');
            $li.toggleClass('completed');
            saveTasksToLocalStorage();
        }
    }

    // tehtävien poistaminen
    function deleteTask(event) {
        event.stopPropagation(); // tehtävät jonoon
        const $taskItem = $(event.target).parent();
        $taskItem.slideUp(300, function () { // animaatio poistettaessa
            $taskItem.remove();
            saveTasksToLocalStorage();
        });
    }

    // tehtävien tallentaminen localStorageen
    function saveTasksToLocalStorage() {
        const tasks = []; 
        $taskList.find('li').each(function () { // käydään läpi kaikki tehtävät
            const taskText = $(this).find('span').text().trim();
            const isCompleted = $(this).hasClass('completed');
            tasks.push({ text: taskText, completed: isCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // tallennetaan JSON-muodossa
    }

    // ladataan tehtävät localStoragesta
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const $li = $('<li></li>').html(`<span>${task.text}</span>`); // luodaan uusi listaelementti
            if (task.completed) $li.addClass('completed');

            $li.on('click', completeTask); // lisätään tapahtumakuuntelija

            const $deleteBtn = $('<button>Poista</button>');
            $deleteBtn.on('click', deleteTask);
            $li.append($deleteBtn);

            $taskList.append($li);
        });
    }

    $taskList.sortable({ // lisätään drag and drop -toiminnallisuus
        update: function () {
            saveTasksToLocalStorage(); // tallentaa uuden järjestyksen
        }
    });


    loadTasksFromLocalStorage(); // ladataan tehtävät kun sivu avataan
    if ($taskList.children().length > 0) {
        $taskList.show();
    }
});

// tehtävien suodattaminen
$('#filter-all').on('click', function () { // kaikki tehtävät
    $('#taskList li').show();
});
  
$('#filter-active').on('click', function () { // aktiiviset tehtävät
    $('#taskList li').show().filter('.completed').hide();
});
  
$('#filter-completed').on('click', function () { // valmiit tehtävät
    $('#taskList li').hide().filter('.completed').show();
});

// lisätään drag & drop
$taskList.sortable({
    update: function () {
        saveTasksToLocalStorage(); // tallennetaan uusi järjestys
    }
});
