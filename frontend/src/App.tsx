import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import axios from "axios";

function App() {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [modal, setModal] = useState(false);
  const [todoList, setTodoList] = useState<any[]>();
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => {
        setTodoList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const displayCompleted = (status: boolean) => {
    if (status) {
      return setViewCompleted(true);
    }

    return setViewCompleted(false);
  };

  const renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={viewCompleted ? "nav-link active cursor-pointer" : "nav-link cursor-pointer"}
          onClick={() => displayCompleted(true)}
        >
          Complete
        </span>
        <span
          className={viewCompleted ? "nav-link cursor-pointer" : "nav-link active cursor-pointer" }
          onClick={() => displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const renderItems = () => {
    const newItems =
      todoList && todoList.filter((item) => item.completed === viewCompleted);

    return (
      newItems &&
      newItems.map((item) => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${
              viewCompleted ? "completed-todo" : ""
            }`}
            title={item.description}
          >
            {item.title}
          </span>
          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => editItem(item)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(item)}
            >
              Delete
            </button>
          </span>
        </li>
      ))
    );
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item: any) => {
    toggle();
    if (item.id) {
      axios.put(`/api/todos/${item.id}/`, item).then((res) => refreshList());
      return;
    }
    axios.post("/api/todos/", item).then((res) => refreshList());
  };

  const handleDelete = (item: any) => {
    axios.delete(`/api/todos/${item.id}/`).then((res) => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };

    setActiveItem(item);
    setModal(!modal);
  };

  const editItem = (item: any) => {
    setActiveItem(item);
    setModal(!modal);
  };

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4">
              <button className="btn btn-primary" onClick={() => createItem()}>
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush border-top-0">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
      {modal ? (
        <Modal
          activeItemReceived={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </main>
  );
}

export default App;
