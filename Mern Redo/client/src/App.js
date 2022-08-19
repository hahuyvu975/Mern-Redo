import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './components/layout/Landing';
// import LoginForm from './components/auth/LoginForm';
import Auth from './components/views/Auth';
function App() {


  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" render={props => <Auth {...props} authRoute='login' />} />
        <Route exact path="/register" render={props => <Auth {...props} authRoute='register' />} />
      </Switch>
    </Router>
  );
}

export default App;
