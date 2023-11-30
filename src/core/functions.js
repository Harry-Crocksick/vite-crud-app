import { baseUrl } from "./config";
import { rowGroup, rowTemplate } from "./selectors";
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
