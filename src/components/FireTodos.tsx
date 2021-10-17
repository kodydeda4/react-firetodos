import { Logout } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Checkbox,
  Container,
  List,
  ListItem,
  Stack,
  TextField
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import React, { useEffect } from "react";
import { firestore } from "../config/firebase";
import Todo from "../types/Todo";

export default function FireTodos() {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const updateTodos = React.useEffect(() => {
    onSnapshot(
      // query(firestore.todos2, orderBy("timestamp", "desc")),
      query(firestore.todos2),
      (snapshot) =>
        setTodos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
    );
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Firetodos
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => addTodo()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
                <Button
                  onClick={() => clearAll()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => clearDone()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear Done
                </Button>
                <Button
                  // onClick={() => viewStore.action.logout()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<Logout />}
                >
                  Logout
                </Button>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <List
        sx={{
          bgcolor: "background.paper",
          overflow: "auto",
          height: "100vh",
        }}
      >
        <Container>
          {todos.map((todo: Todo) => (
            <ListItem>
              <Checkbox
                onClick={() => toggleDone(todo)}
                edge="start"
                checked={todo.done}
              />
              <TextField
                placeholder={todo.text}
                autoFocus
                variant="standard"
                fullWidth
              />
              {/* {todo.text} {todo.id} */}
            </ListItem>
          ))}
        </Container>
      </List>
    </>
  );
}

// -----------------------------------------------------------------------------------------------------------------

const Todos = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const queryText = "3";

  const updateTodos = useEffect(() => {
    onSnapshot(
      query(firestore.todos2, orderBy("timestamp", "desc")),
      (snapshot) =>
        setTodos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
    );
  }, []);

  return (
    <>
      <button onClick={() => addTodo()}>New</button>
      <button onClick={() => clearDone()}>Clear Done</button>
      <button onClick={() => clearAll()}>Clear All</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            <button onClick={() => toggleDone(todo)}>edit</button>
            <button onClick={() => deleteTodo(todo)}>delete</button>
            <span
              style={{
                height: 15,
                width: 15,
                margin: "0px 10px",
                backgroundColor: todo.done ? "green" : "red",
                borderRadius: "50%",
                display: "inline-block",
              }}
            ></span>
            {todo.text} {todo.id}
          </li>
        ))}
      </ul>
    </>
  );
};

// -----------------------------------------------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------------------------------------------
const addTodo = async () => {
  await addDoc(firestore.todos2, {
    text: "untitled",
    done: false,
    timestamp: serverTimestamp(),
  });
};

const deleteTodo = async (todo: Todo) => {
  await deleteDoc(doc(firestore.todos2, todo.id));
};

const toggleDone = async (todo: Todo) => {
  updateDoc(doc(firestore.todos2, todo.id), {
    text: todo.text,
    done: !todo.done,
    timestamp: serverTimestamp(),
  });
};

const clearDone = async () => {
  const snapshot = await getDocs(
    query(firestore.todos2, where("done", "==", true))
  );

  snapshot.docs
    .map((doc) => doc.id)
    .forEach(async (id) => await deleteDoc(doc(firestore.todos2, id)));
};

const clearAll = async () => {
  const snapshot = await getDocs(firestore.todos2);

  snapshot.docs
    .map((doc) => doc.id)
    .forEach(async (id) => await deleteDoc(doc(firestore.todos2, id)));
};
