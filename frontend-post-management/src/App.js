import React, { Component } from 'react';
import './App.css';

import { Switch, Route, Link } from 'react-router-dom'
import Home from './views/Home.js';
import Register from './views/Register.js';
import Login from './views/Login.js';
import Post from './views/Post.js';
import CreatePost from './views/CreatePost.js';
import editPost from './views/editPost.js';
import PostDetail from './views/PostDetail.js';
import HocTest from './views/HocTest.js';
import AuthMiddleware from './AuthMiddle';

let token = localStorage.getItem('token');            

class App extends Component {
  ShowLogin(){
    let loginorlogout = <Link className="nav-link" to='/login'>Login</Link>;
    if(token){
      loginorlogout = <a className="nav-link" href="" onClick={this.logout}>Logout</a>;
    }
    return loginorlogout;
  }

  logout(){
    localStorage.removeItem('token');
    this.history.push('/');
  }

  showRegisterOrPost(){
    let registerOrPost = <Link className="nav-link" to='/register'>Register</Link>;
    if(token){
      registerOrPost = <Link className="nav-link" to='/post'>User Posts</Link>;
    }
    return registerOrPost;
  }

  render() {
    return (
      
      <div>

        <div className="header">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
						<div className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav mr-auto container">
								<li className="nav-item active">
									<Link className="nav-link" to='/'>Home</Link> 
								</li>
								<li className="nav-item">
									{this.showRegisterOrPost()}
								</li>								
                <li className="nav-item">
                  {this.ShowLogin()}									
								</li>								
							</ul>    
						</div>
					</nav>
        </div>

        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/post" component={AuthMiddleware(Post)} />
            <Route path="/create-post" component={AuthMiddleware(CreatePost)} />
            <Route path="/editPost/:id" component={AuthMiddleware(editPost)} />            
            <Route path="/post-detail/:id" component={PostDetail} />            
            <Route path="/hoctest" component={HocTest} />
          </Switch>
        </div>

      </div>

    );
  }
}

export default App;
