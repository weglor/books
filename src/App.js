import React, {Component} from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mainTitle: true};
        this.start = this.start.bind(this);
    }

    start() {
        this.setState({mainTitle: !this.state.mainTitle})

    }


    render() {
        return (
            <div>
                {this.state.mainTitle ?
                    <WelcomeScreen start={this.start}/> :
                    <BookCollection/>}
            </div>
        );
    }
}

function WelcomeScreen(props) {
    return (
        <div className="first-screen-wrapper">
            <p className="main-title">Books</p>
            <p className="subtitle">simple manage your home library</p>
            <p className="start-button" onClick={props.start}>let's add some books </p>

        </div>
    )
}

class BookCollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookList: [{author: "Faulkner", id: -4, read: true, title: "Loud and Fury"},
                {author: "Joyce", id: -3, read: false, title: "Ulisses"},
                {author: "Miller", id: -2, read: true, title: "Tropic of Cancer"},
                {author: "Orwell", id: -1, read: true, title: "1984"},
                {author: "Gombrowicz", id: 0, read: true, title: "Kosmos"}
                ],
            sortKey: "id",
            validate: true

        };
        this.addBook = this.addBook.bind(this);
        this.removeBook = this.removeBook.bind(this);
        this.setSortKey = this.setSortKey.bind(this);
        this.toggleRead = this.toggleRead.bind(this);
        this.submit = this.submit.bind(this);
    }


    removeBook(books) {

        const newBookList = this.state.bookList.filter(function (removingBook) {
            return removingBook !== books
        });
        this.setState({bookList: newBookList})


    }

    validate(book) {
        if (book.title === "" && book.author === "") {


            return false
        }
        let duplicates = this.state.bookList.filter(function (item) {
            if (item.title === book.title && item.author === book.author) {
                alert("GEORGE, ZNOWU SIĘ UPIŁEŚ? TA KSIĄŻKA ZNAJDUJE SIĘ JUŻ NA LIŚCIE");
                this.setState({alert: true})
                return true;
            }
        });

        if (duplicates.length > 0) {
            return false
        }

        return true


    }

    addBook(newBook) {
        this.setState({validate: true});

        if (!this.validate(newBook)) {
            this.setState({validate: false});
            return
        }


        this.setState({
                bookList: this.state.bookList.concat(newBook)

            }
        )

    }

    setSortKey(key) {
        this.setState({sortKey: key})
    }


    toggleRead(book) {
        let bookIndex = this.state.bookList.indexOf(book);

        let newList = this.state.bookList.slice();
        newList[bookIndex].read = !newList[bookIndex].read;

        this.setState({bookList: newList});
    }


    submit(book, author, title) {

        let bookData = {author: author, title: title};

        if (!this.validate(bookData)) {
            return
        }

        let bookIndex = this.state.bookList.indexOf(book);
        let newList = this.state.bookList.slice();
        newList[bookIndex].author = author || book.author;
        newList[bookIndex].title = title || book.title;
        this.setState({bookList: newList});


    }


    render() {
        return (
            <div className="main-container">
                <Menu/>
                <InputFields addBook={this.addBook} sortBy={this.sortBy} toggleOrderFunction={this.toggleOrderFunction}
                             cancelToggle={this.cancelToggle}
                             validate={this.state.validate}
                             books={this.state.bookList}
                />


                <BookList books={this.state.bookList} search={this.searchBook} removeBook={this.removeBook}
                          toggleRead={this.toggleRead}
                          submit={this.submit} sortKey={this.state.sortKey}
                          setSortKey={this.setSortKey}

                />


            </div>

        );
    }
}

function Menu() {
    return (
        <div className="nav-wraper">
            <div className="abt">About
                <div className="info">
                    <h3>Books</h3>
                    <p>It's a simple. You can <span className="function-words">ADD</span> book you have in
                        your home library. You can <span className="function-words">SORT</span> and <span
                            className="function-words">
                            SEARCH</span> your book list. You can <span className="function-words">MARK</span> book you
                        didn't read yet. You can <span className="function-words">EDIT</span> its author or title. You
                        can <span className="function-words">REMOVE</span> it.
                        You can manage your Book Collection.
                    </p>
                    <p> But if you don't have books because you hate reading, you can always add the movies. But please,
                        only the good ones:)</p>


                </div>


            </div>
        </div>

    )
}

class InputFields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newBook: {author: "", title: "", id: 0, read: true},
        };

        this.handleChangeAuthor = this.handleChangeAuthor.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.clearInputValue = this.clearInputValue.bind(this);


    }


    handleChangeAuthor(e) {
        let newBook = Object.assign({}, this.state.newBook);
        newBook.author = e.target.value;
        this.setState({newBook});

    }

    handleChangeTitle(e) {
        let newBook = Object.assign({}, this.state.newBook);
        newBook.title = e.target.value;
        this.setState({newBook});
    }

    clearInputValue() {
        const counter = this.state.newBook.id + 1;

        this.setState({newBook: {author: "", title: "", id: counter, read: true}})
    }


    render() {
        return (
            <div className="first-section">

                <input className="input-fields input-field-author"
                       style={{backgroundColor: this.props.validate ? "#cce5ff" : "#ffd6cc"}}
                       type="text"
                       placeholder="Author"
                       value={this.state.newBook.author}
                       onChange={this.handleChangeAuthor}/><br></br>
                <input className="input-fields input-field-title"
                       style={{backgroundColor: this.props.validate ? "#cce5ff" : "#ffd6cc"}}
                       type="text"
                       placeholder="Title"
                       value={this.state.newBook.title}
                       onChange={this.handleChangeTitle}/>
                <button className="add-btn" onClick={() => {
                    this.props.addBook(this.state.newBook);
                    this.clearInputValue()
                }}><i className="fa fa-plus-circle"></i>
                </button>


            </div>
        );
    }
}


class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {valueSearch: "", closeUp: false};
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.closeUpFoo = this.closeUpFoo.bind(this);
    }

    handleChangeSearch(e) {
        this.setState({valueSearch: e.target.value});
    }

    sortBy(array, key) {

        return array.sort(function (obj1, obj2) {
                if (obj1[key] < obj2[key]) return -1;
                else if (obj1[key] > obj2[key]) return 1;
                return 0;
            }
        );
    }

    closeUpFoo() {
        this.setState({closeUp: !this.state.closeUp})
    }


    render() {

        let booksToFiltering = this.props.books;
        let filtered = booksToFiltering.filter(
            book => book.author.toLocaleLowerCase().includes(this.state.valueSearch.toLocaleLowerCase()) ||
                book.title.toLocaleLowerCase().includes(this.state.valueSearch.toLocaleLowerCase())
        );
        let sorted = this.sortBy(filtered, this.props.sortKey);


        return (

            <div className="second-section">
                <div className="search-sort-wrapper">
                    <input className="input-search" placeholder="Search" value={this.state.valueSearch}
                           onChange={this.handleChangeSearch}/>
                    <SortButtons className="sort-btn-class" setSortKey={this.props.setSortKey}/>
                </div>
                <div className="counter">{this.props.books.length}</div>


                <div className={this.state.closeUp ? "close-up" : "book-wrapper"} onDoubleClick={this.closeUpFoo}>
                    <div className="close-up-btn" onClick={this.closeUpFoo}>
                        <i class="fa fa-search-plus"></i></div>
                    {sorted.map((book, index) =>
                        <Book book={book}
                              removeBook={this.props.removeBook}
                              toggleRead={this.props.toggleRead}
                              submit={this.props.submit}
                              closeUp={this.state.closeUp}

                        />
                    )}
                </div>
            </div>
        )
    }

}

class SortButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sortAuthor: false, sortTitle: false, sortAdded: true};
        this.toggleSort = this.toggleSort.bind(this);
    }


    toggleSort(key) {
        this.setState({sortAuthor: false, sortTitle: false, sortAdded: false});

        if (key === "author") {
            this.setState({sortAuthor: true})

        }
        if (key === "title") {
            this.setState({sortTitle: true})
        }

        if (key === "id") {
            this.setState({sortAdded: true})
        }

    }

    render() {
        let className = "sortAuthor-btn sort-btn";
        let activeGold = className + " active-gold";
        let activeBlue = className + " active-blue";
        let activePink = className + " active-pink";


        return (
            <div className="sort-btns-container">
                <button onClick={() => {
                    this.props.setSortKey("author");
                    this.toggleSort("author")
                }} className={this.state.sortAuthor ? activeGold : className}>by author
                </button>
                <button onClick={() => {
                    this.props.setSortKey("title");
                    this.toggleSort("title")
                }} className={this.state.sortTitle ? activeBlue : className}>by title
                </button>
                <button onClick={() => {
                    this.props.setSortKey("id");
                    this.toggleSort("id")
                }} className={this.state.sortAdded ? activePink : className}>by added
                </button>
            </div>
        )
    }
}


class Book extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            valueAuthor: "",
            valueTitle: "",
            showEditButtons: false,
            validateEditState: true
        };
        this.editModeToggle = this.editModeToggle.bind(this);
        this.handleChangeEditAuthor = this.handleChangeEditAuthor.bind(this);
        this.handleChangeEditTitle = this.handleChangeEditTitle.bind(this);
        this.clearValueAuthorAndTitle = this.clearValueAuthorAndTitle.bind(this);
        this.showEditButtons = this.showEditButtons.bind(this);
        this.toggleEditBtn = this.toggleEditBtn.bind(this);

        this.change = this.change.bind(this);

    }

    editModeToggle() {
        this.setState({validateEditState: true});
        this.setState({editMode: !this.state.editMode});
    }

    handleChangeEditAuthor(e) {

        this.setState({valueAuthor: e.target.value})

    }

    handleChangeEditTitle(e) {
        this.setState({valueTitle: e.target.value})
    }

    clearValueAuthorAndTitle() {
        this.setState({valueAuthor: "", valueTitle: ""})
    }

    toggleEditBtn() {
        this.setState({showEditButtons: false})
    }

    showEditButtons() {

        this.setState({showEditButtons: true})
    }

    change() {
        if (this.state.valueAuthor === " " && this.state.valueTitle === " ") {
            this.setState({validateEditState: false});
            return
        }

        this.props.submit(this.props.book, this.state.valueAuthor, this.state.valueTitle);
        this.clearValueAuthorAndTitle();
        this.editModeToggle()
    }


    render() {
        return (
            <div className="book-container">
                {this.state.editMode ?
                    <div className="edit-btns-container">
                        <input className="input-edit"
                               style={{backgroundColor: this.state.validateEditState ? "antiquewhite" : "#ffd6cc"}}
                               placeholder={this.props.book.author}
                               value={this.state.valueAuthor}
                               onChange={this.handleChangeEditAuthor}/>
                        <input className="input-edit"
                               style={{backgroundColor: this.state.validateEditState ? "antiquewhite" : "#ffd6cc"}}
                               placeholder={this.props.book.title} value={this.state.valueTitle}
                               onChange={this.handleChangeEditTitle}/>
                        <EditButtons
                            removeBook={this.props.removeBook}
                            toggleRead={this.props.toggleRead}
                            editMode={this.state.editMode}
                            book={this.props.book}

                            editModeToggle={this.editModeToggle}
                            change={this.change}

                        />
                    </div> :
                    <div className="edit-btns-container" onMouseEnter={this.showEditButtons}
                         onMouseLeave={this.toggleEditBtn}>
                        <div className="book" style={{color: this.props.book.read ? 'rgba(0,0,0, .9)' : 'red'}}>
                            {this.props.book.author}, {this.props.book.title}
                        </div>
                        <div className={this.state.showEditButtons ? "editBtn" : "editBtn2"}>
                            {this.props.closeUp &&
                            <EditButtons
                                removeBook={this.props.removeBook}
                                toggleRead={this.props.toggleRead}
                                editMode={this.state.editMode}
                                book={this.props.book}

                                editModeToggle={this.editModeToggle}
                                clearValueAuthorAndTitle={this.clearValueAuthorAndTitle}
                                valueAuthor={this.state.valueAuthor}
                                valueTitle={this.state.valueTitle}
                                change={this.change}

                            />}
                        </div>

                    </div>


                }


            </div>

        )
    }
}

class EditButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="btns-container">
                <button className="edit-btns edit-btns-trash" onClick={() => this.props.removeBook(this.props.book)}>
                    <i className="fa fa-trash"></i></button>
                <button className="edit-btns edit-btns-mark" onClick={() => this.props.toggleRead(this.props.book)}>
                    <i className="fa fa-bookmark"></i></button>


                <button className="edit-btns edit-btns-edit"
                        onClick={() => {
                            this.props.editMode ? this.props.change() : this.props.editModeToggle()
                        }}><i className="fa fa-edit"></i></button>
            </div>
        )
    }
}


export default App;
