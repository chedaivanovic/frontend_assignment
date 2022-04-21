let getId = (idName) => {
    return document.getElementById(idName);
}
let getClass = (className) => {
    return document.getElementsByClassName(className);
}
let crEl = (tagName) => {
    return document.createElement(tagName);
}
let empty = (section) => {
    section.innerHTML = '';
}

let currentPage = 1;
let theBook = {
    selected_genre: '',
    selected_subgenre: '',
    book_title: '',
    book_author: '',
    book_ISBN: '',
    book_publisher: '',
    book_date: '',
    book_pagesno: '',
    book_format: '',
    book_edition: '',
    book_lang: '',
    book_description: ''
};
const newBtn = {
    id: '0',
    name: 'New'
};
let authors = [
    {
        name: 'Beck Villanueva',
        id: '1'
    },
    {
        name: 'Anastasia Morales',
        id: '2'
    },
    {
        name: 'Shelby Larsen',
        id: '3'
    },
    {
        name: 'Sheikh Fuentes',
        id: '4'
    },
    {
        name: 'Ishaq Nieves',
        id: '5'
    },
    {
        name: 'Mohsin Gamble',
        id: '6'
    },
    {
        name: 'Hugo Finney',
        id: '7'
    },
    {
        name: 'Viola Britton',
        id: '8'
    },
    {
        name: 'Rumaisa James',
        id: '9'
    },
    {
        name: 'Jasleen Bright',
        id: '10'
    }
]
let publishers = [
    {
        name: 'Publisher 1',
        id: '1'
    },
    {
        name: 'Publisher 2',
        id: '2'
    },
    {
        name: 'Publisher 3',
        id: '3'
    }
]
let formats = [
    {
        name: 'Format 1',
        id: '1'
    },
    {
        name: 'Format 2',
        id: '2'
    },
    {
        name: 'Format 3',
        id: '3'
    }
]
let langs = [
    {
        name: 'Language 1',
        id: '1'
    },
    {
        name: 'Language 2',
        id: '2'
    },
    {
        name: 'Language 3',
        id: '3'
    }
]
let createButton = (obj, info = 'disabled') => {
    let newButton = crEl('input');
    newButton.classList.add('global-button', `${info}-button`);
    newButton.setAttribute('type', 'radio');
    newButton.id = `${info === 'new' ? 'subgenre' : info}-${obj.id}`;
    newButton.setAttribute('name', `select-${info === 'new' ? 'subgenre' : info}`);
    newButton.value = obj.id;
    let newLabel = crEl('label');
    newLabel.setAttribute('for', `${info === 'new' ? 'subgenre' : info}-${obj.id}`);
    newLabel.innerHTML = obj.name;
    appBody.append(newButton, newLabel);
}

//Get components
const appHolder = getId('app');
const appHeading = getId('app-heading');
const appBody = getId('app-body');
const appFooter = getId('app-footer');
const appSuccess = getId('app-success');

fetch(`/data/data.json`).then(response => {
    return response.json();
}).then(data => {
    let createFooterBtns = () => {
        if (currentPage != 1) {
            let backBtn = crEl('button');
            backBtn.classList.add('disabled', 'footer-btn', 'footer-btn-back');
            backBtn.id = 'back-btn';
            backBtn.innerHTML = 'Back';
            appFooter.append(backBtn);
        }
        let nextBtn = crEl('button');
        nextBtn.classList.add('disabled', 'footer-btn', 'footer-btn-next');
        nextBtn.disabled = true;
        nextBtn.id = 'next-btn';
        nextBtn.innerHTML = 'Next';
        nextBtn.addEventListener('click', () => {
            let inputName;
            switch (currentPage) {
                case (1):
                    inputName = 'genre';
                    break;
                case (2):
                    inputName = 'subgenre';
                    break;
                default:
                    inputName = 'some';
            }
            let selectedValue = parseInt(appBody.querySelector(`input[name="select-${inputName}"]:checked`).value);
            switch (currentPage) {
                case (1):
                    currentPage++;
                    const selectedGenre = data.genres.find(allGenres => allGenres.id === parseInt(selectedValue));
                    page2(selectedGenre);
                    break;
                case (2):
                    currentPage++;
                    if (selectedValue === 0) {
                        page3();
                    } else {
                        const selectedSubGenre = theBook.selected_genre.subgenres.find(allGenres => allGenres.id === parseInt(selectedValue));
                        finalPage(selectedSubGenre);
                    }
                    break;
            };
        });
        appFooter.append(nextBtn);
    }

    let unDisable = () => {
        getId('next-btn').removeAttribute('disabled');
    }
    // Pages
    let page1 = () => {
        empty(appBody);
        empty(appFooter);
        for (genre of data.genres) {
            createButton(genre, 'genre');
            getId(`genre-${genre.id}`).addEventListener('click', () => {
                if (getId('next-btn').disabled == true) {
                    unDisable()
                }
            })
        }
        createFooterBtns();
    }

    let page2 = (selectedGenre) => {
        theBook.selected_genre = selectedGenre;
        empty(appBody);
        empty(appFooter);
        for (subgenre of selectedGenre.subgenres) {
            createButton(subgenre, 'subgenre');
            getId(`subgenre-${subgenre.id}`).addEventListener('click', () => {
                if (getId('next-btn').disabled == true) {
                    unDisable()
                }
            })
        };
        createButton(newBtn, 'new');
        getId(`subgenre-0`).addEventListener('click', () => {
            if (getId('next-btn').disabled == true) {
                unDisable();
            }
        })
        createFooterBtns();
    }

    let page3 = () => {
        empty(appBody);
        empty(appFooter);
        let newPageInput = crEl('input');
        newPageInput.type = 'text';
        newPageInput.placeholder = 'Subgenre name';
        newPageInput.id = 'new-subgenre-name';
        appBody.append(newPageInput);
        createFooterBtns();
    }

    let finalPage = (selectedSubGenre) => {
        theBook.selected_subgenre = selectedSubGenre;
        let isDescReq = false;
        if (selectedSubGenre.isDescriptionRequired === true) {
            isDescReq = true;
        };
        empty(appBody);
        empty(appFooter);
        let finalForm = crEl('form');
        finalForm.id = 'book-form';
        let formInputs = [];
        let bookTitle = crEl('input');
        bookTitle.type = 'text';
        bookTitle.placeholder = 'Book title';
        formInputs[0] = bookTitle;

        let bookAuthor = crEl('select');
        bookAuthor.id = 'select-author';
        for(let author of authors){
            let newOption = crEl('option');
            newOption.value = author.id;
            newOption.innerHTML = author.name;
            newOption.id = `author-${author.id}`;
            bookAuthor.append(newOption);
        }
        formInputs[1] = bookAuthor;

        let bookISBN = crEl('input');
        bookISBN.id = 'book-isbn';
        bookISBN.placeholder = 'ISBN';
        bookISBN.type = 'text';
        formInputs[2] = bookISBN;

        let bookPublisher = crEl('select');
        bookPublisher.id = 'select-publisher';
        for(let publisher of publishers){
            let newOption = crEl('option');
            newOption.value = publisher.id;
            newOption.innerHTML = publisher.name;
            newOption.id = `publisher-${publisher.id}`;
            bookPublisher.append(newOption);
        }
        formInputs[3] = bookPublisher;

        let bookDate = crEl('input');
        bookDate.id = 'book-date';
        bookDate.placeholder = 'Date published';
        bookDate.type = 'date';
        formInputs[4] = bookDate;

        let bookPages = crEl('input');
        bookPages.id = 'book-pages';
        bookPages.placeholder = 'Number of pages';
        bookPages.type = 'number';
        formInputs[5] = bookPages;

        let bookFormat = crEl('select');
        bookFormat.id = 'select-format';
        for(let format of formats){
            let newOption = crEl('option');
            newOption.value = format.id;
            newOption.innerHTML = format.name;
            newOption.id = `format-${format.id}`;
            bookFormat.append(newOption);
        }
        formInputs[6] = bookFormat;

        let bookEdition = crEl('input');
        bookEdition.id = 'book-edition';
        bookEdition.placeholder = 'Edition';
        bookEdition.type = 'number';
        formInputs[7] = bookEdition;

        let bookLangs = crEl('select');
        bookLangs.id = 'select-lang';
        for(let lang of langs){
            let newOption = crEl('option');
            newOption.value = lang.id;
            newOption.innerHTML = lang.name;
            newOption.id = `lang-${lang.id}`;
            bookLangs.append(newOption);
        }
        formInputs[8] = bookLangs;

        let bookDescription = crEl('textarea');
        bookDescription.id = 'book-description';
        bookDescription.placeholder = 'Description';
        bookDescription.type = 'number';
        formInputs[9] = bookDescription;
        console.log(formInputs)
        for(let formInp of formInputs){
            console.log(formInp);
            let bookInpLabel = crEl('label');
            bookInpLabel.classList.add('unstyled-label');
            bookInpLabel.setAttribute('for', formInp.id);
            bookInpLabel.innerHTML = formInp.placeholder;
            appBody.append(bookInpLabel);
            appBody.append(formInp);
        }
    }

    page1();
});