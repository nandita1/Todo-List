const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

var port = process.env.PORT || 3000;

mongoose.set("useFindAndModify", false);
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("Connected to db on " + port);
    app.listen(port, () => console.log("Server Up and running"));
  }
);

app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });

  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//DELETE

app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

app.route("/done/:id/:done").get((req, res) => {
  const id = req.params.id;
  let done_task = req.params.done;
  //console.log(done_task);
  if (done_task == 0) done_task = 1;
  else done_task = 0;
  //console.log(done_task);
  TodoTask.findByIdAndUpdate(id, { done: done_task }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
