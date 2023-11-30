import { renderRow, url } from "./functions";

export default function initialRenders() {
  fetch(url("/courses"))
    .then((res) => res.json())
    .then((result) => renderRow(result));
}
