/* === Imports === */
import { initializeApp } from "firebase/app";
import { getDatabase,
        ref,
        push,
        onValue,
        remove } from "firebase/database"
import { getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword } from "firebase/auth"
/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyDGiAWTRYP9ctYGi8hUu8n12Tn0qRtXZ4M",
    authDomain: "gamebrary-22211.firebaseapp.com",
    databaseURL: "https://gamebrary-22211-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gamebrary-22211",
    storageBucket: "gamebrary-22211.appspot.com",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(firebaseConfig.databaseURL)
const shoppingListInDB = ref(database, "shoppingList")

/* === UI === */

/* === UI - Elements ===*/

/* === UI - out-view elements */

const viewLoggedOut = document.getElementById("out-view")
const viewLoggedIn = document.getElementById("in-view")

const signInWithGoogleButtonEl = document.getElementById("google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-btn")
const createAccountButtonEl = document.getElementById("create-acc-btn")

/* === UI - in-view elements === */

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

/* === Main Code ===*/
showLoggedOutView()

/* === Fucntions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    console.log("Sign in with Google") 
}

function authSignInWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showLoggedInView()
        })
        .catch((error) => {
            console.error(error.message)
        })
}

function authCreateAccountWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showLoggedInView()
        })
        .catch((error) => {
            console.error(error.message) 
        })
}

/* == Functions - UI Functions == */

function showLoggedOutView() {
    hideElement(viewLoggedIn)
    showElement(viewLoggedOut)
}

function showLoggedInView() {
    hideElement(viewLoggedOut)
    showElement(viewLoggedIn)
}

function showElement(element) {
    element.style.display = "flex"
}

function hideElement(element) {
    element.style.display = "none"
}

/* === Function in-view ===*/
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}