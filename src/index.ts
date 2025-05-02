
import { v4 as uuidV4 } from "uuid"

// crate types for task
type Task = {
    id : string;
    title : string;
    completed : boolean;
    createdAt : Date
}

const list = document.querySelector<HTMLUListElement>("#todo-list")
const form = document.getElementById("todo-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#todo-input")

// load saved tasks
const tasks : Task[] = loadTasks()
tasks.forEach(addListItems)

// add new tasks
form?.addEventListener("submit", e => {
    e.preventDefault()

    if(input?.value == "" || input?.value == null) return

    const newTask : Task = {
        id : uuidV4(),
        title: input.value,
        completed : false,
        createdAt : new Date()
    }

    tasks.push(newTask)
    saveTasks()
    
    addListItems(newTask)
    input.value = ""
})

function addListItems(task : Task){
    const item = document.createElement("li")
    item.classList.add("todo-item") // for  styling

    const label = document.createElement("label")
    label.style.display = "flex"
    label.style.alignItems = "center"
    label.style.flex = "1"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = task.completed
    checkbox.classList.add("todo-checkbox")

    const span = document.createElement("span")
    span.textContent = task.title
    span.classList.add("todo-text")

    if(task.completed){
        item.classList.add("compleated")
    }

    checkbox.addEventListener("change", () => {
        task.completed =checkbox.checked
        item.classList.toggle("compleated", task.completed)
        console.log(tasks)
        saveTasks()
    })

    // delete button
    const deletebutton = document.createElement("button")
    deletebutton.textContent = "🗑️"
    deletebutton.classList.add("delete-button")

    deletebutton.addEventListener("click", () => {
        const index =  tasks.findIndex(t => t.id == task.id)
        if(index !== -1){
            tasks.splice(index, 1)
            saveTasks()
            item.remove() // remove the task from the list
        }
    })

    checkbox.checked = task.completed
    label.append(checkbox, span)
    item.append(label, deletebutton)
    list?.append(item)
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks))
}


function loadTasks() : Task[]{
    const taskJSON = localStorage.getItem("TASKS")
    if(taskJSON == null) return []

    return JSON.parse(taskJSON)
}