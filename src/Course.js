import initialRenders from "./core/initialRenders";
import listeners from "./core/listeners";

class Course {
  init() {
    console.log("App start");
    initialRenders();
    listeners();
  }
}

export default Course;
