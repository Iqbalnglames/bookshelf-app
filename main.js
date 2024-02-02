document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook')
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault()
        addBook()
    })
})
const generateBookID = () => {
    return +new Date()
}

const generateBookObj = (bookId, titleBook, bookAuthor, bookYear, isReaded) => {
    return {
        bookId,
        titleBook,
        bookAuthor,
        bookYear,
        isReaded,
    }
}

const addBook = () => {
    const bookTitle = document.getElementById('inputBookTitle').value
    const bookAuthor = document.getElementById('inputBookAuthor').value
    const bookYear = document.getElementById('inputBookYear').value
    const bookID = generateBookID()
    const booksObj = generateBookObj(bookID, bookTitle, bookAuthor, bookYear, false)
    booksData.push(booksObj)

    document.dispatchEvent(new Event(RENDER_EV))

}

const RENDER_EV = 'render_book_data'
let booksData = []

const bookList = (booksObj) => {
    const textBookTitle = document.createElement('h3')
    textBookTitle.innerText = booksObj.titleBook

    const textBookAuthor = document.createElement('p')
    textBookAuthor.innerText = `Penulis: ${booksObj.bookAuthor}`

    const textBookYear = document.createElement('p')
    textBookYear.innerText = `Tahun: ${booksObj.bookYear}`

    const listBooksContaier = document.createElement('article')
    listBooksContaier.classList.add('book_item')
    listBooksContaier.append(textBookTitle, textBookAuthor, textBookYear)
    listBooksContaier.setAttribute('id', `book-${booksObj.bookId}`)

    if (booksObj.isReaded) {
        const undo_button = document.createElement('button')
        undo_button.classList.add('undo-button')

        undo_button.addEventListener('click', function () {
            undoBookFromReaded(booksObj.id)
        })

        const remove_button = document.createElement('button')
        remove_button.classList.add('remove-button')

        remove_button.addEventListener('click', function () {
            removeBookFromReaded(booksObj.id)
        })

        listBooksContaier.append(undo_button, remove_button)
    } else {
        const checkButton = document.createElement('button')
        checkButton.innerHTML = 'selesai'
        checkButton.classList.add('green')

        checkButton.addEventListener('click', function () {
            addBooktoReaded(booksObj.bookId)
        })

        const buttonContaier = document.createElement('div')
        buttonContaier.classList.add('action')
        buttonContaier.append(checkButton)
        listBooksContaier.append(buttonContaier)
    }

    return listBooksContaier
}

function findBook(bookId) {
    for (const bookItem of booksData) {
        if (bookItem.bookId == bookId) {
            return bookItem
        }
    }
    return null;
}

function addBooktoReaded(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return;

    bookTarget.isReaded = true
    document.dispatchEvent(new Event(RENDER_EV))
}

document.addEventListener(RENDER_EV, function () {
    const incompletedBookList = document.getElementById('incompleteBookshelfList')
    incompletedBookList.innerHTML = ''

    for (const book of booksData) {
        const bookElement = bookList(book)
        if (!book.isReaded) {
            incompletedBookList.append(bookElement)
        }
    }
})