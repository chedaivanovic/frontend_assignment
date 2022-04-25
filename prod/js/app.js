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
let newBtn = {
    id: '0',
    name: 'New',
    new_name: '',
    isDescriptionRequired: ''
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
        name: 'Super Books',
        id: '1'
    },
    {
        name: 'Star Books',
        id: '2'
    },
    {
        name: 'Read&Advance',
        id: '3'
    }
]
let formats = [
    {
        name: 'A4',
        id: '1'
    },
    {
        name: 'A5',
        id: '2'
    },
    {
        name: 'A2',
        id: '3'
    }
]
let langs = [
    {
        name: 'Serbian',
        id: '1'
    },
    {
        name: 'Deutch',
        id: '2'
    },
    {
        name: 'English',
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
    //Footer Buttons
    let createFooterBtnPrev = (location) => {
        let backBtn = crEl('button');
        backBtn.classList.add('footer-btn', 'footer-btn-back');
        backBtn.id = 'back-btn';
        backBtn.type = 'button';
        backBtn.innerHTML = 'Back';
        backBtn.addEventListener('click', (e) => {
            switch (currentPage) {
                case (4):
                    currentPage--;
                    page3();
                    break;
                case (3):
                    currentPage--;
                    page2(theBook.selected_genre);
                    break;
                case (2):
                    currentPage--;
                    page1();
                    break;
            }
        });
        location.append(backBtn);
    }
    let createFooterBtnNext = (location) => {
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
                    inputName = 'nogenre';
            }
            let inpSelect = appBody.querySelector(`input[name="select-${inputName}"]:checked`);
            let selectedValue;
            if (inpSelect) {
                selectedValue = parseInt(inpSelect.value);
            } else {
                selectedValue = getClass('subgenre-input')[0].value;
                theBook.selected_subgenre = selectedValue;
                newBtn.new_name = selectedValue;
                if (getId('new-subgenred-req-check').checked)
                    newBtn.isDescriptionRequired = true;
                else
                    newBtn.isDescriptionRequired = false;
                currentPage++;
                finalPage(newBtn);
            }
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
        location.append(nextBtn);
    }
    let createFooterBtnAdd = (location) => {
        let addBtn = crEl('input');
        addBtn.classList.add('footer-btn', 'footer-btn-add');
        addBtn.id = 'add-btn';
        addBtn.value = 'Add';
        addBtn.type = 'submit';
        location.append(addBtn);
    }
    //Form Elements (inputs, select, labels, textareas)
    let createFormEl = (destination, tagName, inpType, plHold, tagId, optionsArr = '', requir = false) => {
        let newInput = crEl(tagName);
        newInput.type = inpType;
        newInput.id = tagId;
        if (tagName === 'select') {
            newInput.placeholder = plHold;
            for (let option of optionsArr) {
                let newOption = crEl('option');
                newOption.value = option.id;
                newOption.innerHTML = option.name;
                newInput.append(newOption);
            }
        } else if (inpType != 'date') {
            newInput.placeholder = plHold;
        } else {
            newInput.max = new Date().toISOString().split("T")[0];
        }
        if (tagName === 'textarea' && requir === true) {
            newInput.setAttribute('required', requir);
        } else if (inpType === 'checkbox') {
            newInput.setAttribute('required', false)
        } else if (inpType === 'number') {
            newInput.min = 1;
        } else if (tagName != 'textarea') {
            newInput.setAttribute('required', true);
        }
        let bookInpLabel = crEl('label');
        bookInpLabel.classList.add('unstyled-label');
        bookInpLabel.setAttribute('for', tagId);
        bookInpLabel.innerHTML = plHold;
        if (inpType === 'checkbox') {
            destination.append(newInput);
            destination.append(bookInpLabel);
        } else {
            destination.append(bookInpLabel);
            destination.append(newInput);
        }
    }
    //Enable - Disable Next Button Functions
    let unDisable = () => {
        getId('next-btn').removeAttribute('disabled');
        getId('next-btn').classList.remove('disabled');
    }
    let addDisable = () => {
        getId('next-btn').setAttribute('disabled', true);
        getId('next-btn').classList.add('disabled');
    }
    let selectBreadcrumb = () => {
        let cp = currentPage;
        let allBcs = getClass('breadcrumb');
        for (let breadc of allBcs) {
            if (breadc.classList.contains('bc-active'))
                breadc.classList.remove('bc-active');
        };
        let cpBreadcrumb = getClass(`breadcrumb-${cp}`);
        for (cpBc of cpBreadcrumb) {
            cpBc.classList.add('bc-active');
        }
    }
    let showLongBcs = () => {
        getId('breadcrumb-dots').style.display = 'none';
        getId('breadcrumbs-short').style.display = 'none';
        getId('breadcrumbs-long').style.display = 'flex';
    }
    let showShortBcs = () => {
        getId('breadcrumb-dots').style.display = 'none';
        getId('breadcrumbs-long').style.display = 'none';
        getId('breadcrumbs-short').style.display = 'flex';
    }
    let showBcDots = () => {
        getId('breadcrumbs-long').style.display = 'none';
        getId('breadcrumbs-short').style.display = 'none';
        getId('breadcrumb-dots').style.display = 'flex';
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
        showBcDots();
        selectBreadcrumb();
        createFooterBtnNext(appFooter);
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
        });
        showBcDots();
        selectBreadcrumb();
        createFooterBtnPrev(appFooter);
        createFooterBtnNext(appFooter);
    }

    let page3 = () => {
        empty(appBody);
        empty(appFooter);
        let newInput = crEl('input');
        newInput.type = 'text';
        newInput.classList.add('subgenre-input');
        newInput.placeholder = 'Subgenre name';
        newInput.setAttribute('required', true);
        appBody.append(newInput);
        createFormEl(appBody, 'input', 'checkbox', 'Description is requiered for this subgenre', 'new-subgenred-req-check',);

        createFooterBtnPrev(appFooter);
        createFooterBtnNext(appFooter);

        let subgenreInp = getClass('subgenre-input')[0];

        subgenreInp.addEventListener('keyup', () => {
            if (subgenreInp.value.length > 2 && document.getElementById('next-btn').classList.contains('disabled')) {
                unDisable();
            } else if (subgenreInp.value.length <= 2 && !document.getElementById('next-btn').classList.contains('disabled')) {
                addDisable();
            }
        })
        showLongBcs();
        selectBreadcrumb();
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
        finalForm.setAttribute('method', 'POST');
        finalForm.setAttribute('action', 'postbook.js')

        createFormEl(finalForm, 'input', 'text', 'Book Title', 'book-title');
        createFormEl(finalForm, 'input', 'text', 'Book Author', 'book-author');
        createFormEl(finalForm, 'input', 'text', 'ISBN', 'book-isbn');
        createFormEl(finalForm, 'select', 'text', 'Publisher', 'select-publisher', publishers);
        createFormEl(finalForm, 'input', 'date', 'Date published', 'book-date');
        createFormEl(finalForm, 'input', 'number', 'Number of pages', 'book-pages');
        createFormEl(finalForm, 'select', 'text', 'Book format', 'select-format', formats);
        createFormEl(finalForm, 'input', 'number', 'Edition', 'book-edition');
        createFormEl(finalForm, 'select', 'text', 'Book language', 'select-lang', langs);
        createFormEl(finalForm, 'textarea', 'text', 'Description', 'book-description', '', isDescReq);

        let formBtnsDiv = crEl('div');
        formBtnsDiv.classList.add('form-footer-btns');
        createFooterBtnPrev(formBtnsDiv);
        createFooterBtnAdd(formBtnsDiv);
        finalForm.append(formBtnsDiv);

        appBody.append(finalForm);
        if(getId('breadcrumbs-long').style.display === 'none')
            showShortBcs();
        selectBreadcrumb();
        getId('book-form').addEventListener('submit', function (e) {
            e.preventDefault();
            if (newBtn.new_name != '')
                theBook.selected_subgenre.name = newBtn.new_name;
            theBook.book_title = getId('book-title').value;
            theBook.book_author = getId('book-author').value;
            theBook.book_ISBN = getId('book-isbn').value;
            theBook.book_publisher = publishers.find(publ => publ.id === getId('select-publisher').value).name;
            theBook.book_date = getId('book-date').value;
            theBook.book_pagesno = getId('book-pages').value;
            theBook.book_format = formats.find(fmat => fmat.id === getId('select-format').value).name;
            theBook.book_edition = getId('book-edition').value;
            theBook.book_lang = langs.find(lng => lng.id === getId('select-lang').value).name;
            theBook.book_description = getId('book-description').value != '' ? getId('book-description').value : 'User did not enter the description for this Book!';

            console.log('NEW BOOK INPUT!', '\n',
                `Book Name: ${theBook.book_title}`, '\n',
                `Book author: ${theBook.book_author}`, '\n',
                `Genre & Subgenre: ${theBook.selected_genre.name}, ${theBook.selected_subgenre.name}`, '\n',
                `Book ISBN: ${theBook.book_ISBN}`, '\n',
                `Book Publisher: ${theBook.book_publisher}`, '\n',
                `Book publish date: ${theBook.book_date}`, '\n',
                `Number of pages: ${theBook.book_pagesno} pages`, '\n',
                `Book Format: ${theBook.book_format}`, '\n',
                `Edition: ${theBook.book_edition}`, '\n',
                `Edition Language: ${theBook.book_lang}`, '\n',
                `Short description: ${theBook.book_description}`);
            getId('app').style.display = 'none';
            getId('app-success').style.display = 'block';
            getId('button-success').addEventListener('click', () => {
                theBook = {
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
                newBtn.name = 'New';
                newBtn.new_name = '';
                newBtn.isDescriptionRequired = '';

                currentPage = 1;
                page1();
                getId('app-success').style.display = 'none';
                getId('app').style.display = 'block';
            });
        });
    }

    page1();
});