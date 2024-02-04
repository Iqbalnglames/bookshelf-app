//event ketika berkas berhasil di load semua
document.addEventListener('DOMContentLoaded', function () {
    if(isStorageExist()) {
        loadDataFromStorage()
    }    
    const submitBook = document.getElementById('inputBook')
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault()
        addBook()       
    })
})

const RENDER_EV = 'render_book_data'
const SAVED_BOOKS = 'saved-books-data'
const BOOKS_KEY = 'books-data'
let booksData = []

//fungsi untuk generate id buku berdasarkan tanggal input
function generateBookID()  {
    return +new Date()
}

//fungsi untuk generate data ke dalam bentuk object 
const generateBookObj = (id, title, author, year, isComplete) => {
    return {
        id,
        title, 
        author,
        year,
        isComplete
    }
}

//fungsi untuk mengecek apakah localstorage tersedia di browser
function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert ('browser tidak memiliki local storage')
        return false
    }
    return true
}

//fungsi untuk load data dari localstorage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKS_KEY)
    let data = JSON.parse(serializedData)

    if(data !== null) {
        for (const books of data) {
            booksData.push(books)
        }
    }
    document.dispatchEvent(new Event(RENDER_EV))
}

//fungsi menyimpan buku ke localstorage
function saveBooksData() {
    if(isStorageExist()) {      
        const parsedBooks = JSON.stringify(booksData)
        localStorage.setItem(BOOKS_KEY, parsedBooks)
        document.dispatchEvent(new Event(SAVED_BOOKS))
    }
}
document.addEventListener(SAVED_BOOKS, function() {
    console.log(localStorage.getItem(BOOKS_KEY))
})

//fungsi menambahkan buku
 function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value
    const bookAuthor = document.getElementById('inputBookAuthor').value
    const bookYear = parseInt(document.getElementById('inputBookYear').value) 
    console.log(typeof(bookYear))
    const bookID = generateBookID()
    const readedChecker = document.getElementById('inputBookIsComplete')
    const readedChecked = readedChecker.checked ? true : false
    const booksObj = generateBookObj(bookID, bookTitle, bookAuthor, bookYear, readedChecked)
    booksData.push(booksObj)
    
    document.dispatchEvent(new Event(RENDER_EV))
    saveBooksData()
}

//membuat elemen booklist
 function bookList(booksObj) {

    const textBookTitle = document.createElement('h3')
    textBookTitle.innerText = booksObj.title

    const textBookAuthor = document.createElement('p')
    textBookAuthor.innerText = `Penulis: ${booksObj.author}`

    const textBookYear = document.createElement('p')
    textBookYear.innerText = `Tahun: ${booksObj.year}`

    const listBooksContaier = document.createElement('article')
    listBooksContaier.classList.add('book_item')
    listBooksContaier.append(textBookTitle, textBookAuthor, textBookYear)
    listBooksContaier.setAttribute('id', `book-${booksObj.id}`)

        if (booksObj.isReaded) {

            const undo_button = document.createElement('button')
            undo_button.innerHTML = 'Belum Selesai Dibaca'
            undo_button.classList.add('green')

            undo_button.addEventListener('click', function () {
                undoBookFromReaded(booksObj.bookId)
            })

            const remove_button = document.createElement('button')
            remove_button.innerHTML = 'Hapus Buku'
            remove_button.classList.add('red')

            remove_button.addEventListener('click', function () {
                removeBookFromReaded(booksObj.bookId)
            })
            const buttonContaier = document.createElement('div')
            buttonContaier.classList.add('action')
            buttonContaier.append(undo_button, remove_button)
            listBooksContaier.append(buttonContaier)

        } else {

            const checkButton = document.createElement('button')
            checkButton.innerHTML = 'selesai'
            checkButton.classList.add('green')

            checkButton.addEventListener('click', function () {
                addBooktoReaded(booksObj.bookId)            
            })

            const remove_button = document.createElement('button')
            remove_button.innerHTML = 'Hapus Buku'
            remove_button.classList.add('red')

            remove_button.addEventListener('click', function () {
                removeBookFromReaded(booksObj.bookId)
            })

            const buttonContaier = document.createElement('div')
            buttonContaier.classList.add('action')
            buttonContaier.append(checkButton, remove_button)
            listBooksContaier.append(buttonContaier)

        }
    return listBooksContaier
}

//fungsi untuk menemukan id buku
function findBook(bookId) {
    for (const bookItem of booksData) {
        if (bookItem.bookId == bookId) {
            return bookItem
        }
    }
    return null;
}

//fungsi untuk menambahkan buku yang telah selesai dibaca
function addBooktoReaded(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return;

    bookTarget.isReaded = true
    document.dispatchEvent(new Event(RENDER_EV))
    saveBooksData()
}

//fungsi findBookIndex
function findBookIndex(bookId) {
    for (const index in booksData) {
        if(booksData[index].bookId === bookId) {
            return index
        }
    }
    return -1
}

//fungsi untuk menghapus buku 
function removeBookFromReaded(bookId) {
    const bookTarget = findBookIndex(bookId)
    
    if(bookTarget === -1) return;

    booksData.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EV))
    saveBooksData()
}

//fungsi untuk undo
function undoBookFromReaded(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return;

    bookTarget.isReaded = false
    document.dispatchEvent(new Event(RENDER_EV))
    saveBooksData()
}

//render list buku
document.addEventListener(RENDER_EV, function () {
    const incompletedBookList = document.getElementById('incompleteBookshelfList')
    incompletedBookList.innerHTML = ''

    const completedBookList = document.getElementById('completeBookshelfList')
    completedBookList.innerHTML = ''

    for (const book of booksData) {
        const bookElement = bookList(book)
        if (book.isReaded) {
            completedBookList.append(bookElement)
        } else {
            incompletedBookList.append(bookElement)
        }
        
    }
})