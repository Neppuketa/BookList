// Book Class: Represents a Book
class Book {
  constructor(title, author, series) {
    this.title = title;
    this.author = author;
    this.series = series;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.series}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Vanish in 2 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#series").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(series) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.series === series) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //prevent actual submit
  e.preventDefault();
  // form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const series = document.querySelector("#series").value;

  // Validate
  if (title === "" || author === "" || series === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instatiate book
    const book = new Book(title, author, series);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //Remove boko from UI
  UI.deleteBook(e.target);

  //remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show delete message
  UI.showAlert("Book Removed", "warning");
});
