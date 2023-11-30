import { baseUrl } from "./config";
import { editDrawer, rowGroup, rowTemplate } from "./selectors";
import Swal from "sweetalert2";

export function rowUi({ id, title, short_name, fee }) {
  const row = rowTemplate.content.cloneNode(true);
  row.querySelector("tr").setAttribute("course-id", id);
  row.querySelector(".row-id").innerText = id;
  row.querySelector(".row-title").innerText = title;
  row.querySelector(".row-short").innerText = short_name;
  row.querySelector(".row-fee").innerText = fee;
  return row;
}

export function renderRow(rows) {
  rowGroup.innerHTML = "";
  rows.forEach((row) => rowGroup.appendChild(rowUi(row)));
}

export function url(path) {
  return baseUrl + path;
}

export function toast(message, icon = "success") {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-left",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon,
    title: message,
  });
}

export function confirmBox(
  approve,
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  icon = "warning",
  confirmButtonText = "Confirm"
) {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      approve();
    }
  });
}

export async function removeRow(id) {
  const currentRow = document.querySelector(`tr[course-id='${id}']`);
  confirmBox(async () => {
    currentRow.querySelector(".row-del").toggleAttribute("disabled");
    const res = await fetch(url(`/courses/${id}`), {
      method: "DELETE",
    });
    currentRow.querySelector(".row-del").toggleAttribute("disabled");
    res.status === 204 && toast("Deleted successfully...!");
    currentRow.remove();
  });
}

export async function editRow(id) {
  const currentRow = document.querySelector(`tr[course-id='${id}']`);
  currentRow.querySelector(".row-edit").toggleAttribute("disabled");

  const res = await fetch(url(`/courses/${id}`));
  const result = await res.json();

  currentRow.querySelector(".row-edit").toggleAttribute("disabled");
  courseEditForm.querySelector("#edit_course_id").value = result.id;
  courseEditForm.querySelector("#edit_course_title").value = result.title;
  courseEditForm.querySelector("#edit_short_name").value = result.short_name;
  courseEditForm.querySelector("#edit_course_fee").value = result.fee;
  editDrawer.show();
}
