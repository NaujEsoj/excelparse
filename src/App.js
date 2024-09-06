import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Parse from "./components/Parse";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Parse />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
