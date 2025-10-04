let inputTask = document.getElementById("inputTask")
let addTaskBtn = document.getElementById("addTaskBtn")
let parent = document.querySelector(".main")
let mainDiv = document.querySelector(".mainDiv")
let taskList = document.querySelector(".section2")
let taskSection = document.querySelector(".task_section")



let taskArr = JSON.parse(localStorage.getItem("tasks")) || []
console.log(JSON.parse(localStorage.getItem("tasks")))


function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(taskArr))
}

function renderTask(taskObj){

    //task container
    const taskContainer = document.createElement("div")
    taskContainer.className = "taskContainer"

    //checkbox div
    const taskStsDiv = document.createElement("div")
    taskStsDiv.className = "taskStsDiv"

    let cb = document.createElement("input")
    cb.type = "checkbox"
    cb.className = "checkbox"

    cb.addEventListener("change",function(){
        let check = cb.checked
        console.log(check,"check value")
        let taskTextDiv = taskContainer.querySelector(".taskTextDiv")

        if(check === true){
            taskTextDiv.style.textDecoration = "line-through"
            taskObj.sts = true
        saveTasks()

        }
        else if(check === false){
            taskTextDiv.style.textDecoration ="none"
            taskObj.sts = false
        saveTasks()

        }

    })

    //text div
    const taskTextDiv = document.createElement("div")
    taskTextDiv.className = "taskTextDiv"
    taskTextDiv.innerText = taskObj.description || inputTask.value

    if(taskObj.sts === true){
        taskTextDiv.style.textDecoration = "line-through"
        cb.checked = true
    }
    else if(taskObj.sts === false){
        taskTextDiv.style.textDecoration = "none"
        cb.checked =false
    }
    console.log(inputTask.value,"inputtask val")

    //edit div
    const taskControlDiv = document.createElement("div")
    taskControlDiv.className = "taskControlDiv"

    //edit
    let taskEditDiv = document.createElement("div")
    taskEditDiv.className = "taskEditDiv"
    const editIcon = document.createElement("i")
    editIcon.className = "bi bi-pencil-square"
    taskEditDiv.appendChild(editIcon)
    taskControlDiv.appendChild(taskEditDiv)

    editIcon.addEventListener("click",function(e){
        let addTaskDiv = taskContainer.querySelector(".taskTextDiv")
        let editTask = taskContainer.querySelector(".editInput")
        console.log(addTaskDiv, "addTaskDiv")

        if(addTaskDiv && !editTask){
            cb.setAttribute("disabled", true)
            let editInput = document.createElement("input")
            editInput.type = "text"
            editInput.className = "editInput"
            editInput.value = addTaskDiv.innerText
            addTaskDiv.replaceWith(editInput)
            editInput.focus()
            console.log(editInput.value, "editinput value")
            saveTasks()
   
        }
        else if(editTask){
            cb.removeAttribute("disabled")
            let newEditedVal = document.createElement("div")
            newEditedVal.className = "taskTextDiv"
            newEditedVal.innerText = editTask.value
            console.log(editTask.value,"new edited value")
            editTask.replaceWith(newEditedVal)
            taskObj.description = newEditedVal.innerText
             
            console.log(taskObj.description,"taskobj description", "edited val innnerte", newEditedVal.innerText)
            saveTasks()
        }

    })
 
    //remove
    const taskRemoveDiv = document.createElement("div")
    taskRemoveDiv.className = "taskRemoveDiv"
    const delIcon = document.createElement("i")
    delIcon.className = "bi bi-trash-fill"
    delIcon.style.color = "#af0a0a"
    taskRemoveDiv.appendChild(delIcon)
    taskControlDiv.appendChild(taskRemoveDiv)

    delIcon.addEventListener("click",function(e){
        let taskContainer = e.target.closest(".taskContainer")
        let index = taskArr.findIndex((arr)=> arr.description === taskObj.description)
        console.log(index, "index of the deleted item")
        taskArr.splice(index,1)
        taskContainer.remove() 
        console.log("task container", taskContainer)    
        saveTasks()
        console.log("task arrya after deleting array of specific", taskArr)      
    })

    
    taskStsDiv.appendChild(cb)
    taskContainer.appendChild(taskStsDiv)
    taskContainer.appendChild(taskTextDiv)
    taskContainer.appendChild(taskControlDiv)

    mainDiv.prepend(taskContainer)


}
function loadTasks(){
    if(taskArr.length > 0){
        taskArr.forEach(task => renderTask(task))
        
        taskList.style.display = "flex"
        taskList.style.margin = "30px 0px"
        taskList.style.maxWidth = "80vw"
        taskList.style.flexWrap = "wrap"
        parent.style.margin = "60px 10px"
    }else{
        taskList.style.display = "none"
    }
}
addTaskBtn.addEventListener("click",function(){
    if(!inputTask.value)return
    let newTask = {"description" : inputTask.value, "sts" : false}
    taskArr.unshift(newTask)
    saveTasks()
    renderTask(newTask)

    taskList.style.display = "flex"
    taskList.style.margin = "30px 0px"
    taskList.style.maxWidth = "80vw"
    taskList.style.flexWrap = "wrap"
    parent.style.margin = "60px 10px"

    inputTask.value = ""
})

window.addEventListener("DOMContentLoaded", loadTasks)