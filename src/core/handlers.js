import {
  confirmBox,
  editRow,
  removeRow,
  renderRow,
  rowUi,
  toast,
  url,
} from "./functions";
import { courseEditForm, courseForm, editDrawer, rowGroup } from "./selectors";

export function searchInputHandler(event) {
  event.target.previousElementSibling.innerHTML = `
  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 animate-spin"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
  `;
  fetch(url(`/courses?title[like]=${event.target.value}`))
    .then((res) => res.json())
    .then((result) => {
      event.target.previousElementSibling.innerHTML = `
      <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
      `;
      console.log(result);
      if (result.length) {
        renderRow(result);
      } else {
        toast("No courses found!", "error");
        rowGroup.innerHTML = `<tr><td colspan='5' class="px-6 py-4 text-center text-gray-400 font-medium text-xl">There is no course. <a href='http://${location.host}' class='underline text-blue-500'>Browse all</a></td></tr>`;
      }
    });
}

export function editCellHandler(event) {
  if (event.target.classList.contains("cell-editable")) {
    const currentCell = event.target;
    const currentRow = event.target.closest("tr");
    const currentRowId = currentRow.getAttribute("course-id");
    const currentCellColName = currentCell.getAttribute("cell-col");
    const currentText = currentCell.innerText;

    currentCell.innerText = "";
    const input = document.createElement("input");
    input.value = currentText;
    input.className =
      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    currentCell.appendChild(input);
    input.focus();

    input.addEventListener("blur", () => {
      const newValue = input.value;
      currentCell.innerText = newValue;

      const myHeader = new Headers();
      myHeader.append("Content-Type", "application/json");

      const updateData = {};
      updateData[currentCellColName] = newValue;

      const jsonData = JSON.stringify(updateData);

      fetch(url(`/courses/${currentRowId}`), {
        method: "PATCH",
        headers: myHeader,
        body: jsonData,
      })
        .then((res) => res.json())
        .then((result) => {
          toast("Updated successfully...!");
          console.log(result);
        });
    });
  }
}

export function courseFormHandler(event) {
  event.preventDefault();
  console.log("you submitted");

  const formData = new FormData(courseForm);
  const jsonData = JSON.stringify({
    title: formData.get("course_title"),
    short_name: formData.get("short_name"),
    fee: formData.get("course_fee"),
  });
  console.log(jsonData);

  const myHeader = new Headers();
  myHeader.append("Content-Type", "application/json");

  courseForm.querySelector("button").toggleAttribute("disabled");

  fetch(url("/courses"), {
    method: "POST",
    headers: myHeader,
    body: jsonData,
  })
    .then((res) => res.json())
    .then((result) => {
      courseForm.querySelector("button").toggleAttribute("disabled");
      rowGroup.appendChild(rowUi(result));
      event.target.reset();
      toast("Created successfully...!");
    });
}

export function rowGroupHandler(event) {
  if (event.target.classList.contains("row-del")) {
    removeRow(event.target.closest("tr").getAttribute("course-id"));
  } else if (event.target.classList.contains("row-edit")) {
    editRow(event.target.closest("tr").getAttribute("course-id"));
  }
}

export function courseEditFormHandler(event) {
  event.preventDefault();
  const formData = new FormData(courseEditForm);
  const currentId = formData.get("edit_course_id");
  const jsonData = JSON.stringify({
    title: formData.get("edit_course_title"),
    short_name: formData.get("edit_short_name"),
    fee: formData.get("edit_course_fee"),
  });

  const myHeader = new Headers();
  myHeader.append("Content-Type", "application/json");

  courseEditForm.querySelector("button").toggleAttribute("disabled");

  fetch(url(`/courses/${currentId}`), {
    method: "PUT",
    headers: myHeader,
    body: jsonData,
  })
    .then((res) => res.json())
    .then((result) => {
      courseEditForm.querySelector("button").toggleAttribute("disabled");
      courseEditForm.reset();
      editDrawer.hide();
      const currentRow = rowGroup.querySelector(`tr[course-id='${result.id}']`);
      currentRow.querySelector(".row-title").innerText = result.title;
      currentRow.querySelector(".row-short").innerText = result.short_name;
      currentRow.querySelector(".row-fee").innerText = result.fee;
    });
}
